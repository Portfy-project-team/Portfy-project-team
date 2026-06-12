export interface SearchResult {
  id: number           // portfolio id
  studentId: number
  studentName: string
  initials: string
  color: string
  school: string
  filiere: string
  tags: string[]
  scoreCredibilite: number
  visibilite: string
}

export interface SearchQuery {
  q?: string            // search term
  filiere?: string
  limit?: number       // max results (default 10)
}