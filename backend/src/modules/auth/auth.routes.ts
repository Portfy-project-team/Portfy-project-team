import { Router } from "express";

import multer from "multer";

import rateLimit from "express-rate-limit";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  verifyEmailController,
  resendVerificationController,
  forgotPasswordController,
  resetPasswordController,
  googleVerifyController,
  googleCompleteController
} from "./auth.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";


const router = Router();
// multer — mémoire uniquement, le service gère le stockage
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format non accepté. PDF, JPG ou PNG uniquement."));
    }
  },
});

const isTest = process.env.NODE_ENV === "test";
const isK6 = process.env.K6 === "true";
const bypass  = isTest || isK6;

// ── Rate limiters
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

  const verifyEmailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max:      10,
  message:  { message: "Trop de tentatives. Réessayez dans 1 heure." },
  standardHeaders: true,
  legacyHeaders:   false,
});

const resendVerificationLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             3,
  message:         { message: "Trop de demandes. Réessayez dans 1 heure." },
  standardHeaders: true,
  legacyHeaders:   false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             5,
  message:         { message: "Trop de tentatives. Réessayez dans 1 heure." },
  standardHeaders: true,
  legacyHeaders:   false,
});

const resetPasswordLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             5,
  message:         { message: "Trop de tentatives. Réessayez dans 1 heure." },
  standardHeaders: true,
  legacyHeaders:   false,
});
// ── Routes

const registerMiddlewares = (isTest || isK6)
  ? [registerController]
  : [registerLimiter, registerController];

const loginMiddlewares = (isTest || isK6)
  ? [loginController]
  : [loginLimiter, loginController];

const refreshMiddlewares = (isTest || isK6)
  ? [refreshController]
  : [refreshLimiter, refreshController];


router.post(
  "/register",
  upload.single("verificationDocument"),
  ...registerMiddlewares
);
router.post("/login", ...loginMiddlewares);
router.post("/refresh", ...refreshMiddlewares);

// router.post("/register", registerLimiter, registerController);
// router.post("/login",    loginLimiter,    loginController);
// router.post("/refresh",  refreshLimiter,  refreshController);

router.post("/logout",   verifyToken,     logoutController);
router.get("/verify-email", verifyEmailLimiter, verifyEmailController);
router.post("/forgot-password", forgotPasswordLimiter, forgotPasswordController);
router.post("/reset-password",  resetPasswordLimiter,  resetPasswordController);
// router.post("/register",            registerLimiter,           registerController);
// router.post("/login",               loginLimiter,              loginController);
// router.post("/refresh",             refreshLimiter,            refreshController);
// router.post("/logout",              verifyToken,               logoutController);
// router.get("/verify-email",         verifyEmailLimiter,        verifyEmailController);
router.post("/resend-verification", resendVerificationLimiter, resendVerificationController);
// router.post("/forgot-password",     forgotPasswordLimiter,     forgotPasswordController);
// router.post("/reset-password",      resetPasswordLimiter,      resetPasswordController);

// Étape 1 — Vérifier le token Google et checker si l'utilisateur existe
router.post("/google/verify",               googleVerifyController);

// Étape 2 — Compléter l'inscription avec le rôle choisi
router.post("/google/complete-registration", googleCompleteController);


export default router;