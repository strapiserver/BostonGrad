const express = require('express');
const {
  port,
  igVerifyToken,
  igRateLimitMs,
  igSessionTtlSec,
  igMaxAnswerLength,
} = require('./config');
const { verifyLeadStartCode } = require('./leadLinkCode');
const {
  getLeadById,
  getLeadByInstagramUserId,
  createLead,
  getQuestions,
  ensureInstagramLeadContact,
  createResponse,
} = require('./strapiClient');
const { sendText } = require('./metaApi');

const app = express();
app.use(express.json({ limit: '1mb' }));

const sessions = new Map();
const rateLimit = new Map();

const touchRateLimit = (userId) => {
  const now = Date.now();
  const last = rateLimit.get(userId) || 0;
  if (now - last < igRateLimitMs) return false;
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
  if (text.length > igMaxAnswerLength) {
    return { ok: false, error: `Слишком длинный ответ (макс ${igMaxAnswerLength}).` };
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

const sendCurrentQuestion = async (userId) => {
  const s = sessions.get(userId);
  if (!s) return;
  const q = s.questions[s.index];
  if (!q) {
    await sendText(userId, s.finalText || 'Опрос завершен. Спасибо!');
    sessions.delete(userId);
    return;
  }
  await sendText(userId, renderQuestion(q));
};

const startQuizForLead = async ({ userId, lead }) => {
  const allQuestions = await getQuestions('ru');
  const finalQuestion = allQuestions.find((q) => String(q.name || '').toLowerCase() === 'final');
  const greetingQuestion = allQuestions.find((q) => String(q.name || '').toLowerCase() === 'greeting');
  const questions = allQuestions.filter((q) => {
    const name = String(q.name || '').toLowerCase();
    return name !== 'final' && name !== 'greeting';
  });

  if (!questions.length) {
    await sendText(userId, finalQuestion?.text || 'Опрос завершен. Спасибо!');
    return;
  }

  sessions.set(String(userId), {
    leadId: lead.id,
    questions,
    index: 0,
    expiresAt: Date.now() + igSessionTtlSec * 1000,
    finalText: finalQuestion?.text || '',
  });

  await sendText(
    userId,
    `Здравствуйте, ${lead.name || 'студент'}! ${greetingQuestion?.text || 'Начнём опрос.'}`,
  );
  await sendCurrentQuestion(String(userId));
};

const processMessage = async (userId, text) => {
  if (!touchRateLimit(userId)) return;

  const normalized = String(text || '').trim();
  if (!normalized) return;

  const startMatch = normalized.match(/^start\s+(.+)$/i);
  if (startMatch) {
    const token = startMatch[1].trim();
    const verified = verifyLeadStartCode(token);
    if (!verified.ok) {
      await sendText(userId, 'Ссылка недействительна или устарела.');
      return;
    }

    const lead = await getLeadById(verified.leadId);
    if (!lead) {
      await sendText(userId, 'Лид не найден.');
      return;
    }

    const existing = (lead.contacts || []).find(
      (c) => c.socialnetworkName.toLowerCase() === 'instagram' && c.user_id,
    );

    if (existing && existing.user_id !== String(userId)) {
      await sendText(userId, 'Этот код уже привязан к другому Instagram аккаунту.');
      return;
    }
    if (existing?.isBanned) {
      await sendText(userId, 'Ваш контакт заблокирован.');
      return;
    }

    if (!existing) {
      await ensureInstagramLeadContact({ leadId: lead.id, userId: String(userId) });
    }

    await startQuizForLead({ userId, lead });
    return;
  }

  if (/^cancel$/i.test(normalized)) {
    sessions.delete(String(userId));
    await sendText(userId, 'Опрос отменен.');
    return;
  }

  const session = sessions.get(String(userId));
  if (!session) {
    let lead = await getLeadByInstagramUserId(String(userId));
    if (!lead) {
      const leadId = await createLead({
        name: `Instagram ${String(userId).slice(-6)}`,
        userAgent: 'instagram',
      });
      await ensureInstagramLeadContact({ leadId, userId: String(userId) });
      lead = await getLeadById(leadId);
    }
    if (!lead) {
      await sendText(userId, 'Не удалось начать опрос. Попробуйте позже.');
      return;
    }
    await startQuizForLead({ userId, lead });
    return;
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(String(userId));
    await sendText(userId, 'Сессия истекла. Нужен новый START код.');
    return;
  }

  const q = session.questions[session.index];
  if (!q) {
    sessions.delete(String(userId));
    return;
  }

  const parsed = parseAnswer(q, normalized);
  if (!parsed.ok) {
    await sendText(userId, parsed.error);
    await sendCurrentQuestion(String(userId));
    return;
  }

  await createResponse({ leadId: session.leadId, questionId: q.id, answer: parsed.value });
  session.index += 1;
  session.expiresAt = Date.now() + igSessionTtlSec * 1000;
  sessions.set(String(userId), session);
  await sendCurrentQuestion(String(userId));
};

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === igVerifyToken) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

app.post('/webhook', async (req, res) => {
  try {
    console.log('IG webhook payload received:', {
      object: req.body?.object,
      entries: Array.isArray(req.body?.entry) ? req.body.entry.length : 0,
    });
    const entries = Array.isArray(req.body?.entry) ? req.body.entry : [];
    for (const entry of entries) {
      const events = Array.isArray(entry?.messaging) ? entry.messaging : [];
      console.log('IG entry events:', events.length);
      for (const event of events) {
        const userId = String(event?.sender?.id || '');
        if (!userId) continue;

        const text = String(
          event?.message?.text || event?.postback?.payload || event?.postback?.title || '',
        ).trim();
        if (!text) {
          console.log('IG skip event without text:', {
            sender: userId,
            hasMessage: Boolean(event?.message),
            hasPostback: Boolean(event?.postback),
          });
          continue;
        }

        console.log('IG incoming text:', { sender: userId, text });
        await processMessage(userId, text);
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
    console.log(`Instagram bot webhook listening on :${port}`);
  });
};

module.exports = { start };
