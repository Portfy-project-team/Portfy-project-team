import { PrismaClient } from '@prisma/client'
import { SearchResult, SearchQuery } from './Search.types.js'

const prisma = new PrismaClient()

export class SearchService {

  async searchPortfolios(query: SearchQuery): Promise<SearchResult[]> {
    const { q, limit = 10 } = query

    if (!q || q.trim().length < 2) return []

    const portfolios = await prisma.portfolio.findMany({
      where: {
        visibilite: 'PUBLIC',
        student: {
          OR: [
            { nom: { contains: q, mode: 'insensitive' } },
            { prenom: { contains: q, mode: 'insensitive' } },
            { etablissement: { contains: q, mode: 'insensitive' } },
            { filiere: { contains: q, mode: 'insensitive' } },
            {
              skills: {
                some: {
                  skill: { nom: { contains: q, mode: 'insensitive' } },
                },
              },
            },
          ],
        },
      },
      include: {
        student: {
          include: {
            user: { select: { avatarUrl: true } },
            skills: {
              include: { skill: true },
              take: 5,
            },
          },
        },
      },
      take: limit,
      orderBy: { scoreCredibilite: 'desc' },
    })

    return portfolios.map((p) => {
      const student = p.student
      const fullName = `${student.prenom ?? ''} ${student.nom ?? ''}`.trim()

      return {
        id: p.id,
        studentId: student.id,
        studentName: fullName,
        initials: this.getInitials(fullName),
        color: student.user.avatarUrl ?? this.generateColor(student.id),
        school: student.etablissement ?? '',
        filiere: student.filiere ?? '',
        tags: student.skills.map((s) => s.skill.nom),
        scoreCredibilite: p.scoreCredibilite,
        visibilite: p.visibilite,
      }
    })
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