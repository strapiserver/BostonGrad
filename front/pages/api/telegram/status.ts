import type { NextApiRequest, NextApiResponse } from "next";
import { normalizeTelegramSlug } from "../../../services/telegram";
import { verifyTelegramSlugServer } from "../../../services/server/telegramVerify";
import {
  clearTelegramConfirmation,
  getTelegramConfirmation,
  setTelegramConfirmation,
} from "../../../cache/telegramConfirm";

const isExpired = (expiresAt?: string | null) => {
  if (!expiresAt) return false;
  const expMs = Date.parse(expiresAt);
  if (Number.isNaN(expMs)) return false;
  return expMs <= Date.now();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end();

  const slugParam = req.query?.slug;
  const slugRaw = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const slug = normalizeTelegramSlug(slugRaw).toLowerCase();
  if (!slug) return res.status(400).json({ ok: false, error: "missing_slug" });

  const record = await getTelegramConfirmation(slug);
  if (record) {
    if (isExpired(record.expiresAt)) {
      await clearTelegramConfirmation(slug);
    } else {
      return res.status(200).json({
        ok: true,
        confirmed: true,
        expiresAt: record.expiresAt ?? null,
      });
    }
  }

  const verifyBySlug = await verifyTelegramSlugServer(slug);
  const verifiedSlug = normalizeTelegramSlug(verifyBySlug?.slug).toLowerCase();
  if (!verifyBySlug?.ok || verifiedSlug !== slug || !verifyBySlug.confirmToken) {
    console.warn("[telegram/status] confirmation missing", {
      slug,
      verifyOk: Boolean(verifyBySlug?.ok),
      verifiedSlug: verifiedSlug || null,
      hasToken: Boolean(verifyBySlug?.confirmToken),
      verifyError: verifyBySlug?.error || null,
    });
    return res.status(200).json({ ok: true, confirmed: false });
  }

  await setTelegramConfirmation({
    ok: true,
    status: "confirmed",
    slug,
    telegramUserId: null,
    telegramUsername: verifyBySlug.telegramUsername ?? null,
    confirmToken: verifyBySlug.confirmToken,
    expiresAt: verifyBySlug.expiresAt ?? null,
    receivedAt: new Date().toISOString(),
  });

  return res.status(200).json({
    ok: true,
    confirmed: true,
    expiresAt: verifyBySlug.expiresAt ?? null,
  });
}
