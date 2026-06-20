import { PrismaClient } from '@prisma/client'
import {
  RecommandationItem,
  RecommandationsStats,
  GetRecommandationsQuery,
  CreateRecommandationDto,
  UpdateRecommandationDto,
} from './Recommandations.types.js'

const prisma = new PrismaClient()

export class RecommandationsService {

  // ── Helper : récupérer profId depuis userId ──────────────────────
  private async getProfId(userId: number): Promise<number> {
    const prof = await prisma.prof.findUnique({
      where: { userId },
      select: { id: true },
    })
    if (!prof) throw new Error('Profil professeur introuvable')
    return prof.id
  }

  // ── Helper : formater une recommandation ─────────────────────────
  private format(r: any): RecommandationItem {
    const student = r.Portfolio.student
    const fullName = `${student.prenom ?? ''} ${student.nom ?? ''}`.trim()

    return {
      id: r.id,
      message: r.message ?? '',
      date: r.date,
      statut: r.statut,
      portfolioId: r.portfolioId,
      studentId: student.id,
      studentName: fullName,
      initials: this.getInitials(fullName),
      color: student.user?.avatarUrl ?? this.generateColor(student.id),
      contextType: 'Portfolio',
    }
  }

  // GET toutes les recommandations du prof avec filtres
  async getAll(
    userId: number,
    query: GetRecommandationsQuery
  ): Promise<RecommandationItem[]> {
    const profId = await this.getProfId(userId)
    const { filter = 'all', search = '' } = query

    const recos = await prisma.recommendation.findMany({
      where: {
        authorProfId: profId,
        ...(filter === 'published' && { statut: 'VALIDATED' }),
        ...(filter === 'pending' && { statut: 'PENDING' }),
        ...(search && {
          Portfolio: {
            student: {
              OR: [
                { nom: { contains: search, mode: 'insensitive' } },
                { prenom: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        }),
      },
      include: {
        Portfolio: {
          include: {
            student: {
              include: {
                user: { select: { avatarUrl: true } },
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    return recos.map((r) => this.format(r))
  }

  // GET stats
  async getStats(userId: number): Promise<RecommandationsStats> {
    const profId = await this.getProfId(userId)

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const [total, published, pending, monthlyNew, weeklyPublished] =
      await Promise.all([
        prisma.recommendation.count({ where: { authorProfId: profId } }),

        prisma.recommendation.count({
          where: { authorProfId: profId, statut: 'VALIDATED' },
        }),

        prisma.recommendation.count({
          where: { authorProfId: profId, statut: 'PENDING' },
        }),

        prisma.recommendation.count({
          where: { authorProfId: profId, date: { gte: startOfMonth } },
        }),

        prisma.recommendation.count({
          where: {
            authorProfId: profId,
            statut: 'VALIDATED',
            date: { gte: oneWeekAgo },
          },
        }),
      ])

    return { total, published, pending, monthlyNew, weeklyPublished }
  }

  // GET une recommandation par ID
  async getById(userId: number, recoId: number): Promise<RecommandationItem> {
    const profId = await this.getProfId(userId)

    const reco = await prisma.recommendation.findFirst({
      where: { id: recoId, authorProfId: profId },
      include: {
        Portfolio: {
          include: {
            student: {
              include: { user: { select: { avatarUrl: true } } },
            },
          },
        },
      },
    })

    if (!reco) throw new Error('Recommandation introuvable')
    return this.format(reco)
  }

  // POST créer une recommandation
  async create(
    userId: number,
    dto: CreateRecommandationDto
  ): Promise<RecommandationItem> {
    const profId = await this.getProfId(userId)

    // Vérifier que le portfolio existe
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: dto.portfolioId },
    })
    if (!portfolio) throw new Error('Portfolio introuvable')

    // Vérifier qu'il n'a pas déjà recommandé ce portfolio
    const existing = await prisma.recommendation.findFirst({
      where: { authorProfId: profId, portfolioId: dto.portfolioId },
    })
    if (existing) throw new Error('Vous avez déjà rédigé une recommandation pour cet étudiant')

    const reco = await prisma.recommendation.create({
      data: {
        message: dto.message,
        portfolioId: dto.portfolioId,
        authorProfId: profId,
        statut: 'PENDING',
        date: new Date(),
      },
      include: {
        Portfolio: {
          include: {
            student: {
              include: { user: { select: { avatarUrl: true } } },
            },
          },
        },
      },
    })

    return this.format(reco)
  }

  // PATCH modifier le message d'une recommandation
  async update(
    userId: number,
    recoId: number,
    dto: UpdateRecommandationDto
  ): Promise<RecommandationItem> {
    const profId = await this.getProfId(userId)

    const reco = await prisma.recommendation.findFirst({
      where: { id: recoId, authorProfId: profId },
    })
    if (!reco) throw new Error('Recommandation introuvable')

    const updated = await prisma.recommendation.update({
      where: { id: recoId },
      data: { message: dto.message },
      include: {
        Portfolio: {
          include: {
            student: {
              include: { user: { select: { avatarUrl: true } } },
            },
          },
        },
      },
    })

    return this.format(updated)
  }

  // DELETE supprimer une recommandation
  async delete(userId: number, recoId: number): Promise<void> {
    const profId = await this.getProfId(userId)

    const reco = await prisma.recommendation.findFirst({
      where: { id: recoId, authorProfId: profId },
    })
    if (!reco) throw new Error('Recommandation introuvable')

    await prisma.recommendation.delete({ where: { id: recoId } })
  }

  // ── Helpers ──────────────────────────────────────────────────────
  private getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  private generateColor(id: number): string {
    const colors = [
      '#0891b2', '#7c3aed', '#4f46e5',
      '#059669', '#d97706', '#be185d',
    ]
    return colors[id % colors.length]
  }
}