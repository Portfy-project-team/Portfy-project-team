import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/auth.middleware.js";
import {
  getMyPortfolio,
  getPublicPortfolio,
  updateSettings,
} from "./portfolio.controller.js";

const router = Router();

// Connecté — étudiant uniquement
router.get("/me",       verifyToken, requireRole("STUDENT"), getMyPortfolio);
router.put("/settings", verifyToken, requireRole("STUDENT"), updateSettings);

// Public — pas d'auth requise
router.get("/public/:studentId", getPublicPortfolio);

export default router;
