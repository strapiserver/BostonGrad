"use strict";

const http = require("http");

const ROUTES = {
  "/webhook/fb": { host: "fb-bot", port: 8091 },
  "/webhook/ig": { host: "ig-bot", port: 8092 },
};

function forwardRequest(ctx, host, port) {
  return new Promise((resolve, reject) => {
    const path = `/webhook${ctx.querystring ? `?${ctx.querystring}` : ""}`;
    const body =
      ctx.method === "POST" ? JSON.stringify(ctx.request.body || {}) : undefined;

    const req = http.request(
      {
        host,
        port,
        path,
        method: ctx.method,
        headers: {
          "content-type": "application/json",
          ...(body ? { "content-length": Buffer.byteLength(body) } : {}),
        },
        timeout: 10000,
      },
      (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          ctx.status = res.statusCode || 502;
          if (res.headers["content-type"]) {
            ctx.set("content-type", res.headers["content-type"]);
          }
          ctx.body = Buffer.concat(chunks).toString("utf8");
          resolve();
        });
      }
    );

    req.on("error", reject);
    req.on("timeout", () => req.destroy(new Error("Webhook proxy timeout")));
    if (body) req.write(body);
    req.end();
  });
}

module.exports = () => {
  return async (ctx, next) => {
    const route = ROUTES[ctx.path];
    if (route && (ctx.method === "GET" || ctx.method === "POST")) {
      await forwardRequest(ctx, route.host, route.port);
      return;
    }

    await next();
  };
};
