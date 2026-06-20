import { PrismaClient } from '@prisma/client'
import {
  VisitedPortfolio,
  PortfoliosConsultesStats,
  GetPortfoliosQuery,
  ToggleBookmarkResponse,
} from './portfoliosConsultes.types.js'

const prisma = new PrismaClient()

export class PortfoliosConsultesService {

  // Get all visited portfolios for a professor with optional filters
  async getVisitedPortfolios(
    userId: number,
    query: GetPortfoliosQuery
  ): Promise<VisitedPortfolio[]> {
    const profId = await this.getProfId(userId)
    const { filter = 'all', sortBy = 'recent', search = '' } = query

    const visits = await prisma.portfolioVisit.findMany({
      where: {
        profId,
        ...(filter === 'bookmarked' && { bookmarked: true }),
        ...(search && {
          portfolio: {
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
        portfolio: {
          include: {
            student: {
              include: {
                user: { select: { avatarUrl: true } },
              },
            },
            Recommendation: {
              where: { authorProfId: profId },
            },
            Commentaire: {
              where: { authorProfId: profId },
            },
            skills: {
              include: { skill: true },
            },
          },
        },
      },
      orderBy:
        sortBy === 'recent'
          ? { visitedAt: 'desc' }
          : sortBy === 'visits'
          ? { visitCount: 'desc' }
          : undefined,
    })

    let result = visits.map((v) => {
      const student = v.portfolio.student
      const fullName = `${student.prenom ?? ''} ${student.nom ?? ''}`.trim()

      return {
        id: v.portfolio.id,
        visitId: v.id,
        studentId: student.id,
        studentName: fullName,
        initials: this.getInitials(fullName),
        color: student.user.avatarUrl ?? this.generateColor(student.id),
        school: student.etablissement ?? '',
        filiere: student.filiere ?? '',
        tags: v.portfolio.skills.map((s) => s.skill.nom),
        lastVisit: v.visitedAt,
        visits: v.visitCount,
        hasComment: v.portfolio.Commentaire.length > 0,
        hasReco: v.portfolio.Recommendation.length > 0,
        bookmarked: v.bookmarked,
      }
    })

    if (filter === 'recommended') result = result.filter((r) => r.hasReco)
    if (filter === 'commented') result = result.filter((r) => r.hasComment)

    if (sortBy === 'name') {
      result.sort((a, b) => a.studentName.localeCompare(b.studentName))
    }

    return result
  }

  // Get stats for the stats row
  async getStats(userId: number): Promise<PortfoliosConsultesStats> {
    const profId = await this.getProfId(userId)
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const [allVisits, weeklyNewVisits, weeklyNewComments] = await Promise.all([
      prisma.portfolioVisit.findMany({
        where: { profId },
        include: {
          portfolio: {
            include: {
              Recommendation: { where: { authorProfId: profId } },
              Commentaire: { where: { authorProfId: profId } },
            },
          },
        },
      }),

      prisma.portfolioVisit.count({
        where: { profId, visitedAt: { gte: oneWeekAgo } },
      }),

      prisma.commentaire.count({
        where: { authorProfId: profId, dateC: { gte: oneWeekAgo } },
      }),
    ])

    const recommended = allVisits.filter(
      (v) => v.portfolio.Recommendation.length > 0
    ).length

    const commented = allVisits.filter(
      (v) => v.portfolio.Commentaire.length > 0
    ).length

    return {
      total: allVisits.length,
      recommended,
      commented,
      weeklyNewVisits,
      weeklyNewComments,
    }
  }

  // Record or increment a portfolio visit
  async recordVisit(userId: number, portfolioId: number): Promise<void> {
    const profId = await this.getProfId(userId)

    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
    })
    if (!portfolio) throw new Error('Portfolio not found')

    await prisma.portfolioVisit.upsert({
      where: { profId_portfolioId: { profId, portfolioId } },
      update: {
        visitedAt: new Date(),
        visitCount: { increment: 1 },
      },
      create: {
        profId,
        portfolioId,
        visitedAt: new Date(),
        visitCount: 1,
        bookmarked: false,
      },
    })
  }

  // Toggle bookmark on a visited portfolio
  async toggleBookmark(
    userId: number,
    portfolioId: number
  ): Promise<ToggleBookmarkResponse> {
    const profId = await this.getProfId(userId)

    const visit = await prisma.portfolioVisit.findUnique({
      where: { profId_portfolioId: { profId, portfolioId } },
    })

    if (!visit) throw new Error('Visit record not found')

    const updated = await prisma.portfolioVisit.update({
      where: { profId_portfolioId: { profId, portfolioId } },
      data: { bookmarked: !visit.bookmarked },
    })

    return { portfolioId, bookmarked: updated.bookmarked }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  private async getProfId(userId: number): Promise<number> {
    const prof = await prisma.prof.findUnique({
      where: { userId },
      select: { id: true },
    })
    if (!prof) throw new Error('Profil professeur introuvable')
    return prof.id
  }

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