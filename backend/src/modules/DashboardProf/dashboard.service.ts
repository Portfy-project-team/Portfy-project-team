import { PrismaClient, Role, StatutValidation } from '@prisma/client'
import {
  DashboardResponse,
  DashboardUser,
  StatItem,
  PendingProject,
  RecommendationItem,
  ActivityItem,
  TagItem,
} from './dashboard.types.js'

const prisma = new PrismaClient()

// ─── Helpers ──────────────────────────────────────────────────────────────────

const COLORS = ['#6c63ff', '#ff6584', '#43b89c', '#f9a825', '#e05260', '#4fc3f7']

function colorAt(index: number): string {
  return COLORS[index % COLORS.length]
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours   = Math.floor(minutes / 60)
  const days    = Math.floor(hours / 24)
  if (seconds < 60)  return 'il y a quelques secondes'
  if (minutes < 60)  return `il y a ${minutes} min`
  if (hours   < 24)  return `il y a ${hours}h`
  return `il y a ${days}j`
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(date)
}

// Couleur du dot par type de notification
const NOTIF_COLOR: Record<string, string> = {
  PROJECT_SUBMITTED:       '#6c63ff',
  PROJECT_VALIDATED:       '#43b89c',
  PROJECT_REJECTED:        '#e05260',
  STAGE_VALIDATED:         '#43b89c',
  STAGE_REJECTED:          '#e05260',
  ACTIVITY_VALIDATED:      '#43b89c',
  COMMENT_RECEIVED:        '#43b89c',
  RECOMMENDATION_RECEIVED: '#f9a825',
  LETTER_RECEIVED:         '#f9a825',
}

// ─── DASHBOARD PROF ───────────────────────────────────────────────────────────
async function getProfDashboard(userId: number): Promise<DashboardResponse> {
  const prof = await prisma.prof.findUniqueOrThrow({
    where: { userId },
    select: {
      id: true, nom: true, prenom: true, etablissement: true,
      user: { select: { role: true } },
    },
  })

  const profId = prof.id

  // ── Stats (7 jours glissants pour les deltas) ──────────────────────────────
  const oneWeekAgo  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalSubmitted, weekSubmitted,
    totalValidated, monthValidated,
    totalLetters,   weekLetters,
    totalComments,  weekComments,
    totalRecos,     monthRecos,
  ] = await Promise.all([
    // Projets soumis assignés au prof (profId) ou dans son établissement
    prisma.projet.count({ where: { profId, statusV: StatutValidation.PENDING } }),
    prisma.projet.count({ where: { profId, statusV: StatutValidation.PENDING, dateSoumission: { gte: oneWeekAgo } } }),

    prisma.projet.count({ where: { profId, statusV: StatutValidation.VALIDATED } }),
    prisma.projet.count({ where: { profId, statusV: StatutValidation.VALIDATED, dateSoumission: { gte: oneMonthAgo } } }),

    prisma.lettreRecommandation.count({ where: { profId } }),
    prisma.lettreRecommandation.count({ where: { profId, date: { gte: oneWeekAgo } } }),

    prisma.commentaire.count({ where: { authorProfId: profId } }),
    prisma.commentaire.count({ where: { authorProfId: profId, dateC: { gte: oneWeekAgo } } }),

    prisma.recommendation.count({ where: { authorProfId: profId } }),
    prisma.recommendation.count({ where: { authorProfId: profId, date: { gte: oneMonthAgo } } }),
  ])

  const stats: StatItem[] = [
    { key: 'projects_submitted',    label: 'Projets soumis',             value: totalSubmitted, trend: `+${weekSubmitted} cette semaine` },
    { key: 'projects_validated',    label: 'Projets validés',            value: totalValidated, trend: `+${monthValidated} ce mois`       },
    { key: 'letters',               label: 'Lettres de recommandations', value: totalLetters,   trend: `+${weekLetters} cette semaine`    },
    { key: 'comments',              label: 'Commentaires écrits',        value: totalComments,  trend: `+${weekComments} cette semaine`   },
    { key: 'recommendations_given', label: 'Recommandations données',    value: totalRecos,     trend: `+${monthRecos} ce mois`           },
  ]

  // ── Projets en attente assignés au prof ────────────────────────────────────
  const projets = await prisma.projet.findMany({
    where: { profId, statusV: StatutValidation.PENDING },
    orderBy: { dateSoumission: 'desc' },
    take: 10,
    select: {
      id: true, titre: true, technologie: true, type: true,
      statusV: true, dateSoumission: true,
      portfolio: {
        select: {
          student: { select: { nom: true, prenom: true } },
        },
      },
      skills: { select: { skill: { select: { nom: true } } } },
    },
  })

  const pendingProjects: PendingProject[] = projets.map((p, i) => {
    const nom    = p.portfolio.student.nom    ?? ''
    const prenom = p.portfolio.student.prenom ?? ''
    const initials = `${prenom[0] ?? '?'}${nom[0] ?? '?'}`.toUpperCase()

    // Technologies : champ texte libre + skills liés
    const techFromText = p.technologie ? p.technologie.split(/[,·\s]+/).filter(Boolean) : []
    const techFromSkills = p.skills.map(s => s.skill.nom)
    const allTech = [...new Set([...techFromText, ...techFromSkills])]

    // Tags = techs + badge statut
    const techTags: TagItem[] = allTech.slice(0, 3).map(t => ({ label: t, class: 'tag-tech' }))
    const statusTag: TagItem = p.type === 'STAGE'
      ? { label: 'Stage en cours', class: 'tag-stage' }
      : { label: 'Projet personnel', class: 'tag-personal' }

    return {
      id:       p.id,
      initials,
      color:    colorAt(i),
      student:  `${prenom} ${nom}`.trim(),
      title:    p.titre ?? 'Sans titre',
      stack:    allTech.slice(0, 4).join(' · '),
      date:     p.dateSoumission ? timeAgo(p.dateSoumission) : 'inconnu',
      tags:     [...techTags, statusTag],
      status:   p.statusV,
      type:     p.type,
    }
  })

  // ── Recommandations données par ce prof ────────────────────────────────────
  const recos = await prisma.recommendation.findMany({
    where: { authorProfId: profId },
    orderBy: { date: 'desc' },
    take: 5,
    select: {
      id: true, message: true, date: true, statut: true,
      Portfolio: {
        select: {
          student: { select: { nom: true, prenom: true } },
        },
      },
    },
  })

  const recommendations: RecommendationItem[] = recos.map((r, i) => {
    const nom    = r.Portfolio.student.nom    ?? ''
    const prenom = r.Portfolio.student.prenom ?? ''
    const isPublished = r.statut === StatutValidation.VALIDATED
    return {
      id:          r.id,
      initials:    `${prenom[0] ?? '?'}${nom[0] ?? '?'}`.toUpperCase(),
      color:       colorAt(i),
      student:     `${prenom} ${nom}`.trim(),
      text:        r.message ?? '',
      date:        formatDate(r.date),
      status:      isPublished ? 'published' : 'pending',
      statusLabel: isPublished ? 'Publiée'   : 'En attente',
    }
  })

  // ── Notifications (activité récente) ──────────────────────────────────────
  const notifs = await prisma.notification.findMany({
    where: { profId },
    orderBy: { dateC: 'desc' },
    take: 10,
    select: { id: true, type: true, message: true, isRead: true, dateC: true },
  })

  const recentActivity: ActivityItem[] = notifs.map(n => ({
    id:      n.id,
    color:   NOTIF_COLOR[n.type] ?? '#aaa',
    text:    n.message,
    time:    timeAgo(n.dateC),
    is_read: n.isRead,
    type:    n.type,
  }))

  // ── User info ──────────────────────────────────────────────────────────────
  const user: DashboardUser = {
    name:        prof.nom ?? '',
    full_name:   `${prof.prenom ?? ''} ${prof.nom ?? ''}`.trim(),
    role:        'professor',
    institution: prof.etablissement,
  }

  return { user, stats, pendingProjects, recommendations, recentActivity }
}

// ─── DASHBOARD STUDENT ────────────────────────────────────────────────────────
async function getStudentDashboard(userId: number): Promise<DashboardResponse> {
  const student = await prisma.student.findUniqueOrThrow({
    where: { userId },
    select: {
      id: true, nom: true, prenom: true, etablissement: true,
      portfolio: { select: { id: true } },
    },
  })

  const studentId  = student.id
  const portfolioId = student.portfolio?.id

  const oneWeekAgo  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [totalProjets, validatedProjets, totalStages, totalRecos] = await Promise.all([
    prisma.projet.count({ where: { portfolio: { studentId } } }),
    prisma.projet.count({ where: { portfolio: { studentId }, statusV: StatutValidation.VALIDATED } }),
    prisma.stage.count({ where: { studentId } }),
    portfolioId ? prisma.recommendation.count({ where: { portfolioId } }) : Promise.resolve(0),
  ])

  const stats: StatItem[] = [
    { key: 'my_projects',     label: 'Mes projets',       value: totalProjets,   trend: '' },
    { key: 'validated',       label: 'Projets validés',   value: validatedProjets, trend: '' },
    { key: 'stages',          label: 'Stages',            value: totalStages,    trend: '' },
    { key: 'recommendations', label: 'Recommandations',   value: totalRecos,     trend: '' },
  ]

  // Mes projets récents
  const projets = portfolioId
    ? await prisma.projet.findMany({
        where: { portfolioId },
        orderBy: { dateSoumission: 'desc' },
        take: 5,
        select: {
          id: true, titre: true, technologie: true, type: true,
          statusV: true, dateSoumission: true,
          skills: { select: { skill: { select: { nom: true } } } },
        },
      })
    : []

  const pendingProjects: PendingProject[] = projets.map((p, i) => {
    const techFromText   = p.technologie ? p.technologie.split(/[,·\s]+/).filter(Boolean) : []
    const techFromSkills = p.skills.map(s => s.skill.nom)
    const allTech        = [...new Set([...techFromText, ...techFromSkills])]
    const techTags: TagItem[] = allTech.slice(0, 3).map(t => ({ label: t, class: 'tag-tech' }))
    const statusMap: Record<string, TagItem> = {
      VALIDATED: { label: 'Projet validé',  class: 'tag-validated' },
      PENDING:   { label: 'En attente',     class: 'tag-personal'  },
      REJECTED:  { label: 'Refusé',         class: 'tag-stage'     },
    }
    return {
      id:       p.id,
      initials: `${student.prenom?.[0] ?? '?'}${student.nom?.[0] ?? '?'}`.toUpperCase(),
      color:    colorAt(i),
      student:  `${student.prenom ?? ''} ${student.nom ?? ''}`.trim(),
      title:    p.titre ?? 'Sans titre',
      stack:    allTech.slice(0, 4).join(' · '),
      date:     p.dateSoumission ? timeAgo(p.dateSoumission) : 'inconnu',
      tags:     [...techTags, statusMap[p.statusV] ?? { label: p.statusV, class: 'tag-tech' }],
      status:   p.statusV,
      type:     p.type,
    }
  })

  // Recommandations reçues
  const recos = portfolioId
    ? await prisma.recommendation.findMany({
        where: { portfolioId },
        orderBy: { date: 'desc' },
        take: 5,
        select: {
          id: true, message: true, date: true, statut: true,
          Prof: { select: { nom: true, prenom: true } },
        },
      })
    : []

  const recommendations: RecommendationItem[] = recos.map((r, i) => {
    const nom    = r.Prof?.nom    ?? ''
    const prenom = r.Prof?.prenom ?? ''
    const isPublished = r.statut === StatutValidation.VALIDATED
    return {
      id:          r.id,
      initials:    `${prenom[0] ?? '?'}${nom[0] ?? '?'}`.toUpperCase(),
      color:       colorAt(i),
      student:     `${prenom} ${nom}`.trim(),
      text:        r.message ?? '',
      date:        formatDate(r.date),
      status:      isPublished ? 'published' : 'pending',
      statusLabel: isPublished ? 'Publiée'   : 'En attente',
    }
  })

  const notifs = await prisma.notification.findMany({
    where: { studentId },
    orderBy: { dateC: 'desc' },
    take: 10,
    select: { id: true, type: true, message: true, isRead: true, dateC: true },
  })

  const recentActivity: ActivityItem[] = notifs.map(n => ({
    id:      n.id,
    color:   NOTIF_COLOR[n.type] ?? '#aaa',
    text:    n.message,
    time:    timeAgo(n.dateC),
    is_read: n.isRead,
    type:    n.type,
  }))

  const user: DashboardUser = {
    name:        student.nom ?? '',
    full_name:   `${student.prenom ?? ''} ${student.nom ?? ''}`.trim(),
    role:        'student',
    institution: student.etablissement,
  }

  return { user, stats, pendingProjects, recommendations, recentActivity }
}

// ─── Export principal ─────────────────────────────────────────────────────────
export async function getDashboardData(userId: number, role: Role): Promise<DashboardResponse> {
  switch (role) {
    case Role.PROF:    return getProfDashboard(userId)
    case Role.STUDENT: return getStudentDashboard(userId)
    default:
      throw new Error(`Dashboard non implémenté pour le rôle : ${role}`)
  }
}