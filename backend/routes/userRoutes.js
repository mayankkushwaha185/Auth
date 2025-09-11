import express from "express";

const userRoutes = express.Router();
import {
  getNewAccessToken,
  sendUserPasswordResetEmail,
  userLogin,
  userLogout,
  userPasswordReset,
  userProfile,
  userRegistration,
  verifyEmail,
} from "../controllers/userControllers.js";
import passport from "passport";
import setAuthHeader from "../middlewares/setAuthHeader.js";

// public
userRoutes.post("/register", userRegistration);
userRoutes.post("/verifyEmail", verifyEmail);
userRoutes.post("/login", userLogin);
userRoutes.post("/refresh-token", getNewAccessToken);
userRoutes.post("/reset-password-link", sendUserPasswordResetEmail);
userRoutes.post("/reset-password/:id/:token", userPasswordReset);

// Protected routes

userRoutes.get(
  "/me",
  setAuthHeader,
  passport.authenticate("jwt", { session: false }),
  userProfile
);
userRoutes.post("/logout", userLogout);
export default userRoutes;
