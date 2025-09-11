// import jwt from "jsonwebtoken";
// import UserRefreshTokenModel from "../model/USerRefreshToken.js";
// const verifyRefreshToken = async (refreshToken) => {
//   try {
//     const privateKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
//     // Find the refresh token document
//     const userRefreshToken = await UserRefreshTokenModel.findOne({
//       token: refreshToken,
//     });
//     // IF refresh token not found, reject with an error
//     if (!userRefreshToken) {
//       throw { error: true, message: "Invalid refresh token" };
//     }

//     // Verify the refresh token
//     const tokenDetails = jwt.verify(refreshToken, privateKey);
//     // if verification successfuk, reslove with token details
//     return {
//       tokenDetails,
//       error: false,
//       message: "Valid refersh token",
//     };
//   } catch (error) {}
// };

// export default verifyRefreshToken;

// verifyRefreshToken.js
import jwt from "jsonwebtoken";
import UserRefreshTokenModel from "../model/USerRefreshToken.js";

const verifyRefreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error("No refresh token provided");
    }

    const userRefreshToken = await UserRefreshTokenModel.findOne({
      token: refreshToken,
    });

    if (!userRefreshToken) {
      // token not found in DB
      throw new Error("Invalid refresh token");
    }

    const privateKey = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;
    if (!privateKey) throw new Error("Refresh token secret not configured");

    // throws if token invalid/expired
    const tokenDetails = jwt.verify(refreshToken, privateKey);

    // return both token details and DB document for further checks
    return { tokenDetails, userRefreshToken };
  } catch (err) {
    // rethrow so caller handles it (controller / higher-level util)
    throw err;
  }
};

export default verifyRefreshToken;
