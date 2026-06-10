// comments.service.ts
import { PrismaClient } from '@prisma/client'
import { CommentsResponse, CommentItem } from './comments.types.js'

const prisma = new PrismaClient()

const COLORS = ['#6c63ff', '#ff6584', '#43b89c', '#f9a825', '#e05260', '#4fc3f7']
const colorAt = (id: number) => COLORS[id % COLORS.length]

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(date)
}

export async function getProfComments(profId: number): Promise<CommentsResponse> {
  // Les commentaires sur les portfolios/projets des étudiants supervisés par ce prof
  const comments = await prisma.commentaire.findMany({
    where: {
      OR: [
        { Portfolio: { projets: { some: { profId } } } }, // sur un projet du prof
        { Projet:    { profId } },                         // directement sur un projet
      ]
    },
    orderBy: { dateC: 'desc' },
    select: {
      id:          true,
      contenu:     true,
      dateC:       true,
      statut:      true,
      projetId:    true,
      portfolioId: true,
      Student:     { select: { nom: true, prenom: true } },
      Professionnel: { select: { nom: true, prenom: true } },
      Prof:        { select: { nom: true, prenom: true } },
      Projet:      { select: { titre: true } },
    }
  })

  const total  = comments.length
  const read   = comments.filter(c => c.statut === 'VALIDATED').length
  const unread = comments.filter(c => c.statut === 'PENDING').length

  const items: CommentItem[] = comments.map(c => {
    // Récupère l'auteur (student, prof ou professionnel)
    const auteur = c.Student ?? c.Prof ?? c.Professionnel
    const nom    = auteur?.nom    ?? ''
    const prenom = auteur?.prenom ?? ''
    const subject = c.Projet?.titre ?? 'Portfolio'

    return {
      id:          c.id,
      studentName: `${prenom} ${nom}`.trim() || 'Anonyme',
      initials:    `${prenom[0] ?? '?'}${nom[0] ?? '?'}`.toUpperCase(),
      color:       colorAt(c.id),
      date:        formatDate(c.dateC),
      text:        c.contenu ?? '',
      subject,
      is_read:     c.statut === 'VALIDATED',
    }
  })

  return { total, read, unread, comments: items }
}

export async function markCommentRead(commentId: number): Promise<void> {
  await prisma.commentaire.update({
    where: { id: commentId },
    data:  { statut: 'VALIDATED' }
  })
}

export async function deleteComment(commentId: number): Promise<void> {
  await prisma.commentaire.delete({
    where: { id: commentId }
  })
}