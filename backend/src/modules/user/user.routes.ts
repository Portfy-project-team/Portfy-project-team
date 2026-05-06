import { Router } from "express";
import { changePassword, getMe, getSkills, updateProfile } from "./user.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.middleware.js";

const router = Router()

router.get('/me',authenticate,getMe)
router.put('/me/profile', authenticate, updateProfile);
router.patch('/change-password', authenticate, changePassword);
router.get('/skills',getSkills)
export default router