import type { NextApiRequest, NextApiResponse } from "next";

type QueryValue = string | string[] | undefined;

const first = (v: QueryValue): string => (Array.isArray(v) ? v[0] ?? "" : v ?? "");

const verifyToken =
  process.env.WEBHOOK_VERIFY_TOKEN || process.env.WA_VERIFY_TOKEN || "";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const mode = first(req.query["hub.mode"]);
  const token = first(req.query["hub.verify_token"]);
  const challenge = first(req.query["hub.challenge"]);

  if (!verifyToken) {
    return res.status(500).json({ error: "Webhook verify token is not configured" });
  }

  if (mode === "subscribe" && token === verifyToken) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ error: "Forbidden" });
}

