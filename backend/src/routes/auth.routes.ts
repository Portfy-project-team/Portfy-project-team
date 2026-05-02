import { Router } from 'express'
import AuthController from '../controllers/auth.controller.js'
import { verifierToken } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/register', AuthController.inscription)
router.post('/login',    AuthController.connexion)
router.get('/profile',   verifierToken, AuthController.getProfil)
router.put('/profile',   verifierToken, AuthController.updateProfil)

export default router