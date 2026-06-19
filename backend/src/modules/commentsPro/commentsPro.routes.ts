// backend/src/modules/commentsPro/commentsPro.routes.ts

import { Router } from 'express'
import { verifyToken } from '../../middlewares/auth.middleware.js'
import { CommentsProController } from './commentsPro.controller.js'

const router = Router()

const controller =
  new CommentsProController()

router.use(verifyToken)

router.post(
  '/',
  (req, res) =>
    controller.create(req, res)
)

router.get(
  '/portfolio/:portfolioId',
  (req, res) =>
    controller.getPortfolioComments(req, res)
)

/**
 * NOUVEAU
 * Mes commentaires
 */
router.get(
  '/me',
  (req, res) =>
    controller.getMine(req, res)
)

/**
 * NOUVEAU
 * Un commentaire
 */
router.get(
  '/:id',
  (req, res) =>
    controller.getOne(req, res)
)

/**
 * NOUVEAU
 * Modifier
 */
router.put(
  '/:id',
  (req, res) =>
    controller.update(req, res)
)

router.delete(
  '/:id',
  (req, res) =>
    controller.delete(req, res)
)

export default router