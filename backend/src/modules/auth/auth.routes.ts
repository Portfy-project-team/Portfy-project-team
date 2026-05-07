import { Router } from "express";

import rateLimit from "express-rate-limit";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from "./auth.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

const isTest = process.env.NODE_ENV === "test";

const registerLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             5,
  message:         { message: "Trop de tentatives. Reessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders:   false,
});


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

const registerMiddlewares = isTest
  ? [registerController]
  : [registerLimiter, registerController];

const loginMiddlewares = isTest
  ? [loginController]
  : [loginLimiter, loginController];

const refreshMiddlewares = isTest
  ? [refreshController]
  : [refreshLimiter, refreshController];


router.post("/register", ...registerMiddlewares);
router.post("/login", ...loginMiddlewares);
router.post("/refresh", ...refreshMiddlewares);

// router.post("/register", registerLimiter, registerController);
// router.post("/login",    loginLimiter,    loginController);
// router.post("/refresh",  refreshLimiter,  refreshController);
router.post("/logout",   verifyToken,     logoutController);

export default router;