import { Router } from 'express'
import { verifyToken } from '../../middlewares/auth.middleware.js'
import {
  getNotificationsController,
  markOneReadController,
  markAllReadController,
  deleteNotificationController,
} from './Notification.controller.js'

const router = Router()

router.use(verifyToken)

router.get('/',                  getNotificationsController)   // GET    /api/notifications
router.patch('/read-all',        markAllReadController)        // PATCH  /api/notifications/read-all
router.patch('/:id/read',        markOneReadController)        // PATCH  /api/notifications/:id/read
router.delete('/:id',            deleteNotificationController) // DELETE /api/notifications/:id

export default router