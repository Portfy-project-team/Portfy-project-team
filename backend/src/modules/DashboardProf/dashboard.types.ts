export interface DashboardUser {
  name:        string
  full_name:   string
  role:        string
  institution: string | null
}

export interface StatItem {
  key:   string
  label: string
  value: number
  trend: string
}

export interface TagItem {
  label: string
  class: 'tag-personal' | 'tag-validated' | 'tag-stage' | 'tag-tech'
}

export interface PendingProject {
  id:       number
  initials: string
  color:    string
  student:  string
  title:    string
  stack:    string
  date:     string
  tags:     TagItem[]
  status:   string
  type:     string | null
}

export interface RecommendationItem {
  id:          number
  initials:    string
  color:       string
  student:     string
  text:        string
  date:        string
  status:      'published' | 'pending'
  statusLabel: 'Publiée' | 'En attente'
}

export interface ActivityItem {
  id:      number
  color:   string
  text:    string
  time:    string
  is_read: boolean
  type:    string
}

export interface DashboardResponse {
  user:            DashboardUser
  stats:           StatItem[]
  pendingProjects: PendingProject[]
  recommendations: RecommendationItem[]
  recentActivity:  ActivityItem[]
}