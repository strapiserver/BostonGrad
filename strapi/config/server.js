module.exports = ({ env }) => {
  const isProduction = env("NODE_ENV") === "production";
  const fallbackAppKeys = [
    "dev-app-key-1",
    "dev-app-key-2",
    "dev-app-key-3",
    "dev-app-key-4",
  ];

  return {
    host: env("HOST", "0.0.0.0"),
    port: env.int("PORT", 1337),
    app: {
      keys: env.array(
        "APP_KEYS",
        isProduction ? undefined : fallbackAppKeys
      ),
    },
    webhooks: {
      populateRelations: env.bool("WEBHOOKS_POPULATE_RELATIONS", false),
    },
  };
};
