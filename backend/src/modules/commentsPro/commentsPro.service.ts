// backend/src/modules/commentsPro/commentsPro.service.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class CommentsProService {

  async getProfessionalId(
    userId: number
  ): Promise<number> {

    const professional =
      await prisma.professionnel.findUnique({
        where: {
          userId
        },
        select: {
          id: true
        }
      })

    if (!professional) {
      throw new Error(
        'Profil professionnel introuvable'
      )
    }

    return professional.id
  }

  /**
   * CREATE
   */
  async createComment(
    userId: number,
    portfolioId: number,
    contenu: string
  ) {

    const professionalId =
      await this.getProfessionalId(userId)

    const portfolio =
      await prisma.portfolio.findUnique({
        where: {
          id: portfolioId
        }
      })

    if (!portfolio) {
      throw new Error(
        'Portfolio introuvable'
      )
    }

    const comment =
      await prisma.commentaire.create({
        data: {
          contenu,
          portfolioId,
          authorProId: professionalId
        }
      })

    return comment
  }

  /**
   * READ ALL COMMENTS OF A PORTFOLIO
   */
  async getPortfolioComments(
    portfolioId: number
  ) {

    return prisma.commentaire.findMany({
      where: {
        portfolioId
      },
      include: {
        Professionnel: true
      },
      orderBy: {
        id: 'desc'
      }
    })
  }

  /**
   * READ MY COMMENTS
   */
  async getMyComments(
    userId: number
  ) {

    const professionalId =
      await this.getProfessionalId(userId)

    return prisma.commentaire.findMany({
      where: {
        authorProId: professionalId
      },
      include: {
        Portfolio: true
      },
      orderBy: {
        id: 'desc'
      }
    })
  }

  /**
   * READ ONE COMMENT
   */
  async getCommentById(
    commentId: number
  ) {

    const comment =
      await prisma.commentaire.findUnique({
        where: {
          id: commentId
        },
        include: {
          Professionnel: true,
          Portfolio: true
        }
      })

    if (!comment) {
      throw new Error(
        'Commentaire introuvable'
      )
    }

    return comment
  }

  /**
   * UPDATE
   */
  async updateComment(
    userId: number,
    commentId: number,
    contenu: string
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
      throw new Error(
        'Commentaire introuvable'
      )
    }

    return prisma.commentaire.update({
      where: {
        id: commentId
      },
      data: {
        contenu
      }
    })
  }

  /**
   * DELETE
   */
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
      throw new Error(
        'Commentaire introuvable'
      )
    }

    await prisma.commentaire.delete({
      where: {
        id: commentId
      }
    })

    return {
      success: true,
      message:
        'Commentaire supprimé'
    }
  }

}