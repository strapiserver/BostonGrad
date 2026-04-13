const TelegramBot = require('node-telegram-bot-api');
const {
  botToken,
  tgRateLimitMs,
  tgSessionTtlSec,
  tgMaxAnswerLength,
  tgAllowedChatTypes,
  telegramSocialnetworkName,
} = require('./config');
const { verifyLeadStartCode } = require('./leadLinkCode');
const {
  getLeadById,
  getQuestions,
  ensureTelegramLeadContact,
  createResponse,
} = require('./strapiClient');

const bot = new TelegramBot(botToken, { polling: true });

const sessions = new Map(); // chatId -> { leadId, questions, index, expiresAt, finalText }
const rateLimit = new Map(); // userId -> ts

const touchRateLimit = (userId) => {
  const now = Date.now();
  const last = rateLimit.get(userId) || 0;
  if (now - last < tgRateLimitMs) return false;
  rateLimit.set(userId, now);
  return true;
};

const normalizeAnswer = (text) => String(text || '').trim();

const renderQuestion = (q) => {
  const requiredMark = q.isOptional ? '' : ' *';
  const header = `${q.text}${requiredMark}`;
  if (q.options.length) {
    const opts = q.options.map((o, i) => `${i + 1}. ${o}`).join('\n');
    return `${header}\n\nВыберите один вариант:\n${opts}`;
  }
  if (q.isBoolean) {
    return `${header}`;
  }
  return `${header}`;
};

const buildQuestionReplyMarkup = (q, questionIndex) => {
  if (q.options.length) {
    return {
      inline_keyboard: q.options.map((option) => [
        {
          text: option,
          callback_data: `ans:${questionIndex}:${Buffer.from(option, 'utf8').toString('base64url')}`,
        },
      ]),
    };
  }

  if (q.isBoolean) {
    return {
      inline_keyboard: [
        [
          { text: 'ДА', callback_data: `ans:${questionIndex}:true` },
          { text: 'НЕТ', callback_data: `ans:${questionIndex}:false` },
        ],
      ],
    };
  }

  return { remove_keyboard: true };
};

const parseAnswer = (q, textRaw) => {
  const text = normalizeAnswer(textRaw);
  if (!text && !q.isOptional) return { ok: false, error: 'Это обязательный вопрос.' };
  if (!text && q.isOptional) return { ok: true, value: '' };

  if (text.length > tgMaxAnswerLength) {
    return { ok: false, error: `Слишком длинный ответ (макс ${tgMaxAnswerLength} символов).` };
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
    if (['да'].includes(low)) return { ok: true, value: 'true' };
    if (['нет'].includes(low)) return { ok: true, value: 'false' };
    if (['да', 'yes', 'y', 'true', '1'].includes(low)) return { ok: true, value: 'true' };
    if (['нет', 'no', 'n', 'false', '0'].includes(low)) return { ok: true, value: 'false' };
    return { ok: false, error: 'Ответьте: да или нет.' };
  }

  return { ok: true, value: text };
};

const sendCurrentQuestion = async (chatId) => {
  const s = sessions.get(chatId);
  if (!s) return;
  const q = s.questions[s.index];
  if (!q) {
    await bot.sendMessage(chatId, s.finalText || 'Опрос завершен. Спасибо!', {
      reply_markup: { remove_keyboard: true },
    });
    sessions.delete(chatId);
    return;
  }
  await bot.sendMessage(chatId, renderQuestion(q), {
    reply_markup: buildQuestionReplyMarkup(q, s.index),
  });
};

const persistAnswerAndNext = async (chatId, answerValue) => {
  const session = sessions.get(chatId);
  if (!session) return;
  const question = session.questions[session.index];
  if (!question) {
    sessions.delete(chatId);
    return;
  }

  await createResponse({
    leadId: session.leadId,
    questionId: question.id,
    answer: answerValue,
  });

  session.index += 1;
  session.expiresAt = Date.now() + tgSessionTtlSec * 1000;
  sessions.set(chatId, session);
  await sendCurrentQuestion(chatId);
};

bot.on('callback_query', async (query) => {
  try {
    const chatId = query?.message?.chat?.id;
    const fromId = query?.from?.id;
    const data = String(query?.data || '');
    if (!chatId || !fromId || !data.startsWith('ans:')) return;
    if (!touchRateLimit(fromId)) return;

    const session = sessions.get(chatId);
    if (!session) {
      await bot.answerCallbackQuery(query.id, { text: 'Сессия не найдена' });
      return;
    }
    if (Date.now() > session.expiresAt) {
      sessions.delete(chatId);
      await bot.answerCallbackQuery(query.id, { text: 'Сессия истекла' });
      return;
    }

    const [, idxRaw, payload] = data.split(':');
    const idx = Number(idxRaw);
    if (!Number.isFinite(idx) || idx !== session.index) {
      await bot.answerCallbackQuery(query.id, { text: 'Неактуальная кнопка' });
      return;
    }

    const question = session.questions[session.index];
    if (!question) {
      sessions.delete(chatId);
      await bot.answerCallbackQuery(query.id);
      return;
    }

    let answer = payload;
    if (question.options.length) {
      answer = Buffer.from(payload || '', 'base64url').toString('utf8');
    }

    const parsed = parseAnswer(question, answer);
    if (!parsed.ok) {
      await bot.answerCallbackQuery(query.id, { text: parsed.error });
      return;
    }

    await bot.answerCallbackQuery(query.id);
    await persistAnswerAndNext(chatId, parsed.value);
  } catch (error) {
    console.error('Callback handler error:', error);
    if (query?.id) {
      await bot.answerCallbackQuery(query.id, { text: 'Ошибка' });
    }
  }
});

bot.on('message', async (msg) => {
  try {
    if (!msg?.chat?.id || !msg?.from?.id) return;
    if (!touchRateLimit(msg.from.id)) return;

    if (!tgAllowedChatTypes.includes(msg.chat.type)) {
      await bot.sendMessage(msg.chat.id, 'Поддерживаются только приватные чаты.');
      return;
    }

    const text = String(msg.text || '').trim();
    if (!text) return;

    if (text.startsWith('/start')) {
      const parts = text.split(/\s+/g).filter(Boolean);
      const token = parts[1] || '';
      if (!token) {
        await bot.sendMessage(
          msg.chat.id,
          'Нужен персональный код из формы. Откройте бота по персональной ссылке.',
        );
        return;
      }

      const verified = verifyLeadStartCode(token);
      if (!verified.ok) {
        await bot.sendMessage(msg.chat.id, 'Ссылка недействительна или устарела.');
        return;
      }

      const lead = await getLeadById(verified.leadId);
      if (!lead) {
        await bot.sendMessage(msg.chat.id, 'Лид не найден.');
        return;
      }

      const existingTgContact = (lead.contacts || []).find(
        (c) =>
          c.socialnetworkName.toLowerCase() ===
            telegramSocialnetworkName.toLowerCase() &&
          c.user_id,
      );

      if (existingTgContact && existingTgContact.user_id !== String(msg.from.id)) {
        await bot.sendMessage(msg.chat.id, 'Этот код уже привязан к другому Telegram аккаунту.');
        return;
      }

      if (existingTgContact?.isBanned) {
        await bot.sendMessage(msg.chat.id, 'Ваш контакт заблокирован.');
        return;
      }

      if (!existingTgContact) {
        await ensureTelegramLeadContact({
          leadId: lead.id,
          tgUserId: String(msg.from.id),
          username: msg.from.username || '',
        });
      }

      const allQuestions = await getQuestions('ru');
      if (!allQuestions.length) {
        await bot.sendMessage(msg.chat.id, 'Вопросов пока нет.');
        return;
      }
      const finalQuestion = allQuestions.find(
        (q) => String(q.name || '').toLowerCase() === 'final',
      );
      const greetingQuestion = allQuestions.find(
        (q) => String(q.name || '').toLowerCase() === 'greeting',
      );
      const questions = allQuestions.filter(
        (q) => {
          const name = String(q.name || '').toLowerCase();
          return name !== 'final' && name !== 'greeting';
        },
      );
      if (!questions.length) {
        await bot.sendMessage(
          msg.chat.id,
          finalQuestion?.text || 'Опрос завершен. Спасибо!',
          { reply_markup: { remove_keyboard: true } },
        );
        return;
      }

      sessions.set(msg.chat.id, {
        leadId: lead.id,
        questions,
        index: 0,
        expiresAt: Date.now() + tgSessionTtlSec * 1000,
        finalText: finalQuestion?.text || '',
      });

      await bot.sendMessage(
        msg.chat.id,
        `Здравствуйте, ${lead.name || 'студент'}! ${greetingQuestion?.text || 'Начнём опрос.'}`,
      );
      await sendCurrentQuestion(msg.chat.id);
      return;
    }

    if (text === '/cancel') {
      sessions.delete(msg.chat.id);
      await bot.sendMessage(msg.chat.id, 'Опрос отменен.');
      return;
    }

    const session = sessions.get(msg.chat.id);
    if (!session) return;

    if (Date.now() > session.expiresAt) {
      sessions.delete(msg.chat.id);
      await bot.sendMessage(msg.chat.id, 'Сессия истекла. Нажмите /start по вашей персональной ссылке снова.');
      return;
    }

    const question = session.questions[session.index];
    if (!question) {
      sessions.delete(msg.chat.id);
      return;
    }

    const parsed = parseAnswer(question, text);
    if (!parsed.ok) {
      await bot.sendMessage(msg.chat.id, parsed.error);
      await sendCurrentQuestion(msg.chat.id);
      return;
    }

    await persistAnswerAndNext(msg.chat.id, parsed.value);
  } catch (error) {
    console.error('Bot handler error:', error);
    if (msg?.chat?.id) {
      await bot.sendMessage(msg.chat.id, 'Ошибка обработки. Попробуйте позже.');
    }
  }
});

module.exports = { bot };
