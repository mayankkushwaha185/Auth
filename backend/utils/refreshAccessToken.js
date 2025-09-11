// import User from "../model/User.model.js";
// import UserRefreshTokenModel from "../model/USerRefreshToken.js";
// import generateTokens from "./generateTokens.js";
// import verifyRefreshToken from "./verifyRefreshToken.js";

// const refreshAccessToken = async (req, res) => {
//   try {
//     const oldRefreshToken = req.cookies.refreshToken;
//     // Verify Refresh Token is valid or not
//     await verifyRefreshToken(oldRefreshToken);

//     if (error) {
//       return res
//         .status(401)
//         .send({ status: "failed", message: "Invalid refresh token" });
//     }
//     const user = await User.findById(tokenDetails._id);

//     if (!user) {
//       return res
//         .status(404)
//         .send({ status: "failed", message: "User not found" });
//     }
//     const userRefreshToken = await UserRefreshTokenModel.findOne({
//       userId: tokenDetails._id,
//     });
//     if (
//       oldRefreshToken != userRefreshToken.token ||
//       userRefreshToken.blacklisted
//     ) {
//       return res
//         .status(401)
//         .send({ status: "failed", message: "Unauthorized access" });
//     }
//     const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
//       await generateTokens(user);
//     return {
//       newAccessToken: accessToken,
//       newRefreshToken: refreshToken,
//       newAccessTokenExp: accessTokenExp,
//       newRefeshTokenExp: refreshTokenExp,
//     };
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .send({ status: "failed", message: "Internal Server Error" });
//   }
// };

// export default refreshAccessToken;

// refreshAccessToken.js
import User from "../model/User.model.js";
import UserRefreshTokenModel from "../model/USerRefreshToken.js";
import generateTokens from "./generateTokens.js";
import verifyRefreshToken from "./verifyRefreshToken.js";

const refreshAccessToken = async (req) => {
  try {
    const oldRefreshToken = req?.cookies?.refreshToken;
    if (!oldRefreshToken) {
      throw new Error("Refresh token missing");
    }

    // verifyRefreshToken will throw on invalid token
    const { tokenDetails, userRefreshToken } = await verifyRefreshToken(
      oldRefreshToken
    );

    // tokenDetails should have the payload (e.g. _id)
    if (!tokenDetails || !tokenDetails._id) {
      throw new Error("Invalid token details");
    }

    const user = await User.findById(tokenDetails._id);
    if (!user) {
      throw new Error("User not found");
    }

    // Ensure provided refresh token matches stored token and not blacklisted
    if (
      oldRefreshToken !== userRefreshToken.token ||
      userRefreshToken.blacklisted
    ) {
      throw new Error("Unauthorized access");
    }

    // Generate new tokens
    const { accessToken, refreshToken, accessTokenExp, refreshTokenExp } =
      await generateTokens(user);

    // Optionally: update the DB refresh token document here (if your generateTokens doesn't)
    // e.g. await UserRefreshTokenModel.findOneAndUpdate({ userId: user._id }, { token: refreshToken, blacklisted: false });

    return {
      newAccessToken: accessToken,
      newRefreshToken: refreshToken,
      newAccessTokenExp: accessTokenExp,
      newRefreshTokenExp: refreshTokenExp,
    };
  } catch (error) {
    // rethrow so controller can handle HTTP response and avoid double-send
    throw error;
  }
};

export default refreshAccessToken;
