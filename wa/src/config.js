require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const missing = [];
if (!process.env.STRAPI_AUTH_IDENTIFIER) missing.push('STRAPI_AUTH_IDENTIFIER');
if (!process.env.STRAPI_AUTH_PASSWORD) missing.push('STRAPI_AUTH_PASSWORD');
if (!process.env.WA_VERIFY_TOKEN && !process.env.WEBHOOK_VERIFY_TOKEN) {
  missing.push('WA_VERIFY_TOKEN or WEBHOOK_VERIFY_TOKEN');
}
if (!process.env.WA_ACCESS_TOKEN && !process.env.WHATSAPP_MARKER) {
  missing.push('WA_ACCESS_TOKEN or WHATSAPP_MARKER');
}
if (!process.env.WA_PHONE_NUMBER_ID && !process.env.PHONE_NUMBER_ID) {
  missing.push('WA_PHONE_NUMBER_ID or PHONE_NUMBER_ID');
}
if (missing.length) throw new Error(`Missing required env var(s): ${missing.join(', ')}`);

module.exports = {
  port: Number(process.env.PORT || 8090),
  strapiUrl: process.env.STRAPI_URL || 'https://cms.bostongrad.com/graphql',
  strapiAuthIdentifier: process.env.STRAPI_AUTH_IDENTIFIER,
  strapiAuthPassword: process.env.STRAPI_AUTH_PASSWORD,

  waVerifyToken: process.env.WA_VERIFY_TOKEN || process.env.WEBHOOK_VERIFY_TOKEN,
  waAccessToken: process.env.WA_ACCESS_TOKEN || process.env.WHATSAPP_MARKER,
  waPhoneNumberId: process.env.WA_PHONE_NUMBER_ID || process.env.PHONE_NUMBER_ID,
  waApiVersion: process.env.WA_API_VERSION || 'v20.0',
  waBusinessAccountId: process.env.WABA_ID || '',
  waAppId: process.env.APP_ID || '',

  leadLinkSecret:
    process.env.LEAD_TELEGRAM_LINK_SECRET ||
    process.env.LEADS_DASHBOARD_SESSION_SECRET ||
    'dev-lead-link-secret-change-me',

  whatsappSocialnetworkName: process.env.WHATSAPP_SOCIALNETWORK_NAME || 'WhatsApp',
  waRateLimitMs: Number(process.env.WA_RATE_LIMIT_MS || 700),
  waSessionTtlSec: Number(process.env.WA_SESSION_TTL_SEC || 1800),
  waMaxAnswerLength: Number(process.env.WA_MAX_ANSWER_LENGTH || 500),
  waStartCodeTtlSec: Number(process.env.WA_START_CODE_TTL_SEC || 604800),
  waBooleanQuestionNames: (process.env.WA_BOOLEAN_QUESTION_NAMES || 'together,university')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean),
};
