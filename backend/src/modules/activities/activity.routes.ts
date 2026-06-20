import { Router } from "express";
import {
  createActivityController,
  getMyActivitiesController,
  updateActivityController,
  deleteActivityController,
  getPendingActivitiesController,
  validateActivityController,
  rejectActivityController,
} from "./activity.controller.js";
import {
  verifyToken,
  requireRole,
} from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  requireRole("STUDENT"),
  createActivityController
);

router.get(
  "/me",
  verifyToken,
  requireRole("STUDENT"),
  getMyActivitiesController
);

router.get(
  "/pending",
  verifyToken,
  requireRole("ADMIN"),
  getPendingActivitiesController
);

router.put(
  "/:id",
  verifyToken,
  requireRole("STUDENT"),
  updateActivityController
);

router.delete(
  "/:id",
  verifyToken,
  requireRole("STUDENT"),
  deleteActivityController
);

router.put(
  "/:id/validate",
  verifyToken,
  requireRole("ADMIN"),
  validateActivityController
);

router.put(
  "/:id/reject",
  verifyToken,
  requireRole("ADMIN"),
  rejectActivityController
);

export default router;