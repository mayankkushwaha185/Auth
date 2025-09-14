const setTokensCookies = (
  res,
  accessToken,
  refreshToken,
  newAccessTokenExp,
  newRefreshTokenExp
) => {
  const accessTokenmaxAge =
    (newAccessTokenExp - Math.floor(Date.now() / 1000)) * 1000;
  const refreshTokenmaxAge =
    (newRefreshTokenExp - Math.floor(Date.now() / 1000)) * 1000;

  // SetCookie for access Token
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: accessTokenmaxAge,
  });
  // SetCookie for Refresh Token
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: refreshTokenmaxAge,
  });
  res.cookie("is_auth", true, {
    httpOnly: false,
    secure: false,
    maxAge: refreshTokenmaxAge,
  });
};

export default setTokensCookies;
