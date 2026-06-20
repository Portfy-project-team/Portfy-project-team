import { PrismaClient, TypeNotification } from '@prisma/client'
import { NotificationItem, NotifUIType, NotificationsResponse } from './Notification.types.js'

const prisma = new PrismaClient()

// ─── Mapping TypeNotification → type UI (icône + couleur dans la Topbar) ──────
// typeIcon  = { comment: MessageCircle, view: Eye, portfolio: Folder, reminder: BellRing }
// typeColor = { comment: '#4f46e5',     view: '#0891b2', portfolio: '#059669', reminder: '#f5a623' }
const TYPE_MAP: Record<TypeNotification, NotifUIType> = {
  COMMENT_RECEIVED:        'comment',
  RECOMMENDATION_RECEIVED: 'comment',
  PROJECT_SUBMITTED:       'reminder',
  PROJECT_VALIDATED:       'portfolio',
  PROJECT_REJECTED:        'reminder',
  STAGE_VALIDATED:         'portfolio',
  STAGE_REJECTED:          'reminder',
  ACTIVITY_VALIDATED:      'portfolio',
  ACTIVITY_REJECTED:       'reminder',
  LETTER_RECEIVED:         'view',
}

// ─── timeAgo ─────────────────────────────────────────────────────────────────
function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours   = Math.floor(minutes / 60)
  const days    = Math.floor(hours / 24)
  if (seconds < 60)  return 'Il y a quelques secondes'
  if (minutes < 60)  return `Il y a ${minutes} min`
  if (hours   < 24)  return `Il y a ${hours}h`
  if (days    === 1) return 'Hier'
  return `Il y a ${days}j`
}

// ─── Résout le profId/studentId selon le rôle ────────────────────────────────
async function resolveProfileId(userId: number, role: string) {
  if (role === 'PROF') {
    const prof = await prisma.prof.findUnique({ where: { userId }, select: { id: true } })
    return { field: 'profId' as const, id: prof?.id }
  }
  if (role === 'STUDENT') {
    const student = await prisma.student.findUnique({ where: { userId }, select: { id: true } })
    return { field: 'studentId' as const, id: student?.id }
  }
  if (role === 'PRO') {
    const pro = await prisma.professionnel.findUnique({ where: { userId }, select: { id: true } })
    return { field: 'proId' as const, id: pro?.id }
  }
  if (role === 'ADMIN') {
    const admin = await prisma.admin.findUnique({ where: { userId }, select: { id: true } })
    return { field: 'adminId' as const, id: admin?.id }
  }
  return null
}

// ─── GET /api/notifications ───────────────────────────────────────────────────
export async function getNotifications(
  userId: number,
  role: string
): Promise<NotificationsResponse> {
  const profile = await resolveProfileId(userId, role)
  if (!profile?.id) return { notifications: [], unreadCount: 0 }

  const rows = await prisma.notification.findMany({
    where:   { [profile.field]: profile.id },
    orderBy: { dateC: 'desc' },
    take:    20,
    select:  { id: true, type: true, message: true, isRead: true, dateC: true },
  })

  const notifications: NotificationItem[] = rows.map(n => ({
    id:   n.id,
    text: n.message,
    time: timeAgo(n.dateC),
    read: n.isRead,
    type: TYPE_MAP[n.type] ?? 'reminder',
  }))

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
  }
}

// ─── PATCH /api/notifications/:id/read ───────────────────────────────────────
export async function markOneRead(notifId: number, userId: number, role: string): Promise<void> {
  const profile = await resolveProfileId(userId, role)
  if (!profile?.id) return

  await prisma.notification.updateMany({
    where: { id: notifId, [profile.field]: profile.id },
    data:  { isRead: true },
  })
}

// ─── PATCH /api/notifications/read-all ───────────────────────────────────────
export async function markAllRead(userId: number, role: string): Promise<void> {
  const profile = await resolveProfileId(userId, role)
  if (!profile?.id) return

  await prisma.notification.updateMany({
    where: { [profile.field]: profile.id, isRead: false },
    data:  { isRead: true },
  })
}

// ─── DELETE /api/notifications/:id ───────────────────────────────────────────
export async function deleteNotification(notifId: number, userId: number, role: string): Promise<void> {
  const profile = await resolveProfileId(userId, role)
  if (!profile?.id) return

  await prisma.notification.deleteMany({
    where: { id: notifId, [profile.field]: profile.id },
  })
}