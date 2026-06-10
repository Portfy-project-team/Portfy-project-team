import { Request, Response } from 'express'
import { RecommandationsService } from './Recommandations.service.js'
import {
  GetRecommandationsQuery,
  CreateRecommandationDto,
  UpdateRecommandationDto,
} from './Recommandations.types.js'

const service = new RecommandationsService()

export class RecommandationsController {

  // GET /professor/recommandations
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id as number
      const query: GetRecommandationsQuery = {
        filter: (req.query.filter as GetRecommandationsQuery['filter']) ?? 'all',
        search: (req.query.search as string) ?? '',
      }
      const data = await service.getAll(userId, query)
      res.status(200).json({ success: true, data })
    } catch (error: any) {
      const status = error.message === 'Profil professeur introuvable' ? 403 : 500
      res.status(status).json({ success: false, message: error.message })
    }
  }

  // GET /professor/recommandations/stats
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id as number
      const data = await service.getStats(userId)
      res.status(200).json({ success: true, data })
    } catch (error: any) {
      const status = error.message === 'Profil professeur introuvable' ? 403 : 500
      res.status(status).json({ success: false, message: error.message })
    }
  }

  // GET /professor/recommandations/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id as number
      const recoId = parseInt(String(req.params['portfolioId'] ?? ''), 10)
      if (isNaN(recoId)) {
        res.status(400).json({ success: false, message: 'ID invalide' })
        return
      }
      const data = await service.getById(userId, recoId)
      res.status(200).json({ success: true, data })
    } catch (error: any) {
      const status =
        error.message === 'Recommandation introuvable' ? 404
        : error.message === 'Profil professeur introuvable' ? 403
        : 500
      res.status(status).json({ success: false, message: error.message })
    }
  }

  // POST /professor/recommandations
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id as number
      const dto: CreateRecommandationDto = {
        portfolioId: req.body.portfolioId,
        message: req.body.message,
      }

      if (!dto.portfolioId || !dto.message) {
        res.status(400).json({ success: false, message: 'portfolioId et message sont requis' })
        return
      }

      const data = await service.create(userId, dto)
      res.status(201).json({ success: true, data })
    } catch (error: any) {
      const status =
        error.message === 'Portfolio introuvable' ? 404
        : error.message.includes('déjà rédigé') ? 409
        : error.message === 'Profil professeur introuvable' ? 403
        : 500
      res.status(status).json({ success: false, message: error.message })
    }
  }

  // PATCH /professor/recommandations/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id as number
      const recoId = parseInt(String(req.params['portfolioId'] ?? ''), 10)
      if (isNaN(recoId)) {
        res.status(400).json({ success: false, message: 'ID invalide' })
        return
      }

      const dto: UpdateRecommandationDto = { message: req.body.message }
      if (!dto.message) {
        res.status(400).json({ success: false, message: 'message est requis' })
        return
      }

      const data = await service.update(userId, recoId, dto)
      res.status(200).json({ success: true, data })
    } catch (error: any) {
      const status =
        error.message === 'Recommandation introuvable' ? 404
        : error.message === 'Profil professeur introuvable' ? 403
        : 500
      res.status(status).json({ success: false, message: error.message })
    }
  }

  // DELETE /professor/recommandations/:id
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id as number
      const recoId = parseInt(String(req.params['portfolioId'] ?? ''), 10)
      if (isNaN(recoId)) {
        res.status(400).json({ success: false, message: 'ID invalide' })
        return
      }

      await service.delete(userId, recoId)
      res.status(200).json({ success: true, message: 'Recommandation supprimée' })
    } catch (error: any) {
      const status =
        error.message === 'Recommandation introuvable' ? 404
        : error.message === 'Profil professeur introuvable' ? 403
        : 500
      res.status(status).json({ success: false, message: error.message })
    }
  }
}