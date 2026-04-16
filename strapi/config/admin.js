module.exports = ({ env }) => {
  const isProduction = env("NODE_ENV") === "production";

  return {
    auth: {
      secret: env(
        "ADMIN_JWT_SECRET",
        isProduction ? undefined : "dev-admin-jwt-secret"
      ),
    },
    apiToken: {
      salt: env(
        "API_TOKEN_SALT",
        isProduction ? undefined : "dev-api-token-salt"
      ),
    },
    transfer: {
      token: {
        salt: env(
          "TRANSFER_TOKEN_SALT",
          isProduction ? undefined : "dev-transfer-token-salt"
        ),
      },
    },
  };
};
