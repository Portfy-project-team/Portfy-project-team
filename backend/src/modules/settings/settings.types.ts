export interface ProfileUpdate {
  fullName:    string
  email:       string
  phone?:      string
  institution?: string
}

export interface NotificationsUpdate {
  recommendations: boolean
  comments:        boolean
  portfolios:      boolean
  weekly:          boolean
}

export interface DisplayUpdate {
  language: string
  theme:    string
}

export interface PasswordUpdate {
  current: string
  newPassword: string
}

export interface SettingsResponse {
  fullName:    string
  email:       string
  phone:       string | null
  institution: string | null
  filiere?:    string | null
  niveau?:     string | null
  anneePromotion?: string | null
  bio?:        string | null
  city?:       string | null
  country?:    string | null
  language:    string
  theme:       string
  notifications: {
    recommendations: boolean
    comments:        boolean
    portfolios:      boolean
    weekly:          boolean
  }
}