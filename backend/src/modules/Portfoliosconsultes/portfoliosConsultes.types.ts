export interface VisitedPortfolio {
  id: number           // portfolio id
  visitId: number      // PortfolioVisit id
  studentId: number
  studentName: string
  initials: string
  color: string
  school: string
  filiere: string
  tags: string[]
  lastVisit: Date
  visits: number
  hasComment: boolean
  hasReco: boolean
  bookmarked: boolean
}

export interface PortfoliosConsultesStats {
  total: number
  recommended: number
  commented: number
  weeklyNewVisits: number
  weeklyNewComments: number
}

export interface GetPortfoliosQuery {
  filter?: 'all' | 'recommended' | 'commented' | 'bookmarked'
  sortBy?: 'recent' | 'name' | 'visits'
  search?: string
}

export interface ToggleBookmarkResponse {
  portfolioId: number
  bookmarked: boolean
}