require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const missing = [];
if (!process.env.STRAPI_AUTH_IDENTIFIER) missing.push('STRAPI_AUTH_IDENTIFIER');
if (!process.env.STRAPI_AUTH_PASSWORD) missing.push('STRAPI_AUTH_PASSWORD');
if (!process.env.IG_VERIFY_TOKEN && !process.env.WEBHOOK_VERIFY_TOKEN) {
  missing.push('IG_VERIFY_TOKEN or WEBHOOK_VERIFY_TOKEN');
}
if (!process.env.IG_ACCESS_TOKEN && !process.env.PAGE_ACCESS_TOKEN) {
  missing.push('IG_ACCESS_TOKEN or PAGE_ACCESS_TOKEN');
}
if (!process.env.IG_ACCOUNT_ID && !process.env.INSTAGRAM_ACCOUNT_ID) {
  missing.push('IG_ACCOUNT_ID or INSTAGRAM_ACCOUNT_ID');
}
if (missing.length) throw new Error(`Missing required env var(s): ${missing.join(', ')}`);

module.exports = {
  port: Number(process.env.PORT || 8092),
  strapiUrl: process.env.STRAPI_URL || 'https://cms.bostongrad.com/graphql',
  strapiAuthIdentifier: process.env.STRAPI_AUTH_IDENTIFIER,
  strapiAuthPassword: process.env.STRAPI_AUTH_PASSWORD,

  igVerifyToken: process.env.IG_VERIFY_TOKEN || process.env.WEBHOOK_VERIFY_TOKEN,
  igAccessToken: process.env.IG_ACCESS_TOKEN || process.env.PAGE_ACCESS_TOKEN,
  igAccountId: process.env.IG_ACCOUNT_ID || process.env.INSTAGRAM_ACCOUNT_ID,
  igApiVersion: process.env.IG_API_VERSION || 'v20.0',

  leadLinkSecret:
    process.env.LEAD_TELEGRAM_LINK_SECRET ||
    process.env.LEADS_DASHBOARD_SESSION_SECRET ||
    'dev-lead-link-secret-change-me',

  instagramSocialnetworkName: process.env.INSTAGRAM_SOCIALNETWORK_NAME || 'Instagram',
  igRateLimitMs: Number(process.env.IG_RATE_LIMIT_MS || 700),
  igSessionTtlSec: Number(process.env.IG_SESSION_TTL_SEC || 1800),
  igMaxAnswerLength: Number(process.env.IG_MAX_ANSWER_LENGTH || 500),
  igStartCodeTtlSec: Number(process.env.IG_START_CODE_TTL_SEC || 604800),
  igBooleanQuestionNames: (process.env.IG_BOOLEAN_QUESTION_NAMES || 'together,university')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean),
};
