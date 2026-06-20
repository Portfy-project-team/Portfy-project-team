import { Router } from "express";
import {
  createLetterController,
  getMyLettersController,
  getLettersCreatedByMeController,
  updateLetterVisibilityController,
  deleteLetterController,
} from "./letter.controller.js";
import {
  verifyToken,
  requireRole,
} from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/",
  verifyToken,
  requireRole("PROF"),
  createLetterController
);

router.get(
  "/me",
  verifyToken,
  requireRole("STUDENT"),
  getMyLettersController
);

router.get(
  "/created-by-me",
  verifyToken,
  requireRole("PROF"),
  getLettersCreatedByMeController
);

router.put(
  "/:id/visibility",
  verifyToken,
  requireRole("STUDENT"),
  updateLetterVisibilityController
);

router.delete(
  "/:id",
  verifyToken,
  requireRole("PROF", "ADMIN"),
  deleteLetterController
);

export default router;