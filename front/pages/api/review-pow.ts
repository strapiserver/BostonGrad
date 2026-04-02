import type { NextApiRequest, NextApiResponse } from "next";
import { createHash, randomBytes, randomUUID } from "crypto";
import {
  POW_DIFFICULTY,
  POW_CHALLENGE_TTL_MS,
  ReviewPowChallenge,
  createPowPayload,
  hashMeetsDifficulty,
} from "../../components/exchangers/exchanger/leaveReview/helper";

type PowGetResponse = {
  challenge: ReviewPowChallenge;
  difficulty: number;
};

type PowPostResponse = {
  success: boolean;
  error?: string;
};

const createSalt = () =>
  typeof randomUUID === "function"
    ? randomUUID()
    : randomBytes(16).toString("hex");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PowGetResponse | PowPostResponse>
) {
  if (req.method === "GET") {
    const exchangerId = req.query.exchangerId;
    if (!exchangerId || typeof exchangerId !== "string") {
      return res
        .status(400)
        .json({
          success: false,
          error: "exchangerId query param is required",
        } as PowPostResponse);
    }

    const requestedDifficultyRaw = Array.isArray(req.query.complexity)
      ? req.query.complexity[0]
      : req.query.complexity;
    const parsedDifficulty = requestedDifficultyRaw
      ? Number.parseInt(requestedDifficultyRaw, 10)
      : NaN;
    const allowedDifficulties = new Set([10, 18, 30]);
    const difficulty = allowedDifficulties.has(parsedDifficulty)
      ? parsedDifficulty
      : POW_DIFFICULTY;

    const challenge: ReviewPowChallenge = {
      exchangerId,
      salt: createSalt(),
      issuedAt: Date.now(),
      difficulty,
    };

    return res.status(200).json({ challenge, difficulty });
  }

  if (req.method === "POST") {
    const { challenge, nonce } = req.body ?? {};
    if (
      !challenge ||
      typeof challenge.exchangerId !== "string" ||
      typeof challenge.salt !== "string" ||
      typeof challenge.issuedAt !== "number" ||
      typeof challenge.difficulty !== "number" ||
      typeof nonce !== "number"
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid payload" });
    }

    if (Date.now() - challenge.issuedAt > POW_CHALLENGE_TTL_MS) {
      return res
        .status(400)
        .json({ success: false, error: "Challenge expired" });
    }

    const payload = `${createPowPayload(challenge)}:${nonce}`;
    const hashBytes = new Uint8Array(createHash("sha256").update(payload).digest());
    const isValid = hashMeetsDifficulty(hashBytes, challenge.difficulty);

    return res.status(200).json({ success: isValid });
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ success: false, error: "Method Not Allowed" });
}
