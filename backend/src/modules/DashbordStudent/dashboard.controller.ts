import { Request, Response } from 'express'
import { getDashboardData } from './dashboard.service.js'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getDashboard = async (req: Request, res: Response) => {
  try {
    // req.user.id = l'id du User (pas du Student)
    const userId = (req as any).user.id

    // On cherche le Student lié à ce User
    const student = await prisma.student.findUnique({
      where: { userId }
    })

    if (!student) {
      res.status(404).json({ message: 'Étudiant introuvable' })
      return
    }

    const data = await getDashboardData(student.id)
    res.json({ success: true, data })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Erreur serveur' })
  }
}