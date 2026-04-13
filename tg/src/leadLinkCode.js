const { createHmac, timingSafeEqual } = require('crypto');
const { leadLinkSecret, tgStartCodeTtlSec } = require('./config');

const sign = (payload) =>
  createHmac('sha256', leadLinkSecret).update(payload).digest('base64url');

const verifyLeadStartCode = (token) => {
  // New compact format: l<idBase64url>_<expBase36>_<sig16>
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
      if (!idPart || !expPart || !sigPart) return { ok: false, reason: 'bad-format' };

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
      if (exp > now + tgStartCodeTtlSec + 60) return { ok: false, reason: 'bad-window' };

      const leadId = Buffer.from(idPart, 'base64url').toString('utf8');
      if (!leadId) return { ok: false, reason: 'bad-lead-id' };
      return { ok: true, leadId };
    } catch {
      return { ok: false, reason: 'decode-failed' };
    }
  }

  // Legacy format fallback for older links.
  try {
    const decoded = Buffer.from(String(token || ''), 'base64url').toString('utf8');
    const [leadId, expRaw, signature] = decoded.split(':');
    if (!leadId || !expRaw || !signature) return { ok: false, reason: 'bad-format' };

    const exp = Number(expRaw);
    if (!Number.isFinite(exp)) return { ok: false, reason: 'bad-exp' };

    const payload = `${leadId}:${exp}`;
    const expected = sign(payload);
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, reason: 'bad-signature' };
    }

    const now = Math.floor(Date.now() / 1000);
    if (exp < now) return { ok: false, reason: 'expired' };
    if (exp > now + tgStartCodeTtlSec + 60) return { ok: false, reason: 'bad-window' };

    return { ok: true, leadId };
  } catch {
    return { ok: false, reason: 'decode-failed' };
  }
};

module.exports = { verifyLeadStartCode };
