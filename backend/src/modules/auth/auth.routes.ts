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

// Rate limiting register — 5 tentatives / 15 min par IP
// Protege contre : creation de comptes en masse, spam BDD, saturation bcrypt CPU
const registerLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            5,
  message:        { message: "Trop de tentatives. Reessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders:  false,
});

// Rate limiting login — 10 tentatives / 15 min par IP
// Plus permissif que register car les utilisateurs oublient parfois leur mdp
const loginLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            10,
  message:        { message: "Trop de tentatives. Reessayez dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders:  false,
});

// Rate limiting refresh — 30 requetes / 15 min par IP
// Plus permissif : le frontend rafraichit regulierement le token en arriere-plan
const refreshLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            30,
  message:        { message: "Trop de tentatives. Reessayez plus tard." },
  standardHeaders: true,
  legacyHeaders:  false,
});

router.post("/register", registerLimiter, registerController);
router.post("/login",    loginLimiter,    loginController);
router.post("/refresh",  refreshLimiter,  refreshController);

// Logout protege par verifyToken — seul un utilisateur connecte peut se deconnecter
// Evite le spam de la route /logout par des bots
router.post("/logout", verifyToken, logoutController);

export default router;