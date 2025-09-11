import User from "../model/User.model.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";

const secretKey = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
console.log("JWT Secret from .env and jwt strat: ", secretKey); // Debugging ke liye

if (!secretKey) {
  console.error("JWT_ACCESS_TOKEN_SECRET_KEY missing in .env");
  process.exit(1); // App ko band karo agar secret nahi mila
}

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload._id).select("-password");
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  })
);

export default passport;
