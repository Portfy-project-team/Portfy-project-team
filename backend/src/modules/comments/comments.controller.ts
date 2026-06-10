// comments.controller.ts
import { Request, Response, NextFunction } from 'express'
import { getProfComments, markCommentRead, deleteComment } from './comments.service.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const prof = await prisma.prof.findUniqueOrThrow({ where: { userId: req.user.id } })
    const data = await getProfComments(prof.id)
    res.json({ success: true, data })
  } catch (e) { next(e) }
}

export async function patchCommentRead(req: Request, res: Response, next: NextFunction) {
  try {
    await markCommentRead(Number(req.params.id))
    res.json({ success: true })
  } catch (e) { next(e) }
}

export async function removeComment(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteComment(Number(req.params.id))
    res.json({ success: true })
  } catch (e) { next(e) }
}