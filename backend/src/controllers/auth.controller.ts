import { Request, Response, NextFunction } from 'express'
import AuthService from '../services/auth.service.js'
import { successResponse } from '../utils/response.utils.js'

const AuthController = {
  inscription: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const utilisateur = await AuthService.inscription(req.body)
      return successResponse(res, 201, 'Compte créé avec succès', { utilisateur })
    } catch (err) { next(err) }
  },

  connexion: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body  // ← était mot_de_passe
      const data = await AuthService.connexion(email, password)
      return successResponse(res, 200, 'Connexion réussie', data)
    } catch (err) { next(err) }
  },

  getProfil: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const utilisateur = await AuthService.getProfil((req as any).user.id)
      return successResponse(res, 200, 'Profil récupéré', { utilisateur })
    } catch (err) { next(err) }
  },

  updateProfil: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const utilisateur = await AuthService.updateProfil((req as any).user.id, req.body)
      return successResponse(res, 200, 'Profil mis à jour', { utilisateur })
    } catch (err) { next(err) }
  }
}

export default AuthController