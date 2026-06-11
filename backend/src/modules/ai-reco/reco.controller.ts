import type { Request, Response } from 'express'
import { generateLetterSchema } from './reco.validation.js'
import { generateRecommendationLetter } from './recoApi.js'

export async function generateLetterController(req: Request, res: Response): Promise<void> {
  // 1. Validation
  const parsed = generateLetterSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: parsed.error.flatten().fieldErrors,
    })
    return
  }

  // 2. Génération
  try {
    const letter = await generateRecommendationLetter(parsed.data)

    res.status(200).json({
      success: true,
      letter,
    })
  } catch (error) {
    console.error('[generateLetterController] Erreur IA:', error)

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération de la lettre. Veuillez réessayer.',
    })
  }
}