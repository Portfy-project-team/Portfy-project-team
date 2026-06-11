import { Router } from 'express'
import { RecommandationsController } from './Recommandations.controller.js'
import { verifyToken } from '../../middlewares/auth.middleware.js'

const router = Router()
const controller = new RecommandationsController()

router.use(verifyToken)

/**
 * @route   GET /professor/recommandations
 * @desc    Get all recommendations by the prof with optional filter/search
 * @query   filter: 'all' | 'published' | 'pending'
 * @query   search: string
 */
router.get('/', (req, res) => controller.getAll(req, res))

/**
 * @route   GET /professor/recommandations/stats
 * @desc    Get stats (total, published, pending, trends)
 */
router.get('/stats', (req, res) => controller.getStats(req, res))

/**
 * @route   GET /professor/recommandations/:id
 * @desc    Get a single recommendation by ID
 */
router.get('/:portfolioId', (req, res) => controller.getById(req, res))

/**
 * @route   POST /professor/recommandations
 * @desc    Create a new recommendation
 * @body    { portfolioId: number, message: string }
 */
router.post('/', (req, res) => controller.create(req, res))

/**
 * @route   PATCH /professor/recommandations/:id
 * @desc    Update recommendation message
 * @body    { message: string }
 */
router.patch('/:id', (req, res) => controller.update(req, res))

/**
 * @route   DELETE /professor/recommandations/:id
 * @desc    Delete a recommendation
 */
router.delete('/:id', (req, res) => controller.delete(req, res))

export default router