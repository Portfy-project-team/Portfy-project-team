import { Router } from 'express'
import { generateLetterController } from './reco.controller.js'

const router = Router()

/**
 * POST /api/ai-reco/generate
 * Génère une lettre de recommandation via Groq IA
 */
router.post('/generate', generateLetterController)

export default router