module.exports = ({ env }) => {
  const envOrigins = env("CORS_ORIGINS", "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const origin = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:1337",
    "http://127.0.0.1:1337",
    "https://bostongrad.com",
    "https://www.bostongrad.com",
    "https://cms.bostongrad.com",
    ...envOrigins,
  ];

  return [
    "strapi::errors",
    "strapi::security",
    {
      name: "strapi::cors",
      config: {
        origin: Array.from(new Set(origin)),
        headers: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
        credentials: true,
      },
    },
    "strapi::poweredBy",
    "strapi::logger",
    "strapi::query",
    "strapi::body",
    {
      resolve: "./src/middlewares/webhook-proxy",
    },
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
  ];
};
