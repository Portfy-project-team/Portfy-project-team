import { Request, Response, NextFunction } from 'express'
import {
  getNotifications,
  markOneRead,
  markAllRead,
  deleteNotification,
} from './Notification.service.js'

// GET /api/notifications
export async function getNotificationsController(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const { id: userId, role } = req.user
    const data = await getNotifications(userId, role)
    res.json({ success: true, data })
  } catch (err) { next(err) }
}

// PATCH /api/notifications/:id/read
export async function markOneReadController(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const { id: userId, role } = req.user
    const notifId = parseInt(req.params['id'] as string)
    await markOneRead(notifId, userId, role)
    res.json({ success: true })
  } catch (err) { next(err) }
}

// PATCH /api/notifications/read-all
export async function markAllReadController(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const { id: userId, role } = req.user
    await markAllRead(userId, role)
    res.json({ success: true })
  } catch (err) { next(err) }
}

// DELETE /api/notifications/:id
export async function deleteNotificationController(
  req: Request, res: Response, next: NextFunction
): Promise<void> {
  try {
    const { id: userId, role } = req.user
    const notifId = parseInt(req.params['id'] as string)
    await deleteNotification(notifId, userId, role)
    res.json({ success: true })
  } catch (err) { next(err) }
}