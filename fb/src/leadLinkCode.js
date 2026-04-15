const { createHmac, timingSafeEqual } = require('crypto');
const { leadLinkSecret, fbStartCodeTtlSec } = require('./config');

const sign = (payload) => createHmac('sha256', leadLinkSecret).update(payload).digest('base64url');

const verifyLeadStartCode = (token) => {
  if (typeof token === 'string' && token.startsWith('l') && token.includes('_')) {
    try {
      const raw = token.slice(1);
      const firstSep = raw.indexOf('_');
      const secondSep = raw.indexOf('_', firstSep + 1);
      if (firstSep <= 0 || secondSep <= firstSep + 1) {
        return { ok: false, reason: 'bad-format' };
      }
      const idPart = raw.slice(0, firstSep);
      const expPart = raw.slice(firstSep + 1, secondSep);
      const sigPart = raw.slice(secondSep + 1);

      const payload = `${idPart}.${expPart}`;
      const expectedSig = sign(payload).slice(0, 16);
      const a = Buffer.from(sigPart);
      const b = Buffer.from(expectedSig);
      if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return { ok: false, reason: 'bad-signature' };
      }

      const exp = parseInt(expPart, 36);
      if (!Number.isFinite(exp)) return { ok: false, reason: 'bad-exp' };
      const now = Math.floor(Date.now() / 1000);
      if (exp < now) return { ok: false, reason: 'expired' };
      if (exp > now + fbStartCodeTtlSec + 60) return { ok: false, reason: 'bad-window' };

      const leadId = Buffer.from(idPart, 'base64url').toString('utf8');
      if (!leadId) return { ok: false, reason: 'bad-lead-id' };
      return { ok: true, leadId };
    } catch {
      return { ok: false, reason: 'decode-failed' };
    }
  }

  return { ok: false, reason: 'unsupported-format' };
};

module.exports = { verifyLeadStartCode };
