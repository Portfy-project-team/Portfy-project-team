import { Router } from "express";
import {
  addStudentSkillController,
  getMySkillsController,
  updateStudentSkillController,
  deleteStudentSkillController,
  getMySkillRadarController,
  getMySkillStatsController,
} from "./skill.controller.js";
import {
  verifyToken,
  requireRole,
} from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/me",
  verifyToken,
  requireRole("STUDENT"),
  addStudentSkillController
);

router.get(
  "/me",
  verifyToken,
  requireRole("STUDENT"),
  getMySkillsController
);

router.get(
  "/me/radar",
  verifyToken,
  requireRole("STUDENT"),
  getMySkillRadarController
);

router.get(
  "/me/stats",
  verifyToken,
  requireRole("STUDENT"),
  getMySkillStatsController
);

router.put(
  "/me/:skillId",
  verifyToken,
  requireRole("STUDENT"),
  updateStudentSkillController
);

router.delete(
  "/me/:skillId",
  verifyToken,
  requireRole("STUDENT"),
  deleteStudentSkillController
);

export default router;