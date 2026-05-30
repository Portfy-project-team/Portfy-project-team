import { Router } from "express";
import {
  createProjectController,
  getMyProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
  submitProjectController,
  getPendingProjectsController,
  validateProjectController,
  rejectProjectController,
} from "./project.controller.js";
import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/",
  verifyToken, requireRole("STUDENT"),
  createProjectController
);

router.get("/me",
  verifyToken, requireRole("STUDENT"),
  getMyProjectsController
);

router.get("/pending",
  verifyToken, requireRole("PROF", "ADMIN"),
  getPendingProjectsController
);

router.get("/:id",
  verifyToken,
  getProjectByIdController
);

router.put("/:id",
  verifyToken, requireRole("STUDENT"),
  updateProjectController
);

// ADMIN ajouté — peut supprimer n'importe quel projet
router.delete("/:id",
  verifyToken, requireRole("STUDENT", "ADMIN"),
  deleteProjectController
);

router.post("/:id/submit",
  verifyToken, requireRole("STUDENT"),
  submitProjectController
);

router.put("/:id/validate",
  verifyToken, requireRole("PROF", "ADMIN"),
  validateProjectController
);

router.put("/:id/reject",
  verifyToken, requireRole("PROF", "ADMIN"),
  rejectProjectController
);

export default router;