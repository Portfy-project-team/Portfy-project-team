import { prisma } from '../utils/prisma.js'

const ProjectService = {

  creer: async (userId: number, data: any) => {
    // Trouver le student lié au user
    const student = await prisma.student.findUnique({ where: { userId } })
    if (!student) {
      const err: any = new Error('Étudiant non trouvé')
      err.status = 404
      throw err
    }

    // Trouver ou créer le portfolio de l'étudiant
    let portfolio = await prisma.portfolio.findUnique({ where: { studentId: student.id } })
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: { studentId: student.id, objective: '' }
      })
    }

    return await prisma.projet.create({
      data: {
        portfolioId: portfolio.id,
        titre: data.titre,
        description: data.description,
        technologie: data.technologie,
        githubLink: data.lien_github,
        youtubeLink: data.lien_youtube,
        type: data.type_projet,
        resultats: data.resultats
      }
    })
  },

  getMesProjets: async (userId: number) => {
    const student = await prisma.student.findUnique({ where: { userId } })
    if (!student) return []

    const portfolio = await prisma.portfolio.findUnique({ where: { studentId: student.id } })
    if (!portfolio) return []

    return await prisma.projet.findMany({
      where: { portfolioId: portfolio.id },
      include: { Prof: { select: { nom: true, prenom: true } } },
      orderBy: { dateSoumission: 'desc' }
    })
  },

  getProjetsEnAttente: async () => {
    return await prisma.projet.findMany({
      where: { statusV: 'PENDING' },
      include: {
        portfolio: {
          include: { student: { select: { nom: true, prenom: true, filiere: true } } }
        }
      },
      orderBy: { dateSoumission: 'asc' }
    })
  },

  valider: async (projet_id: string, userId: number, statut: string, appreciation: string) => {
    const statutsValides = ['VALIDATED', 'REJECTED']
    if (!statutsValides.includes(statut)) {
      const err: any = new Error('Statut invalide')
      err.status = 400
      throw err
    }

    const prof = await prisma.prof.findUnique({ where: { userId } })
    if (!prof) {
      const err: any = new Error('Professeur non trouvé')
      err.status = 404
      throw err
    }

    return await prisma.projet.update({
      where: { id: parseInt(projet_id) },
      data: {
        statusV: statut as any,
        profId: prof.id,
        noteProf: appreciation
      }
    })
  },

  getPortfolioPublic: async (studentId: string) => {
    const portfolio = await prisma.portfolio.findUnique({
      where: { studentId: parseInt(studentId) },
      include: {
        projets: { where: { statusV: 'VALIDATED' }, orderBy: { dateSoumission: 'desc' } },
        PortfolioBadge: { include: { Badge: true } },
        student: { select: { nom: true, prenom: true, filiere: true } }
      }
    })
    if (!portfolio) {
      const err: any = new Error('Portfolio non trouvé')
      err.status = 404
      throw err
    }
    return portfolio
  },

  verifierBadges: async (portfolioId: number) => {
    // À implémenter selon la logique badges de l'équipe
  }
}

export default ProjectService