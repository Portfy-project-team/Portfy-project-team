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
import {
  verifyToken, //verifier si user est connecte 
  requireRole, // verifier le role de user student oki ms Admin non 
} from "../../middlewares/auth.middleware.js";

/*
chaque route doit toujours :

1. vérifier utilisateur
2. vérifier rôle
3. exécuter action
*/
const router = Router();
// creer un projet 
router.post(
  "/",
  verifyToken,
  requireRole("STUDENT"),
  createProjectController
);
// mes projets 
router.get(
  "/me",
  verifyToken,
  requireRole("STUDENT"),
  getMyProjectsController
);
//projets en attente 
router.get(
  "/pending",
  verifyToken,
  requireRole("PROF", "ADMIN"),
  getPendingProjectsController
);
//projet par ID
router.get(
  "/:id",
  verifyToken,
  getProjectByIdController
);
//MODIFIER UN PROJET 
router.put(
  "/:id",
  verifyToken,
  requireRole("STUDENT"),
  updateProjectController
);

router.delete(
  "/:id",
  verifyToken,
  requireRole("STUDENT"),
  deleteProjectController
);

router.post(
  "/:id/submit",
  verifyToken,
  requireRole("STUDENT"),
  submitProjectController
);

router.put(
  "/:id/validate",
  verifyToken,
  requireRole("PROF", "ADMIN"),
  validateProjectController
);

router.put(
  "/:id/reject",
  verifyToken,
  requireRole("PROF", "ADMIN"),
  rejectProjectController
);

export default router;