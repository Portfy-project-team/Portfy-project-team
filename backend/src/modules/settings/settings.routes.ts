import { Router } from 'express'
import { verifyToken } from '../../middlewares/auth.middleware.js'
import { getSettings, patchProfile, patchPassword, deleteAccount } from './settings.controller.js'

const router = Router()

router.get('/',          verifyToken, getSettings)
router.patch('/profile', verifyToken, patchProfile)
router.patch('/password',verifyToken, patchPassword)
router.delete('/account',verifyToken, deleteAccount)

export default router