import { Router } from "express";
import { registerController } from "./auth.controller.js";

const router = Router();

// Register route
router.post("/register", registerController);

export default router;