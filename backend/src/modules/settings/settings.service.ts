import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import {
  ProfileUpdate, NotificationsUpdate,
  DisplayUpdate, PasswordUpdate, SettingsResponse
} from './settings.types.js'

const prisma = new PrismaClient()

// ── Récupérer les paramètres actuels ──────────────────────
export async function getSettings(userId: number, role: string): Promise<SettingsResponse> {
  if (role === 'PROF') {
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
      phone:       null,
      institution: prof.etablissement,
      language:    'fr',
      theme:       'light',
      notifications: { recommendations: true, comments: true, portfolios: true, weekly: false }
    }
  } else {
    const student = await prisma.student.findUniqueOrThrow({
      where: { userId },
      select: {
        nom: true, prenom: true, etablissement: true, filiere: true, niveau: true, anneePromotion: true, bio: true, phone: true, city: true, country: true,
        user: { select: { email: true } }
      }
    })
    return {
      fullName:    `${student.prenom ?? ''} ${student.nom ?? ''}`.trim(),
      email:       student.user.email,
      phone:       student.phone,
      institution: student.etablissement,
      filiere:     student.filiere,
      niveau:      student.niveau,
      anneePromotion: student.anneePromotion,
      bio:         student.bio,
      city:        student.city,
      country:     student.country,
      language:    'fr',
      theme:       'light',
      notifications: { recommendations: true, comments: true, portfolios: true, weekly: false }
    }
  }
}

// ── Mettre à jour le profil ───────────────────────────────
export async function updateProfile(userId: number, role: string, data: any) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: { student: true, prof: true }
  })

  if (role === 'PROF') {
    const parts    = (data.fullName || '').trim().split(' ')
    const prenom   = data.firstName || parts[0] || user.prof?.prenom || ''
    const nom      = data.lastName || parts.slice(1).join(' ') || user.prof?.nom || ''
    
    await prisma.prof.update({
      where: { userId },
      data:  { 
        prenom, 
        nom, 
        etablissement: data.institution || data.etablissement || user.prof?.etablissement 
      }
    })
  } else {
    const studentData: any = {}
    
    if (data.fullName) {
      const parts = data.fullName.trim().split(' ')
      studentData.prenom = parts[0]
      studentData.nom = parts.slice(1).join(' ') || parts[0]
    }
    
    if (data.firstName)      studentData.prenom = data.firstName
    if (data.lastName)       studentData.nom = data.lastName
    if (data.etablissement)  studentData.etablissement = data.etablissement
    if (data.filiere)        studentData.filiere = data.filiere
    if (data.niveau)         studentData.niveau = data.niveau
    if (data.anneePromotion) studentData.anneePromotion = String(data.anneePromotion)
    if (data.bio)            studentData.bio = data.bio
    if (data.phone)          studentData.phone = data.phone
    if (data.city)           studentData.city = data.city
    if (data.country)        studentData.country = data.country

    if (user.student) {
      await prisma.student.update({
        where: { userId },
        data: studentData
      })
    }
  }

  // Update email only if it changed and is valid
  if (data.email && data.email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw new Error("Cet email est déjà utilisé par un autre compte.")
    
    await prisma.user.update({
      where: { id: userId },
      data:  { email: data.email }
    })
  }
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
export async function deleteAccount(userId: number, role: string) {
  if (role === 'PROF') {
    const prof = await prisma.prof.findUniqueOrThrow({ where: { userId } })
    await prisma.notification.deleteMany({ where: { profId: prof.id } })
    await prisma.commentaire.deleteMany({ where: { authorProfId: prof.id } })
    await prisma.recommendation.deleteMany({ where: { authorProfId: prof.id } })
    await prisma.lettreRecommandation.deleteMany({ where: { profId: prof.id } })
    await prisma.prof.delete({ where: { userId } })
  } else {
    const student = await prisma.student.findUniqueOrThrow({ where: { userId } })
    // Cascade delete manually for items not handled by prisma cascade
    await prisma.notification.deleteMany({ where: { studentId: student.id } })
    await prisma.studentSkill.deleteMany({ where: { studentId: student.id } })
    await prisma.studentActivite.deleteMany({ where: { studentId: student.id } })
    await prisma.studentFormation.deleteMany({ where: { studentId: student.id } })
    await prisma.recommendation.deleteMany({ where: { Portfolio: { studentId: student.id } } })
    await prisma.commentaire.deleteMany({ where: { Portfolio: { studentId: student.id } } })
    await prisma.portfolio.deleteMany({ where: { studentId: student.id } })
    await prisma.stage.deleteMany({ where: { studentId: student.id } })
    await prisma.student.delete({ where: { userId } })
  }
  await prisma.user.delete({ where: { id: userId } })
}