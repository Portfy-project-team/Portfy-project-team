import { Router } from "express";
import {
  createRecommendationController,
  getPendingRecommendationsController,
  acceptRecommendationController,
  rejectRecommendationController,
} from "./recommendation.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/",             verifyToken, createRecommendationController);
router.get("/pending/me",    verifyToken, requireRole("STUDENT"), getPendingRecommendationsController);
router.put("/:id/accept",    verifyToken, requireRole("STUDENT"), acceptRecommendationController);
router.put("/:id/reject",    verifyToken, requireRole("STUDENT"), rejectRecommendationController);

export default router;