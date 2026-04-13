require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const required = ['BOT_TOKEN', 'STRAPI_AUTH_IDENTIFIER', 'STRAPI_AUTH_PASSWORD'];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

module.exports = {
  botToken: process.env.BOT_TOKEN,
  strapiUrl: process.env.STRAPI_URL || 'https://cms.bostongrad.com/graphql',
  strapiAuthIdentifier: process.env.STRAPI_AUTH_IDENTIFIER,
  strapiAuthPassword: process.env.STRAPI_AUTH_PASSWORD,
  leadLinkSecret:
    process.env.LEAD_TELEGRAM_LINK_SECRET ||
    process.env.LEADS_DASHBOARD_SESSION_SECRET ||
    'dev-lead-telegram-secret-change-me',
  telegramSocialnetworkName: process.env.TELEGRAM_SOCIALNETWORK_NAME || 'Telegram',
  tgRateLimitMs: Number(process.env.TG_RATE_LIMIT_MS || 700),
  tgSessionTtlSec: Number(process.env.TG_SESSION_TTL_SEC || 1800),
  tgMaxAnswerLength: Number(process.env.TG_MAX_ANSWER_LENGTH || 500),
  tgStartCodeTtlSec: Number(process.env.TG_START_CODE_TTL_SEC || 604800),
  tgAllowedChatTypes: (process.env.TG_ALLOWED_CHAT_TYPES || 'private')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean),
  tgBooleanQuestionNames: (process.env.TG_BOOLEAN_QUESTION_NAMES || 'together,university')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean),
};
