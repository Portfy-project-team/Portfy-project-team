import { Request, Response, NextFunction } from 'express'
import {
  getProfSettings, updateProfProfile,
  updatePassword, deleteProfAccount
} from './settings.service.js'

export async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await getProfSettings(req.user.id)
    res.json({ success: true, data })
  } catch (e) { next(e) }
}

export async function patchProfile(req: Request, res: Response, next: NextFunction) {
  try {
    await updateProfProfile(req.user.id, req.body)
    res.json({ success: true, message: 'Profil mis à jour.' })
  } catch (e) { next(e) }
}

export async function patchPassword(req: Request, res: Response, next: NextFunction) {
  try {
    await updatePassword(req.user.id, {
      current:     req.body.current,
      newPassword: req.body.new,
    })
    res.json({ success: true, message: 'Mot de passe modifié.' })
  } catch (e) { next(e) }
}

export async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteProfAccount(req.user.id)
    res.json({ success: true, message: 'Compte supprimé.' })
  } catch (e) { next(e) }
}