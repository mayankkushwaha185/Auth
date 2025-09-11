import transporter from "../config/emailConfig.js";
import EmailVerificationModel from "../model/EmailVerification.js";

const sendEmailVerification = async (req, user) => {
  const otp = Math.floor(1000 + Math.random() * 9000);

  //   Save OTP in database
  await new EmailVerificationModel({ userId: user._id, otp: otp }).save();
  const otpVerificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "OTP -verify your account",
    html: `<p>Dear ${user.name} verify your email using otp: ${otpVerificationLink}</p>
        <h2>OTP: ${otp}</h2>
        `,
  });
  return otp;
};

export default sendEmailVerification;
