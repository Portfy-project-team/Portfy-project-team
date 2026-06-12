// backend/src/modules/commentsPro/commentsPro.routes.ts

import { Router } from 'express'
import { verifyToken } from '../../middlewares/auth.middleware.js'
import { CommentsProController } from './commentsPro.controller.js'

const router = Router()

const controller =
  new CommentsProController()

router.use(verifyToken)

/**
 * POST
 * /api/comments-pro
 */
router.post(
  '/',
  (req, res) =>
    controller.create(req, res)
)

/**
 * GET
 * /api/comments-pro/portfolio/:portfolioId
 */
router.get(
  '/portfolio/:portfolioId',
  (req, res) =>
    controller.getPortfolioComments(req, res)
)

/**
 * DELETE
 * /api/comments-pro/:id
 */
router.delete(
  '/:id',
  (req, res) =>
    controller.delete(req, res)
)

export default router