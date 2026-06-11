import { TypeNotification } from '@prisma/client'

export interface NotificationItem {
  id:      number
  text:    string        // message de la notification
  time:    string        // "il y a 5 min" (timeAgo)
  read:    boolean       // isRead
  type:    NotifUIType   // mapped depuis TypeNotification
}

// Types UI utilisés dans la Topbar pour icône et couleur
export type NotifUIType = 'comment' | 'view' | 'portfolio' | 'reminder'

export interface NotificationsResponse {
  notifications: NotificationItem[]
  unreadCount:   number
}

export interface MarkReadResponse {
  success: boolean
}