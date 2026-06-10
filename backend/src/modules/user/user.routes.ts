import { Router } from "express";
import fs from "fs";
import path from "path";

import {
  changePassword,
  getMe,
  getSkills,
  updateProfile,
  uploadAvatar,
} from "./user.controller.js";

import { verifyToken } from "../../middlewares/auth.middleware.js";
import { uploadAvatar as uploadMiddleware } from "../../middlewares/upload.middleware.js";
const router = Router();

router.get("/me", verifyToken, getMe);
router.put("/me/profile", verifyToken, updateProfile);
router.patch("/change-password", verifyToken, changePassword);
router.get("/skills", verifyToken, getSkills);

router.post("/avatar", verifyToken, uploadMiddleware, uploadAvatar);

export default router;