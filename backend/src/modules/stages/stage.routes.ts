import { Router } from "express";
import { requireRole, verifyToken } from "../../middlewares/auth.middleware.js";
import { 
  AjouterStageController, 
  DeleteStageController, 
  GetMyStagesController,
  GetProfsController,
  GetStageByIdController,
  GetSubmittedStagesController,
  RejectStageController,
  SubmitStageController,
  UpdateStageController,
  ValidateStageController,
} from "./stage.controller.js";

const router = Router();
router.get("/encadrants", verifyToken, requireRole("STUDENT"),GetProfsController);     
router.post("/", verifyToken, requireRole("STUDENT"), AjouterStageController);
router.get("/me", verifyToken, requireRole("STUDENT"), GetMyStagesController);
router.get("/submitted",  verifyToken, requireRole("PROF","ADMIN"), GetSubmittedStagesController);

router.get("/:id",verifyToken, requireRole("STUDENT","PROF","ADMIN"),GetStageByIdController);
router.patch("/:id", verifyToken, requireRole("STUDENT"),UpdateStageController);
router.delete("/:id", verifyToken, requireRole("STUDENT"), DeleteStageController);
router.patch("/:id/submit", verifyToken, requireRole("STUDENT"),  SubmitStageController);
router.patch("/:id/validate",verifyToken, requireRole("PROF"),ValidateStageController);
router.patch("/:id/reject",  verifyToken, requireRole("PROF"),  RejectStageController);

export default router;