const express = require('express');
const {
  port,
  waVerifyToken,
  waPhoneNumberId,
  waRateLimitMs,
  waSessionTtlSec,
  waMaxAnswerLength,
} = require('./config');
const { verifyLeadStartCode } = require('./leadLinkCode');
const {
  getLeadById,
  getQuestions,
  ensureWhatsAppLeadContact,
  createResponse,
} = require('./strapiClient');
const { sendText } = require('./waApi');

const app = express();
app.use(express.json({ limit: '1mb' }));

const sessions = new Map(); // waUserId -> { leadId, questions, index, expiresAt, finalText }
const rateLimit = new Map(); // waUserId -> ts

const touchRateLimit = (userId) => {
  const now = Date.now();
  const last = rateLimit.get(userId) || 0;
  if (now - last < waRateLimitMs) return false;
  rateLimit.set(userId, now);
  return true;
};

const renderQuestion = (q) => {
  const requiredMark = q.isOptional ? '' : ' *';
  const header = `${q.text}${requiredMark}`;
  if (q.options.length) {
    const opts = q.options.map((o, i) => `${i + 1}. ${o}`).join('\n');
    return `${header}\n\nВыберите вариант (номер или текст):\n${opts}`;
  }
  if (q.isBoolean) return `${header}\n\nОтвет: ДА или НЕТ`;
  return `${header}`;
};

const parseAnswer = (q, textRaw) => {
  const text = String(textRaw || '').trim();
  if (!text && !q.isOptional) return { ok: false, error: 'Это обязательный вопрос.' };
  if (!text && q.isOptional) return { ok: true, value: '' };
  if (text.length > waMaxAnswerLength) {
    return { ok: false, error: `Слишком длинный ответ (макс ${waMaxAnswerLength}).` };
  }

  if (q.options.length) {
    const idx = Number(text);
    if (Number.isFinite(idx) && idx >= 1 && idx <= q.options.length) {
      return { ok: true, value: q.options[idx - 1] };
    }
    const direct = q.options.find((o) => o.toLowerCase() === text.toLowerCase());
    if (direct) return { ok: true, value: direct };
    return { ok: false, error: 'Выберите вариант по номеру или точному тексту.' };
  }

  if (q.isBoolean) {
    const low = text.toLowerCase();
    if (['да', 'yes', 'y', 'true', '1'].includes(low)) return { ok: true, value: 'true' };
    if (['нет', 'no', 'n', 'false', '0'].includes(low)) return { ok: true, value: 'false' };
    return { ok: false, error: 'Ответьте: ДА или НЕТ.' };
  }

  return { ok: true, value: text };
};

const sendCurrentQuestion = async (waUserId) => {
  const s = sessions.get(waUserId);
  if (!s) return;
  const q = s.questions[s.index];
  if (!q) {
    await sendText(waUserId, s.finalText || 'Опрос завершен. Спасибо!');
    sessions.delete(waUserId);
    return;
  }
  await sendText(waUserId, renderQuestion(q));
};

const processMessage = async (waUserId, text) => {
  if (!touchRateLimit(waUserId)) return;

  const normalized = String(text || '').trim();
  if (!normalized) return;

  const startMatch = normalized.match(/^start\s+(.+)$/i);
  if (startMatch) {
    const token = startMatch[1].trim();
    const verified = verifyLeadStartCode(token);
    if (!verified.ok) {
      await sendText(waUserId, 'Ссылка недействительна или устарела.');
      return;
    }

    const lead = await getLeadById(verified.leadId);
    if (!lead) {
      await sendText(waUserId, 'Лид не найден.');
      return;
    }

    const existingWa = (lead.contacts || []).find(
      (c) => c.socialnetworkName.toLowerCase() === 'whatsapp' && c.user_id,
    );

    if (existingWa && existingWa.user_id !== String(waUserId)) {
      await sendText(waUserId, 'Этот код уже привязан к другому WhatsApp аккаунту.');
      return;
    }
    if (existingWa?.isBanned) {
      await sendText(waUserId, 'Ваш контакт заблокирован.');
      return;
    }

    if (!existingWa) {
      await ensureWhatsAppLeadContact({ leadId: lead.id, waUserId: String(waUserId) });
    }

    const allQuestions = await getQuestions('ru');
    const finalQuestion = allQuestions.find(
      (q) => String(q.name || '').toLowerCase() === 'final',
    );
    const greetingQuestion = allQuestions.find(
      (q) => String(q.name || '').toLowerCase() === 'greeting',
    );
    const questions = allQuestions.filter((q) => {
      const name = String(q.name || '').toLowerCase();
      return name !== 'final' && name !== 'greeting';
    });

    if (!questions.length) {
      await sendText(waUserId, finalQuestion?.text || 'Опрос завершен. Спасибо!');
      return;
    }

    sessions.set(String(waUserId), {
      leadId: lead.id,
      questions,
      index: 0,
      expiresAt: Date.now() + waSessionTtlSec * 1000,
      finalText: finalQuestion?.text || '',
    });

    await sendText(
      waUserId,
      `Здравствуйте, ${lead.name || 'студент'}! ${greetingQuestion?.text || 'Начнём опрос.'}`,
    );
    await sendCurrentQuestion(String(waUserId));
    return;
  }

  if (/^cancel$/i.test(normalized)) {
    sessions.delete(String(waUserId));
    await sendText(waUserId, 'Опрос отменен.');
    return;
  }

  const session = sessions.get(String(waUserId));
  if (!session) {
    await sendText(waUserId, 'Для начала отправьте сообщение: START <код>');
    return;
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(String(waUserId));
    await sendText(waUserId, 'Сессия истекла. Нужен новый START код.');
    return;
  }

  const q = session.questions[session.index];
  if (!q) {
    sessions.delete(String(waUserId));
    return;
  }

  const parsed = parseAnswer(q, normalized);
  if (!parsed.ok) {
    await sendText(waUserId, parsed.error);
    await sendCurrentQuestion(String(waUserId));
    return;
  }

  await createResponse({ leadId: session.leadId, questionId: q.id, answer: parsed.value });
  session.index += 1;
  session.expiresAt = Date.now() + waSessionTtlSec * 1000;
  sessions.set(String(waUserId), session);
  await sendCurrentQuestion(String(waUserId));
};

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === waVerifyToken) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  try {
    const entries = Array.isArray(req.body?.entry) ? req.body.entry : [];
    for (const entry of entries) {
      const changes = Array.isArray(entry?.changes) ? entry.changes : [];
      for (const change of changes) {
        const value = change?.value || {};
        const incomingPhoneNumberId = String(value?.metadata?.phone_number_id || '');
        if (waPhoneNumberId && incomingPhoneNumberId && incomingPhoneNumberId !== String(waPhoneNumberId)) {
          continue;
        }
        const messages = Array.isArray(value?.messages) ? value.messages : [];
        for (const msg of messages) {
          const waUserId = msg?.from;
          if (!waUserId) continue;
          let text = '';
          if (msg?.type === 'text') text = msg?.text?.body || '';
          if (msg?.type === 'button') text = msg?.button?.text || '';
          if (!text) continue;
          await processMessage(String(waUserId), text);
        }
      }
    }
    return res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    return res.sendStatus(200);
  }
});

const start = () => {
  app.listen(port, () => {
    console.log(`WhatsApp bot webhook listening on :${port}`);
  });
};

module.exports = { start };
