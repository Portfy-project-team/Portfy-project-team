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
      projets:        projets.length,
      projetsValidés: projets.filter(p => p.statusV === 'VALIDATED').length,
      stages:         stages.length,
      stagesEnCours:  stages.filter(s => s.statutV === 'PENDING').length,
      score:          student?.portfolio?.scoreCredibilite ?? 0,
    },
    activities: notifications.map(n => ({
      id:      n.id,
      message: n.message,
      time:    n.dateC,
      isRead:  n.isRead,
      type:    n.type,
    }))
  }
}