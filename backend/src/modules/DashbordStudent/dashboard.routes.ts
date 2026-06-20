import { Router } from 'express'
import { getDashboard } from './dashboard.controller.js'
import { verifyToken } from "../../middlewares/auth.middleware.js";

const router = Router()

router.get('/', verifyToken, getDashboard)

export default router