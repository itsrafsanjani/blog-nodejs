export default {
  port: process.env.APP_PORT ?? 3000,
  appUrl: process.env.APP_URL ?? "http://localhost",
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? 60 * 60,
  refreshJwtExpiresIn: process.env.REFRESH_JWT_EXPIRES_IN ?? 60 * 60 * 24 * 365,
};
