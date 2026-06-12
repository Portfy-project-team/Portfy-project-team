// backend/src/modules/commentsPro/commentsPro.service.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class CommentsProService {

  async getProfessionalId(userId: number): Promise<number> {

    const professional =
      await prisma.professionnel.findUnique({
        where: { userId },
        select: { id: true }
      })

    if (!professional) {
      throw new Error('Profil professionnel introuvable')
    }

    return professional.id
  }

  async createComment(
    userId: number,
    portfolioId: number,
    contenu: string
  ) {

    const professionalId =
      await this.getProfessionalId(userId)

    const portfolio =
      await prisma.portfolio.findUnique({
        where: { id: portfolioId }
      })

    if (!portfolio) {
      throw new Error('Portfolio introuvable')
    }

    const comment =
      await prisma.commentaire.create({
        data: {
          contenu,
          portfolioId,
          authorProId: professionalId,
          statut: 'PENDING'
        }
      })

    return comment
  }

  async getPortfolioComments(portfolioId: number) {

    return prisma.commentaire.findMany({
      where: {
        portfolioId,
        statut: 'VALIDATED'
      },
      include: {
        Professionnel: true
      },
      orderBy: {
        dateC: 'desc'
      }
    })
  }

  async deleteComment(
    userId: number,
    commentId: number
  ) {

    const professionalId =
      await this.getProfessionalId(userId)

    const comment =
      await prisma.commentaire.findFirst({
        where: {
          id: commentId,
          authorProId: professionalId
        }
      })

    if (!comment) {
      throw new Error('Commentaire introuvable')
    }

    await prisma.commentaire.delete({
      where: {
        id: commentId
      }
    })

    return true
  }
}