import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmailVerification from "../utils/sendEmailVerification.js";
import EmailVerificationModel from "../model/EmailVerification.js";
import generateTokens from "../utils/generateTokens.js";
import setTokensCookies from "../utils/setTokensCookies.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import UserRefreshTokenModel from "../model/USerRefreshToken.js";
import User from "../model/User.model.js";
import transport from "../config/emailConfig.js";

export const userRegistration = async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;

    if (!name || !email || !password || !password_confirmation) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (password !== password_confirmation) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    // Check if email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    // Send verification email
    await sendEmailVerification(req, user);

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// USer Eamil Verification
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    // Check if all required fields are provided
    if (!email || !otp) {
      return res
        .status(400)
        .json({ status: "failed", message: "All fields are required" });
    }
    const existingUser = await UserModel.findOne({ email });
    // Check if email dosent exists
    if (!existingUser) {
      return res
        .status(404)
        .json({ status: "failed", message: "Email doesnt exists" });
    }
    if (existingUser.is_verified) {
      return res
        .status(400)
        .json({ status: "failed", message: "Email is already verified" });
    }
    // Check if there is a matching email verification
    const emailVerification = await EmailVerificationModel.findOne({
      userId: existingUser._id,
      otp,
    });
    if (!emailVerification) {
      if (!existingUser.is_verified) {
        await sendEmailVerification(req, existingUser);
        return res.status(400).json({
          status: "failed",
          message: "Invalid OTP, new Otp sent to your email.",
        });
      }
    }

    // check if otp expired
    const currentTime = new Date();
    const expirationTime = new Date(
      emailVerification.createdAt.getTime() + 15 * 60 * 1000
    );
    if (currentTime > expirationTime) {
      // OTP Expired send new otp
      await sendEmailVerification(req, existingUser);
      return res.status(400).json({
        status: "failed",
        message: "OTP expired, new otp sent to your email",
      });
    }
    existingUser.is_verified = true;
    await existingUser.save();
    // Delete email verification document
    await EmailVerificationModel.deleteMany({ userId: existingUser._id });
    res.status(200).json({
      status: "success",
      message: "verifed email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Unable to verify email, please try again later",
    });
  }
};

// Login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "failed", message: "Eamil and password are required" });
    }
    const user = await UserModel.findOne({ email });

    if (!user.is_verified) {
      return res
        .status(401)
        .json({ status: "failed", message: "Your account is not verified" });
    }

    // Check password/comapare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: "Failed", message: "Invalid Email or password" });
    }
    // Generate tokens
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await generateTokens(user);
    // Set Cookies

    setTokensCookies(
      res,
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp
    );

    // Send Success Response with Tokens
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles[0],
      },
      status: "success",
      message: "Login Succesfull",
      access_token: accessToken,
      refresh_token: refreshToken,
      access_token_exp: accessTokenExp,
      refresh_token_exp: refreshTokenExp,
      is_auth: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: "Unable to login, Please try again later",
    });
  }
};

// export const getNewAccessToken = async (req, res) => {
//   try {
//     // Get new access token using Refresh Token
//     const {
//       newAccessToken,
//       newRefreshToken,
//       newAccessTokenExp,
//       newRefreshTokenExp,
//     } = await refreshAccessToken(req, res);

//     // Set New Token to cookies (pass correct params)
//     setTokensCookies(
//       res,
//       newAccessToken,
//       newRefreshToken,
//       newAccessTokenExp,
//       newRefreshTokenExp
//     );

//     res.status(200).send({
//       status: "success",
//       message: "New tokens generated",
//       access_token: newAccessToken,
//       refresh_token: newRefreshToken,
//       access_token_exp: newAccessTokenExp,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       status: "failed",
//       message: "Unable to generate new token, please try again later",
//     });
//   }
// };

export const getNewAccessToken = async (req, res) => {
  try {
    // refreshAccessToken now throws on errors and returns tokens on success
    const {
      newAccessToken,
      newRefreshToken,
      newAccessTokenExp,
      newRefreshTokenExp,
    } = await refreshAccessToken(req);

    // Set New Token to cookies (pass correct params)
    setTokensCookies(
      res,
      newAccessToken,
      newRefreshToken,
      newAccessTokenExp,
      newRefreshTokenExp
    );

    return res.status(200).send({
      status: "success",
      message: "New tokens generated",
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      access_token_exp: newAccessTokenExp,
    });
  } catch (error) {
    console.error("getNewAccessToken error:", error.message || error);

    // Decide appropriate status codes depending on error messages
    if (
      error.message === "Refresh token missing" ||
      error.message === "Invalid refresh token" ||
      error.message === "Unauthorized access"
    ) {
      return res.status(401).json({ status: "failed", message: error.message });
    }

    if (error.message === "User not found") {
      return res.status(404).json({ status: "failed", message: error.message });
    }

    return res.status(500).json({
      status: "failed",
      message: "Unable to generate new token, please try again later",
    });
  }
};

// Profile or Logged in User

export const userProfile = async (req, res) => {
  res.send({ user: req.user });
};

// Logout
export const userLogout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    await UserRefreshTokenModel.findOneAndUpdate(
      { token: refreshToken },
      { $set: { blacklisted: true } }
    );
    res.clearCookie("accesstoken");
    res.clearCookie("refreshToken");
    res.clearCookie("is_auth");
    res.status(200).json({ status: "success", message: "Logout completed" });
  } catch (error) {
    console.log(error);
  }
};

// Send password Reset link via email
export const sendUserPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (user) {
      if (!user) {
        return res
          .status(404)
          .json({ status: "Failed", message: "Email doesnt exist" });
      }
    }
    // Generate token for password reset

    const secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
    const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "15m" });
    // Reset Link

    const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${token}`;

    console.log(resetLink);
    // send password reset email

    await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password reset link",
      html: `<p>
        hello ${user.name}, </p><p>please <a href="${resetLink}">Click here</a> to reset your password
        </p>`,
    });
    return res.status(200).json({ message: "Email send" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      message: "Unable to send password reset email. please try again later",
    });
  }
};

// Password reset
export const userPasswordReset = async (req, res) => {
  try {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    // Find user by id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Validate token
    const new_secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
    jwt.verify(token, new_secret);
    // check if password and confirm confirmation are provided

    if (!password || !password_confirmation) {
      return res.status(400).json({
        status: "failed",
        message: "password aur new password to do bhai",
      });
    }
    if (password !== password_confirmation) {
      return res.status(400).json({
        status: "failed",
        message: "password and confirm password match nahi kar raha",
      });
    }
    // Generate salt and hash new password
    const salt = await bcrypt.genSalt(10);
    const newHashPassword = await bcrypt.hash(password, salt);
    // update user password
    await User.findByIdAndUpdate(user._id, {
      $set: { password: newHashPassword },
    });
    res.status(200).json({ message: "Password reset succesfully" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        status: "failed",
        message: "Token expired, please request a new password reset link",
      });
    }
    return res.status(500).json({
      status: "failed",
      message: "Unable to reset password, please try again later",
    });
  }
};
