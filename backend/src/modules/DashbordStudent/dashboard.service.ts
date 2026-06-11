import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getDashboardData = async (studentId: number) => {

  // Récupère le student avec son portfolio et ses projets/stages
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      portfolio: {
        include: { projets: true }
      },
      Stage: true,
      Recommendation: true,
    }
  })

  // Activité récente via les Notifications du student
  const notifications = await prisma.notification.findMany({
    where: { studentId },
    orderBy: { dateC: 'desc' },
    take: 5
  })

  const projets = student?.portfolio?.projets ?? []
  const stages  = student?.Stage ?? []



  return {
  prenom: student?.prenom ?? 'Utilisateur',

  stats: {
    projets: projets.length,
    projetsValidés: projets.filter(
      p => p.statusV === 'VALIDATED'
    ).length,

    stages: stages.length,

    stagesEnCours: stages.filter(
      s => s.statutV === 'PENDING'
    ).length,

    score: student?.portfolio?.scoreCredibilite ?? 0,

    level:
      (student?.portfolio?.scoreCredibilite ?? 0) >= 80
        ? 'Excellent'
        : (student?.portfolio?.scoreCredibilite ?? 0) >= 60
        ? 'Bon'
        : 'Débutant',

    details: [
      {
        label: 'Projets',
        percent: Math.min(projets.length * 10, 100),
        max: 30
      },
      {
        label: 'Stages',
        percent: Math.min(stages.length * 20, 100),
        max: 40
      },
      {
        label: 'Recommandations',
        percent: Math.min(
          (student?.Recommendation?.length ?? 0) * 20,
          100
        ),
        max: 30
      }
    ]
  },

  activities: notifications.map(n => ({
    id: n.id,
    message: n.message,
    createdAt: n.dateC,
    color: n.isRead ? 'green' : 'blue',
    type: n.type
  }))
}
}