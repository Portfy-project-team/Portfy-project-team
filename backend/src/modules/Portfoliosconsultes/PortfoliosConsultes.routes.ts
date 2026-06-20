import { Router } from 'express'
import { PortfoliosConsultesController } from './portfoliosConsultes.controller.js'
import { verifyToken } from '../../middlewares/auth.middleware.js'

const router = Router()
const controller = new PortfoliosConsultesController()

// All routes require authentication
router.use(verifyToken)

/**
 * @route   GET /professor/portfolios-consultes
 * @desc    Get all visited portfolios with optional filter/sort/search
 * @access  Professor
 * @query   filter: 'all' | 'recommended' | 'commented' | 'bookmarked'
 * @query   sortBy: 'recent' | 'name' | 'visits'
 * @query   search: string
 */
router.get('/', (req, res) => controller.getVisitedPortfolios(req, res))

/**
 * @route   GET /professor/portfolios-consultes/stats
 * @desc    Get stats (total, recommended, commented, weekly trends)
 * @access  Professor
 */
router.get('/stats', (req, res) => controller.getStats(req, res))

/**
 * @route   POST /professor/portfolios-consultes/:portfolioId/visit
 * @desc    Record or increment a portfolio visit
 * @access  Professor
 */
router.post('/:portfolioId/visit', (req, res) => controller.recordVisit(req, res))

/**
 * @route   PATCH /professor/portfolios-consultes/:portfolioId/bookmark
 * @desc    Toggle bookmark on a visited portfolio
 * @access  Professor
 */
router.patch('/:portfolioId/bookmark', (req, res) => controller.toggleBookmark(req, res))

export default router