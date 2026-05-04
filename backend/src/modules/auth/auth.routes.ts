import { Router } from "express";
import { registerController } from "./auth.controller.js";
import { loginController } from "./auth.controller.js";
import { refreshController } from "./auth.controller.js";

const router = Router();

// Register route
router.post("/register", registerController);
router.post("/login" , loginController);
router.post("/refresh", refreshController);
export default router;
