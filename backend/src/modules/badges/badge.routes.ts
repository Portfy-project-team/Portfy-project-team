import { Router } from "express";
import { getMyBadgesController } from "./badge.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", verifyToken, getMyBadgesController);

export default router;
