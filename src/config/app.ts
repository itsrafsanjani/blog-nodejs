export default {
  port: process.env.APP_PORT ?? 3000,
  appUrl: process.env.APP_URL ?? "http://localhost",
  personalAccessTokenExpiresIn:
    parseInt(process.env.PERSONAL_ACCESS_TOKEN_EXPIRES_IN) ?? 60 * 60 * 24 * 30,
};
