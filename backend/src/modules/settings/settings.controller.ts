import { Request, Response, NextFunction } from 'express'
import {
  getSettings as getUnifiedSettings, 
  updateProfile,
  updatePassword, 
  deleteAccount as deleteUnifiedAccount
} from './settings.service.js'

export async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getUnifiedSettings(req.user.id, req.user.role)
    res.json({ success: true, data })
  } catch (e) { next(e) }
}

export async function patchProfile(req: Request, res: Response, next: NextFunction) {
  try {
    await updateProfile(req.user.id, req.user.role, req.body)
    res.json({ success: true, message: 'Profil mis à jour.' })
  } catch (e) { next(e) }
}

export async function patchPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await updatePassword(req.user.id, {
      current:     req.body.current || req.body.currentPassword,
      newPassword: req.body.new || req.body.newPassword,
    })
    res.json({ success: true, message: 'Mot de passe modifié.' })
  } catch (e) { next(e) }
}

export async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteUnifiedAccount(req.user.id, req.user.role)
    res.json({ success: true, message: 'Compte supprimé.' })
  } catch (e) { next(e) }
}
