import { Router } from "express";
import { changePassword, getMe, getSkills, updateProfile } from "./user.controller.js";
import { verifyToken } from "../../middlewares/auth.middleware.js"

const router = Router()

router.get('/me',verifyToken,getMe)
router.put('/me/profile', verifyToken, updateProfile);
router.patch('/change-password', verifyToken, changePassword);
router.get('/skills',getSkills)
export default router