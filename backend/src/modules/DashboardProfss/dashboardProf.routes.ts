import { Router } from 'express'
import { verifyToken } from '../../middlewares/auth.middleware.js'
import { getDashboardProf } from './dashboardProf.controller.js'

const router = Router()

router.get(
  '/',
  verifyToken,
  getDashboardProf
)

export default router