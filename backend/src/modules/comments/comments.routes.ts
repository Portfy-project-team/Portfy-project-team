import { Router } from 'express'
import { verifyToken } from '../../middlewares/auth.middleware.js'
import { getComments, patchCommentRead, removeComment } from './comments.controller.js'

const router = Router()

router.get('/',           verifyToken, getComments)
router.patch('/:id/read', verifyToken, patchCommentRead)
router.delete('/:id',     verifyToken, removeComment)

export default router