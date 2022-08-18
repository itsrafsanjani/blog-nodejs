import * as OTPAuth from "otpauth";

// Create a new TOTP object.
const totp = new OTPAuth.TOTP({
  issuer: process.env.APP_NAME,
  label: process.env.APP_NAME + " Auth",
  algorithm: "SHA1",
  digits: 6,
  period: 30,
  secret: OTPAuth.Secret.fromHex(process.env.APP_KEY),
});

// Generate a token.
const getOtp = () => {
  return totp.generate();
};
console.log(getOtp);

// // Validate a token.
const validate = ({ token }: { token: string }) =>
  totp.validate({
    token: token,
    window: 1,
  });
console.log(validate);

export { getOtp, validate };
