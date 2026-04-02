import type { NextApiRequest, NextApiResponse } from "next";
import { timingSafeEqual } from "crypto";
import {
  setTelegramConfirmation,
  TelegramConfirmRecord,
} from "../../../cache/telegramConfirm";

type ConfirmPayload = {
  ok?: boolean;
  status?: string;
  slug?: string;
  telegramUserId?: string | number | null;
  telegramUsername?: string | null;
  confirmToken?: string;
  expiresAt?: string | null;
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const equalsConstantTime = (a: string, b: string) => {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();

  const webhookSecret =
    process.env.BOT_TO_FRONT_SECRET || process.env.BOT_TO_BACKEND_SECRET;
  if (!webhookSecret) {
    console.error("[telegram/confirm] Missing webhook secret env");
    return res.status(500).json({ ok: false, error: "webhook_secret_missing" });
  }

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : "";
  if (!token || !equalsConstantTime(token, webhookSecret)) {
    console.warn("[telegram/confirm] Unauthorized webhook call", {
      hasAuthHeader: Boolean(authHeader),
      authPrefix: authHeader.slice(0, 16),
    });
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  let body = (req.body || {}) as ConfirmPayload | string;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body) as ConfirmPayload;
    } catch {
      return res.status(400).json({ ok: false, error: "invalid_json" });
    }
  }

  if (!body.ok || body.status !== "confirmed") {
    console.warn("[telegram/confirm] Invalid status payload", {
      ok: body.ok,
      status: body.status,
    });
    return res.status(400).json({ ok: false, error: "invalid_status" });
  }

  if (!isNonEmptyString(body.slug) || !isNonEmptyString(body.confirmToken)) {
    console.warn("[telegram/confirm] Invalid payload fields", {
      hasSlug: isNonEmptyString(body.slug),
      hasConfirmToken: isNonEmptyString(body.confirmToken),
    });
    return res.status(400).json({ ok: false, error: "invalid_payload" });
  }

  const record: TelegramConfirmRecord = {
    ok: true,
    status: "confirmed",
    slug: body.slug.trim().replace(/^@/, "").toLowerCase(),
    telegramUserId: body.telegramUserId ?? null,
    telegramUsername: body.telegramUsername ?? null,
    confirmToken: body.confirmToken,
    expiresAt: body.expiresAt ?? null,
    receivedAt: new Date().toISOString(),
  };

  console.log("[telegram/confirm] Confirmation accepted", {
    slug: record.slug,
    telegramUserId: record.telegramUserId,
    expiresAt: record.expiresAt,
  });
  await setTelegramConfirmation(record);

  return res.status(200).json({ ok: true });
}
