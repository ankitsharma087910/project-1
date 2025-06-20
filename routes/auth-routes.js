
import express  from 'express';
import { userLoginController, userRegisterController } from '../controllers/auth-controllers.js';


const router = express.Router();

router.post("/register",userRegisterController);
router.post("/login",userLoginController);

export default router;