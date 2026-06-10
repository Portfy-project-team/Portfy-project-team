import { Router } from "express";
import {
  createCommentController,
  getPendingCommentsController,
  acceptCommentController,
  rejectCommentController,
} from "./comment.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

// Tout utilisateur connecté peut commenter (STUDENT, PROF, PRO)
router.post("/", verifyToken, createCommentController);

// Seul l'étudiant propriétaire du portfolio gère ses commentaires
router.get("/pending/me",       verifyToken, requireRole("STUDENT"), getPendingCommentsController);
router.put("/:id/accept",       verifyToken, requireRole("STUDENT"), acceptCommentController);
router.put("/:id/reject",       verifyToken, requireRole("STUDENT"), rejectCommentController);

export default router;