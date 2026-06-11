import { Request, Response } from 'express'
import { SearchService } from './Search.service.js'

const service = new SearchService()

export class SearchController {

  // GET /professor/search?q=ahmed&limit=10
  async search(req: Request, res: Response): Promise<void> {
    try {
      const q = (req.query.q as string) ?? ''
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10

      if (!q || q.trim().length < 2) {
        res.status(200).json({ success: true, data: [] })
        return
      }

      const results = await service.searchPortfolios({ q: q.trim(), limit })
      res.status(200).json({ success: true, data: results })
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message })
    }
  }
}