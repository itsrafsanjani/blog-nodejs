import * as OTPAuth from "otpauth";

// Create a new TOTP object.
let totp = new OTPAuth.TOTP({
  issuer: process.env.APP_NAME,
  label: process.env.APP_NAME + " Auth",
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  secret: process.env.APP_KEY,
});

// Generate a token.
let token = totp.generate();
console.log(token);

// // Validate a token.
let delta = totp.validate({
  token: token,
  window: 1,
});
console.log(delta);
