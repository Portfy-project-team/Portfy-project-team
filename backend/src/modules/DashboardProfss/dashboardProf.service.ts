import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getDashboardProfData = async (userId: number) => {

  const professionnel =
    await prisma.professionnel.findUnique({
      where: {
        userId
      }
    })

  if (!professionnel) {
    throw new Error('Professionnel introuvable')
  }

  const recommendationsCount =
    await prisma.recommendation.count({
      where: {
        authorProId: professionnel.id
      }
    })

  const commentsCount =
    await prisma.commentaire.count({
      where: {
        authorProId: professionnel.id
      }
    })

  const notificationsCount =
    await prisma.notification.count({
      where: {
        proId: professionnel.id
      }
    })

  return {
    stats: [
      {
        key: 'recommendations',
        label: 'Recommandations données',
        value: recommendationsCount,
        trend: 'Total'
      },
      {
        key: 'comments',
        label: 'Commentaires publiés',
        value: commentsCount,
        trend: 'Total'
      },
      {
        key: 'notifications',
        label: 'Notifications',
        value: notificationsCount,
        trend: 'Total'
      }
    ],

    pendingProjects: [],
    recommendations: [],
    recentActivity: []
  }
  
}
