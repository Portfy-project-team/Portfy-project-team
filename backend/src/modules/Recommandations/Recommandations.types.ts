export type StatutReco = 'PENDING' | 'VALIDATED' | 'REJECTED'

export interface RecommandationItem {
  id: number
  message: string
  date: Date
  statut: StatutReco
  portfolioId: number
  // Infos étudiant
  studentId: number
  studentName: string
  initials: string
  color: string
  // Type de contexte (Portfolio / Stage / Projet)
  contextType: 'Portfolio' | 'Stage' | 'Projet'
}

export interface RecommandationsStats {
  total: number
  published: number   // VALIDATED
  pending: number     // PENDING
  monthlyNew: number  // créées ce mois
  weeklyPublished: number
}

export interface GetRecommandationsQuery {
  filter?: 'all' | 'published' | 'pending'
  search?: string
}

export interface CreateRecommandationDto {
  portfolioId: number
  message: string
}

export interface UpdateRecommandationDto {
  message: string
}