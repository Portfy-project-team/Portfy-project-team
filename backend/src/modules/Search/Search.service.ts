import { PrismaClient } from '@prisma/client'
import { SearchResult, SearchQuery } from './Search.types.js'

const prisma = new PrismaClient()

export class SearchService {

  async searchPortfolios(query: SearchQuery): Promise<SearchResult[]> {
    const { q, filiere, limit = 100 } = query

    const where: any = {}

    if (q && q.trim().length >= 2) {
      const searchTerm = q.trim()
      where.OR = [
        { nom: { contains: searchTerm, mode: 'insensitive' } },
        { prenom: { contains: searchTerm, mode: 'insensitive' } },
        { etablissement: { contains: searchTerm, mode: 'insensitive' } },
        { filiere: { contains: searchTerm, mode: 'insensitive' } },
        {
          skills: {
            some: {
              skill: { nom: { contains: searchTerm, mode: 'insensitive' } },
            },
          },
        },
      ]
    }

    if (filiere) {
      where.filiere = { contains: filiere, mode: 'insensitive' }
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        user: { select: { avatarUrl: true } },
        portfolio: true,
        skills: {
          include: { skill: true },
          take: 5,
        },
      },
      take: limit,
      orderBy: [
        { portfolio: { scoreCredibilite: 'desc' } },
        { nom: 'asc' }
      ],
    })

    return students.map((student) => {
      const fullName = `${student.prenom ?? ''} ${student.nom ?? ''}`.trim()
      const p = student.portfolio

      return {
        id: p?.id ?? 0,
        studentId: student.id,
        studentName: fullName,
        initials: this.getInitials(fullName),
        color: student.user.avatarUrl ?? this.generateColor(student.id),
        school: student.etablissement ?? '',
        filiere: student.filiere ?? '',
        tags: student.skills.map((s) => s.skill.nom),
        scoreCredibilite: p?.scoreCredibilite ?? 0,
        visibilite: p?.visibilite ?? 'PUBLIC',
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