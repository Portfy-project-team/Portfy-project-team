import { Router } from 'express'
import { SearchController } from './Search.controller.js'
import { verifyToken } from '../../middlewares/auth.middleware.js'

const router = Router()
const controller = new SearchController()

router.use(verifyToken)

/**
 * @route   GET /professor/search
 * @desc    Search student portfolios by name, school, filiere or skills
 * @access  Professor
 * @query   q: string        — search term (min 2 chars)
 * @query   limit: number    — max results (default 10)
 */
router.get('/', (req, res) => controller.search(req, res))

export default router