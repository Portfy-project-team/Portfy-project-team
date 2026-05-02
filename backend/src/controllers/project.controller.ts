import { Request, Response, NextFunction } from 'express'
import ProjectService from '../services/project.service.js'
import { successResponse } from '../utils/response.utils.js'

const ProjectController = {
  creer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projet = await ProjectService.creer((req as any).user.id, req.body)
      return successResponse(res, 201, 'Projet créé', { projet })
    } catch (err) { next(err) }
  },
  getMesProjets: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projets = await ProjectService.getMesProjets((req as any).user.id)
      return successResponse(res, 200, 'Projets récupérés', { projets })
    } catch (err) { next(err) }
  },
  getProjetsEnAttente: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projets = await ProjectService.getProjetsEnAttente()
      return successResponse(res, 200, 'Projets en attente', { projets })
    } catch (err) { next(err) }
  },
  valider: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string
      const { statut, appreciation } = req.body
      const projet = await ProjectService.valider(id, (req as any).user.id, statut, appreciation)
      return successResponse(res, 200, `Projet ${statut}`, { projet })
    } catch (err) { next(err) }
  },
 getPortfolioPublic: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const etudiant_id = req.params.etudiant_id as string
      const data = await ProjectService.getPortfolioPublic(etudiant_id)
      return successResponse(res, 200, 'Portfolio récupéré', data)
    } catch (err) { next(err) }
  }
}
export default ProjectController