import type { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";
import {
  POW_CHALLENGE_TTL_MS,
  POW_DIFFICULTY,
  ReviewPowChallenge,
  createPowPayload,
  hashMeetsDifficulty,
} from "../../components/exchangers/exchanger/leaveReview/helper";
import { internalServerLink, serverLinkPROD } from "../../services/utils";
import { IReview } from "../../types/exchanger";

type SubmitRequestBody = {
  challenge: ReviewPowChallenge;
  nonce: number;
  review: IReview;
};

type SubmitResponse = {
  success: boolean;
  error?: string;
};

const FORWARD_PATH = "/createReview";
const getClientIp = (req: NextApiRequest) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim();
  }
  if (Array.isArray(forwarded) && forwarded.length) {
    return forwarded[0];
  }
  return req.socket.remoteAddress || undefined;
};

const enrichReviewWithServerData = (req: NextApiRequest, review: IReview) => {
  const clientIp = review.ipAddress ?? getClientIp(req);
  const userAgentHeader = req.headers["user-agent"];
  const userAgent =
    review.userAgent || (typeof userAgentHeader === "string"
      ? userAgentHeader
      : undefined);

  return {
    ...review,
    ipAddress: clientIp,
    userAgent,
  };
};

const getExternalUrl = () => {
  if (process.env.NODE_ENV === "production") {
    const baseUrl = internalServerLink || serverLinkPROD;
    return `${baseUrl}${FORWARD_PATH}`;
  }
  return `http://localhost:5000${FORWARD_PATH}`;
};

const validateBody = (body: any): body is SubmitRequestBody => {
  if (!body || typeof body !== "object") return false;
  const { challenge, nonce, review } = body;
  if (
    !challenge ||
    typeof challenge.exchangerId !== "string" ||
    typeof challenge.salt !== "string" ||
    typeof challenge.issuedAt !== "number" ||
    typeof challenge.difficulty !== "number"
  ) {
    return false;
  }
  if (typeof nonce !== "number" || Number.isNaN(nonce)) {
    return false;
  }
  if (
    !review ||
    typeof review.text !== "string" ||
    typeof review.honeypot !== "string" ||
    typeof review.exchangerId !== "string"
  ) {
    return false;
  }
  return true;
};

const verifyProofOfWork = (challenge: ReviewPowChallenge, nonce: number) => {
  if (Date.now() - challenge.issuedAt > POW_CHALLENGE_TTL_MS) {
    return { isValid: false, error: "Challenge expired" } as const;
  }
  const payload = `${createPowPayload(challenge)}:${nonce}`;
  const hashBytes = new Uint8Array(createHash("sha256").update(payload).digest());
  const difficulty =
    typeof challenge.difficulty === "number"
      ? challenge.difficulty
      : POW_DIFFICULTY;
  const isValid = hashMeetsDifficulty(hashBytes, difficulty);
  if (!isValid) {
    return { isValid: false, error: "Invalid proof-of-work" } as const;
  }
  return { isValid: true } as const;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmitResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  if (!validateBody(req.body)) {
    return res.status(400).json({ success: false, error: "Invalid payload" });
  }

  const { challenge, nonce, review } = req.body;

  const powResult = verifyProofOfWork(challenge, nonce);
  if (!powResult.isValid) {
    return res.status(400).json({ success: false, error: powResult.error });
  }

  const reviewWithMeta = enrichReviewWithServerData(req, review);
  const payloadForExternal = {
    ...reviewWithMeta,
    pow: {
      challenge,
      nonce,
      difficulty: challenge.difficulty ?? POW_DIFFICULTY,
    },
  };

  try {
    const forwardResponse = await fetch(getExternalUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadForExternal),
    });

    if (!forwardResponse.ok) {
      return res
        .status(forwardResponse.status)
        .json({ success: false, error: "External service rejected review" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to forward review", error);
    return res.status(500).json({ success: false, error: "Forwarding failed" });
  }
}
