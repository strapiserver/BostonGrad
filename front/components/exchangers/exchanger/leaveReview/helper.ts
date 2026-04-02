export const POW_DIFFICULTY = 18;
export const POW_CHALLENGE_TTL_MS = 2 * 60 * 1000;

export type ReviewPowChallenge = {
  exchangerId: string;
  salt: string;
  issuedAt: number;
  difficulty: number;
};

export type ReviewPowSolution = {
  nonce: number;
  hash: string;
};

export const createPowPayload = (challenge: ReviewPowChallenge) =>
  `${challenge.exchangerId}:${challenge.salt}:${challenge.issuedAt}`;

const getSubtleCrypto = () => {
  const globalCrypto =
    typeof globalThis !== "undefined" ? (globalThis as any).crypto : undefined;

  if (!globalCrypto) return null;
  if (globalCrypto.subtle) return globalCrypto.subtle;
  if (globalCrypto.webcrypto?.subtle) return globalCrypto.webcrypto.subtle;
  return null;
};

const countLeadingZeroBits = (byte: number) => {
  if (byte === 0) return 8;
  let count = 0;
  for (let mask = 0x80; mask > 0; mask >>= 1) {
    if ((byte & mask) === 0) count++;
    else break;
  }
  return count;
};

export const hashMeetsDifficulty = (
  hashBytes: Uint8Array,
  difficulty = POW_DIFFICULTY
) => {
  let accumulated = 0;
  for (const byte of hashBytes) {
    const zeroBits = countLeadingZeroBits(byte);
    accumulated += zeroBits;
    if (zeroBits < 8) {
      return accumulated >= difficulty;
    }
    if (accumulated >= difficulty) return true;
  }
  return accumulated >= difficulty;
};

export const bufferToHex = (buffer: ArrayBuffer | Uint8Array) => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const solvePowChallenge = async (
  challenge: ReviewPowChallenge,
  difficulty = POW_DIFFICULTY
): Promise<ReviewPowSolution> => {
  const subtle = getSubtleCrypto();
  if (!subtle) {
    throw new Error("WebCrypto API is not available in this environment");
  }

  const encoder = new TextEncoder();
  let nonce = 0;
  while (true) {
    const payload = `${createPowPayload(challenge)}:${nonce}`;
    const data = encoder.encode(payload);
    const hashBuffer = await subtle.digest("SHA-256", data);
    const hashBytes = new Uint8Array(hashBuffer);
    if (hashMeetsDifficulty(hashBytes, difficulty)) {
      return { nonce, hash: bufferToHex(hashBytes) };
    }
    nonce += 1;
  }
};

export const isChallengeExpired = (issuedAt: number, now = Date.now()) =>
  now - issuedAt > POW_CHALLENGE_TTL_MS;
