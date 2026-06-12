import { prisma } from '../../utils/prisma.js'
import bcrypt from 'bcryptjs'
import {
  PasswordUpdate, SettingsResponse
} from './settings.types.js'

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
    const student = await prisma.student.findUnique({
      where: { userId },
      select: {
        nom: true, prenom: true, etablissement: true, filiere: true, niveau: true, anneePromotion: true, bio: true,
        phone: true, city: true, country: true,
        user: { select: { email: true } }
      }
    })

    if (!student) throw new Error("Étudiant non trouvé")

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

  const updateData: any = {}

  // 1. Gestion de l'email
  if (data.email && data.email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing && existing.id !== userId) {
      throw new Error("Cet email est déjà utilisé par un autre compte.")
    }
    updateData.email = data.email
  }

  // 2. Gestion des données spécifiques au rôle
  if (role === 'PROF') {
    const profData: any = {}
    const parts = (data.fullName || '').trim().split(' ')
    
    if (data.firstName !== undefined) profData.prenom = data.firstName
    else if (data.fullName) profData.prenom = parts[0]
    
    if (data.lastName !== undefined) profData.nom = data.lastName
    else if (data.fullName && parts.length > 1) profData.nom = parts.slice(1).join(' ')

    if (data.institution !== undefined || data.etablissement !== undefined) {
      profData.etablissement = data.institution || data.etablissement
    }

    if (Object.keys(profData).length > 0) {
      updateData.prof = { update: profData }
    }
  } else {
    const studentData: any = {}
    const parts = (data.fullName || '').trim().split(' ')
    
    if (data.firstName !== undefined) studentData.prenom = data.firstName
    else if (data.fullName) studentData.prenom = parts[0]
    
    if (data.lastName !== undefined) studentData.nom = data.lastName
    else if (data.fullName && parts.length > 1) studentData.nom = parts.slice(1).join(' ')

    if (data.etablissement !== undefined) studentData.etablissement = data.etablissement
    if (data.filiere !== undefined) studentData.filiere = data.filiere
    if (data.niveau !== undefined) studentData.niveau = data.niveau
    if (data.anneePromotion !== undefined) studentData.anneePromotion = data.anneePromotion ? String(data.anneePromotion) : null
    if (data.bio !== undefined) studentData.bio = data.bio
    if (data.phone !== undefined) studentData.phone = data.phone
    if (data.city !== undefined) studentData.city = data.city
    if (data.country !== undefined) studentData.country = data.country

    if (Object.keys(studentData).length > 0) {
      if (user.student) {
        updateData.student = { update: studentData }
      } else {
        // Au cas où le profil étudiant n'existe pas, on le crée avec les données reçues
        // On s'assure d'avoir au moins les champs requis par le schéma si nécessaire
        updateData.student = { 
          create: {
            nom: studentData.nom || '',
            prenom: studentData.prenom || '',
            ...studentData
          }
        }
      }
    }
  }

  // 3. Exécution de la mise à jour
  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({
      where: { id: userId },
      data: updateData
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