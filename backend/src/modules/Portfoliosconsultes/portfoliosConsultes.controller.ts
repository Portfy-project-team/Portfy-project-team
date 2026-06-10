import { Request, Response } from 'express'
import { PortfoliosConsultesService } from './portfoliosConsultes.service.js'
import { GetPortfoliosQuery } from './portfoliosConsultes.types.js'

const service = new PortfoliosConsultesService()

export class PortfoliosConsultesController {

  // GET /professor/portfolios-consultes
  async getVisitedPortfolios(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id as number
      const query: GetPortfoliosQuery = {
        filter: (req.query.filter as GetPortfoliosQuery['filter']) ?? 'all',
        sortBy: (req.query.sortBy as GetPortfoliosQuery['sortBy']) ?? 'recent',
        search: (req.query.search as string) ?? '',
      }
      const portfolios = await service.getVisitedPortfolios(userId, query)
      res.status(200).json({ success: true, data: portfolios })
    } catch (error: any) {
      const status = error.message === 'Profil professeur introuvable' ? 403 : 500
      res.status(status).json({ success: false, message: error.message })
    }
  }

  // GET /professor/portfolios-consultes/stats
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id as number
      const stats = await service.getStats(userId)
      res.status(200).json({ success: true, data: stats })
    } catch (error: any) {
      const status = error.message === 'Profil professeur introuvable' ? 403 : 500
      res.status(status).json({ success: false, message: error.message })
    }
  }

  // POST /professor/portfolios-consultes/:portfolioId/visit
  async recordVisit(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id as number
      const portfolioId = parseInt(String(req.params['portfolioId'] ?? ''), 10)
      if (isNaN(portfolioId)) {
        res.status(400).json({ success: false, message: 'portfolioId invalide' })
        return
      }
      await service.recordVisit(userId, portfolioId)
      res.status(200).json({ success: true, message: 'Visite enregistrée' })
    } catch (error: any) {
      const status =
        error.message === 'Portfolio not found' ? 404
        : error.message === 'Profil professeur introuvable' ? 403
        : 500
      res.status(status).json({ success: false, message: error.message })
    }
  }

  // PATCH /professor/portfolios-consultes/:portfolioId/bookmark
  async toggleBookmark(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id as number
      const portfolioId = parseInt(String(req.params['portfolioId'] ?? ''), 10)
      if (isNaN(portfolioId)) {
        res.status(400).json({ success: false, message: 'portfolioId invalide' })
        return
      }
      const result = await service.toggleBookmark(userId, portfolioId)
      res.status(200).json({ success: true, data: result })
    } catch (error: any) {
      const status =
        error.message === 'Visit record not found' ? 404
        : error.message === 'Profil professeur introuvable' ? 403
        : 500
      res.status(status).json({ success: false, message: error.message })
    }
  }
}