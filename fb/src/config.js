require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const missing = [];
if (!process.env.STRAPI_AUTH_IDENTIFIER) missing.push('STRAPI_AUTH_IDENTIFIER');
if (!process.env.STRAPI_AUTH_PASSWORD) missing.push('STRAPI_AUTH_PASSWORD');
if (!process.env.FB_VERIFY_TOKEN && !process.env.WEBHOOK_VERIFY_TOKEN) {
  missing.push('FB_VERIFY_TOKEN or WEBHOOK_VERIFY_TOKEN');
}
if (!process.env.FB_PAGE_ACCESS_TOKEN && !process.env.PAGE_ACCESS_TOKEN) {
  missing.push('FB_PAGE_ACCESS_TOKEN or PAGE_ACCESS_TOKEN');
}
if (!process.env.FB_PAGE_ID && !process.env.PAGE_ID) {
  missing.push('FB_PAGE_ID or PAGE_ID');
}
if (missing.length) throw new Error(`Missing required env var(s): ${missing.join(', ')}`);

module.exports = {
  port: Number(process.env.PORT || 8091),
  strapiUrl: process.env.STRAPI_URL || 'https://cms.bostongrad.com/graphql',
  strapiAuthIdentifier: process.env.STRAPI_AUTH_IDENTIFIER,
  strapiAuthPassword: process.env.STRAPI_AUTH_PASSWORD,

  fbVerifyToken: process.env.FB_VERIFY_TOKEN || process.env.WEBHOOK_VERIFY_TOKEN,
  fbAccessToken: process.env.FB_PAGE_ACCESS_TOKEN || process.env.PAGE_ACCESS_TOKEN,
  fbPageId: process.env.FB_PAGE_ID || process.env.PAGE_ID,
  fbApiVersion: process.env.FB_API_VERSION || 'v20.0',

  leadLinkSecret:
    process.env.LEAD_TELEGRAM_LINK_SECRET ||
    process.env.LEADS_DASHBOARD_SESSION_SECRET ||
    'dev-lead-link-secret-change-me',

  facebookSocialnetworkName: process.env.FACEBOOK_SOCIALNETWORK_NAME || 'Facebook',
  fbRateLimitMs: Number(process.env.FB_RATE_LIMIT_MS || 700),
  fbSessionTtlSec: Number(process.env.FB_SESSION_TTL_SEC || 1800),
  fbMaxAnswerLength: Number(process.env.FB_MAX_ANSWER_LENGTH || 500),
  fbStartCodeTtlSec: Number(process.env.FB_START_CODE_TTL_SEC || 604800),
  fbBooleanQuestionNames: (process.env.FB_BOOLEAN_QUESTION_NAMES || 'together,university')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean),
};
