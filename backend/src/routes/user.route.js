import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changeCurrentPassword
 } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secure routes

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

export default router;
