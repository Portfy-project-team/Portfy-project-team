import { Router } from "express";
import {
  createFormationController,
  getMyFormationsController,
  updateFormationController,
  deleteFormationController,
} from "./formation.controller.js";
import {
  verifyToken,
  requireRole,
} from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  requireRole("STUDENT"),
  createFormationController
);

router.get(
  "/me",
  verifyToken,
  requireRole("STUDENT"),
  getMyFormationsController
);

router.put(
  "/:id",
  verifyToken,
  requireRole("STUDENT"),
  updateFormationController
);

router.delete(
  "/:id",
  verifyToken,
  requireRole("STUDENT"),
  deleteFormationController
);

export default router;
