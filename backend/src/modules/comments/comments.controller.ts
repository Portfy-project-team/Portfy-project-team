// comments.controller.ts
import { Request, Response, NextFunction } from 'express'
import { getProfComments, getStudentComments, markCommentRead, deleteComment } from './comments.service.js'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const { id: userId, role } = req.user
    let data;

    if (role === Role.PROF) {
      const prof = await prisma.prof.findUniqueOrThrow({ where: { userId } })
      data = await getProfComments(prof.id)
    } else if (role === Role.STUDENT) {
      const student = await prisma.student.findUniqueOrThrow({ where: { userId } })
      data = await getStudentComments(student.id)
    } else {
      res.status(403).json({ message: "Rôle non supporté pour les commentaires" })
      return
    }

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
