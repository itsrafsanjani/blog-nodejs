// Generate a otp.
const getOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Validate a otp.
const validateOtp = ({ otp, dbOtp }: { otp: Number; dbOtp: Number }) => {
  if (otp == dbOtp) {
    return true;
  }

  return false;
};

export { getOtp, validateOtp };
