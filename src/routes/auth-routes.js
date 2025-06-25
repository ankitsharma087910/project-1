
import express  from 'express';
import { logoutController, refreshTokenController, userLoginController, userRegisterController, verifyEmailController } from '../controllers/auth-controllers.js';
import protect from '../middleware/authMiddleware.js';
import { getProfileController } from '../controllers/user-controllers.js';


const router = express.Router();

router.post("/register",userRegisterController);
router.get("/verify/:token", verifyEmailController);
router.post("/login", userLoginController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);
router.get("/profile", protect, getProfileController);


export default router;