import { Router } from "express";
<<<<<<< HEAD

import { registerController, loginController } from "./auth.controller.js";


const router = Router();

router.post("/register", registerController);
router.post("/login" , loginController);
//router.post("/refresh", refreshController);
=======
import rateLimit from "express-rate-limit";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from "./auth.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

const registerLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             5,
  message:         { message: "Trop de tentatives. Reessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders:   false,
});
>>>>>>> 90ae145350d2bd1c6f4c3029f591473bfc107e39

const loginLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             10,
  message:         { message: "Trop de tentatives. Reessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders:   false,
});

const refreshLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             30,
  message:         { message: "Trop de tentatives. Reessayez plus tard." },
  standardHeaders: true,
  legacyHeaders:   false,
});

router.post("/register", registerLimiter, registerController);
router.post("/login",    loginLimiter,    loginController);
router.post("/refresh",  refreshLimiter,  refreshController);
router.post("/logout",   verifyToken,     logoutController);

export default router;