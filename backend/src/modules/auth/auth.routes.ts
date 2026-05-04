import { Router } from "express";
import rateLimit from "express-rate-limit";
import { registerController } from "./auth.controller.js";

const router = Router();

// Limitation spécifique au register : 5 comptes max par 15min/IP
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Trop de tentatives. Réessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Endpoint unique pour le sprint actuel
router.post("/register", registerLimiter, registerController);

export default router;