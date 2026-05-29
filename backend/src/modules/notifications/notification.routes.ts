import { Router } from "express";
import {
  GetMyNotificationsController,
  MarkAsReadController,
  MarkAllAsReadController,
} from "./notification.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/",         verifyToken, GetMyNotificationsController);
router.put("/read-all", verifyToken, MarkAllAsReadController);  
router.put("/:id/read", verifyToken, MarkAsReadController);

export default router;