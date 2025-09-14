import isTokenExpire from "../utils/isTokenExpired.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import setTokensCookies from "../utils/setTokensCookies.js";

const setAuthHeader = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken || !isTokenExpire(accessToken)) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
    }
    if (!accessToken || isTokenExpire(accessToken)) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error("Refresh token is missing");
      }
      const {
        newAccessToken,
        newRefreshToken,
        newAccessTokenExp,
        newRefreshTokenExp,
      } = await refreshAccessToken(req, res);

      //   set cookies
      setTokensCookies(
        res,
        newAccessToken,
        newRefreshToken,
        newAccessTokenExp,
        newRefreshTokenExp
      );
      // Add the access token to the Authorization header
      req.headers["authorization"] = `Bearer ${accessToken}`;
    }
    next();
  } catch (error) {
    console.error("Error adding access token to header: ", error.message);
  }
};
export default setAuthHeader;
