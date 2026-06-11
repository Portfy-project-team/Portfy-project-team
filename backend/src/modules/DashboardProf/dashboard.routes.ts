import { Router } from 'express'
import { dashboardController } from './dashboard.controller.js'
// Importe ton middleware d'authentification existant
// Adapte le chemin selon ta structure : ../../middlewares/auth ou ../../middlewares/authMiddleware
import { verifyToken } from '../../middlewares/auth.middleware.js'
const router = Router()

/**
 * GET /api/dashboard
 * Retourne toutes les données du dashboard selon le rôle (PROF ou STUDENT)
 * Protégé par JWT via verifyToken
 */
router.get('/', verifyToken, dashboardController)

export default router