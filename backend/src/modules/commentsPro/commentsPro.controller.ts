// backend/src/modules/commentsPro/commentsPro.controller.ts

import { Request, Response } from 'express'
import { CommentsProService } from './commentsPro.service.js'

const service = new CommentsProService()

export class CommentsProController {

  /**
   * CREATE
   */
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
          Number(portfolioId),
          contenu
        )

      return res.status(201).json({
        success: true,
        data
      })

    } catch (error: any) {

      console.error(error)

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          'Erreur lors de la création du commentaire'
      })

    }

  }

  /**
   * READ ALL COMMENTS OF A PORTFOLIO
   */
  async getPortfolioComments(
    req: Request,
    res: Response
  ) {

    try {

      const portfolioId =
        Number(req.params.portfolioId)

      const data =
        await service.getPortfolioComments(
          portfolioId
        )

      return res.status(200).json({
        success: true,
        data
      })

    } catch (error: any) {

      console.error(error)

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          'Erreur lors de la récupération des commentaires'
      })

    }

  }

  /**
   * READ MY COMMENTS
   */
  async getMine(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        (req as any).user.id

      const data =
        await service.getMyComments(
          userId
        )

      return res.status(200).json({
        success: true,
        data
      })

    } catch (error: any) {

      console.error(error)

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          'Erreur lors de la récupération des commentaires'
      })

    }

  }

  /**
   * READ ONE COMMENT
   */
  async getOne(
    req: Request,
    res: Response
  ) {

    try {

      const commentId =
        Number(req.params.id)

      const data =
        await service.getCommentById(
          commentId
        )

      return res.status(200).json({
        success: true,
        data
      })

    } catch (error: any) {

      console.error(error)

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          'Erreur lors de la récupération du commentaire'
      })

    }

  }

  /**
   * UPDATE
   */
  async update(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        (req as any).user.id

      const commentId =
        Number(req.params.id)

      const { contenu } =
        req.body

      if (!contenu) {

        return res.status(400).json({
          success: false,
          message:
            'Le contenu est obligatoire'
        })

      }

      const data =
        await service.updateComment(
          userId,
          commentId,
          contenu
        )

      return res.status(200).json({
        success: true,
        data
      })

    } catch (error: any) {

      console.error(error)

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          'Erreur lors de la modification du commentaire'
      })

    }

  }

  /**
   * DELETE
   */
  async delete(
    req: Request,
    res: Response
  ) {

    try {

      const userId =
        (req as any).user.id

      const commentId =
        Number(req.params.id)

      const data =
        await service.deleteComment(
          userId,
          commentId
        )

      return res.status(200).json({
        success: true,
        data
      })

    } catch (error: any) {

      console.error(error)

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          'Erreur lors de la suppression du commentaire'
      })

    }

  }

}