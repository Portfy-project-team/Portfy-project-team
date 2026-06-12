// backend/src/modules/commentsPro/commentsPro.controller.ts

import { Request, Response } from 'express'
import { CommentsProService } from './commentsPro.service.js'

const service = new CommentsProService()

export class CommentsProController {

  async create(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        (req as any).user.id

      const {
        portfolioId,
        contenu
      } = req.body

      if (!portfolioId || !contenu) {
        return res.status(400).json({
          success: false,
          message:
            'portfolioId et contenu sont requis'
        })
      }

      const data =
        await service.createComment(
          userId,
          portfolioId,
          contenu
        )

      return res.status(201).json({
        success: true,
        data
      })

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message
      })

    }
  }

  async getPortfolioComments(
    req: Request,
    res: Response
  ) {

    try {

      const portfolioId =
        Number(req.params['portfolioId'])

      const data =
        await service.getPortfolioComments(
          portfolioId
        )

      return res.status(200).json({
        success: true,
        data
      })

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message
      })

    }
  }

  async delete(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        (req as any).user.id

      const commentId =
        Number(req.params['id'])

      await service.deleteComment(
        userId,
        commentId
      )

      return res.status(200).json({
        success: true,
        message:
          'Commentaire supprimé'
      })

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message
      })

    }
  }
}