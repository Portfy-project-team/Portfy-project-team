import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import {
  ProfileUpdate, NotificationsUpdate,
  DisplayUpdate, PasswordUpdate, SettingsResponse
} from './settings.types.js'

const prisma = new PrismaClient()

// ── Récupérer les paramètres actuels ──────────────────────
export async function getProfSettings(userId: number): Promise<SettingsResponse> {
  const prof = await prisma.prof.findUniqueOrThrow({
    where: { userId },
    select: {
      nom: true, prenom: true, etablissement: true,
      user: { select: { email: true } }
    }
  })

  return {
    fullName:    `${prof.prenom ?? ''} ${prof.nom ?? ''}`.trim(),
    email:       prof.user.email,
    phone:       null, // ajoute un champ telephone dans Prof si besoin
    institution: prof.etablissement,
    language:    'fr',
    theme:       'light',
    notifications: {
      recommendations: true,
      comments:        true,
      portfolios:      true,
      weekly:          false,
    }
  }
}

// ── Mettre à jour le profil ───────────────────────────────
export async function updateProfProfile(userId: number, data: ProfileUpdate) {
  const parts    = data.fullName.trim().split(' ')
  const prenom   = parts[0] ?? ''
  const nom      = parts.slice(1).join(' ') || prenom

  await prisma.prof.update({
    where: { userId },
    data:  { nom, prenom, etablissement: data.institution }
  })

  await prisma.user.update({
    where: { id: userId },
    data:  { email: data.email }
  })
}

// ── Changer le mot de passe ───────────────────────────────
export async function updatePassword(userId: number, data: PasswordUpdate) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { password: true }
  })

  if (!user.password) throw new Error('Aucun mot de passe défini sur ce compte.')

  const valid = await bcrypt.compare(data.current, user.password)
  if (!valid) throw new Error('Mot de passe actuel incorrect.')

  const hashed = await bcrypt.hash(data.newPassword, 10)
  await prisma.user.update({
    where: { id: userId },
    data:  { password: hashed }
  })
}

// ── Supprimer le compte ───────────────────────────────────
export async function deleteProfAccount(userId: number) {
  const prof = await prisma.prof.findUniqueOrThrow({ where: { userId } })

  // Supprimer les données liées avant de supprimer l'utilisateur
  await prisma.notification.deleteMany({ where: { profId: prof.id } })
  await prisma.commentaire.deleteMany({ where: { authorProfId: prof.id } })
  await prisma.recommendation.deleteMany({ where: { authorProfId: prof.id } })
  await prisma.lettreRecommandation.deleteMany({ where: { profId: prof.id } })
  await prisma.prof.delete({ where: { userId } })
  await prisma.user.delete({ where: { id: userId } })
}