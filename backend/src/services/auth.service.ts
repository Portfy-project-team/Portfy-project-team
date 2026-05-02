import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../utils/prisma.js'
import { Role } from '@prisma/client'

const AuthService = {

  inscription: async ({ nom, prenom, email, password, role, filiere }: any) => {

    const existant = await prisma.user.findUnique({ where: { email } })
    if (existant) {
      const err: any = new Error('Cet email est déjà utilisé')
      err.status = 409
      throw err
    }

    const rolesValides = ['STUDENT', 'PROF', 'PRO']
    if (!rolesValides.includes(role)) {
      const err: any = new Error('Rôle non autorisé')
      err.status = 403
      throw err
    }

    const passwordHashe = await bcrypt.hash(password, 12)

    // Créer le User de base
    const user = await prisma.user.create({
      data: {
        email,
        password: passwordHashe,
        role: role as Role
      }
    })

    // Créer le profil selon le rôle
    if (role === 'STUDENT') {
      await prisma.student.create({
        data: { userId: user.id, nom, prenom, filiere }
      })
    } else if (role === 'PROF') {
      await prisma.prof.create({
        data: { userId: user.id, nom, prenom }
      })
    } else if (role === 'PRO') {
      await prisma.professionnel.create({
        data: { userId: user.id, nom, prenom }
      })
    }

    return { id: user.id, email: user.email, role: user.role }
  },

  connexion: async (email: string, password: string) => {

    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true, prof: true, professionnel: true }
    })

    if (!user) {
      const err: any = new Error('Email ou mot de passe incorrect')
      err.status = 401
      throw err
    }

    const valide = await bcrypt.compare(password, user.password)
    if (!valide) {
      const err: any = new Error('Email ou mot de passe incorrect')
      err.status = 401
      throw err
    }

    if (user.role === 'PRO' && user.professionnel?.statusV === 'PENDING') {
      const err: any = new Error('Compte en attente de validation')
      err.status = 403
      throw err
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as any }
    )

    const { password: _, ...userSansPassword } = user
    return { token, utilisateur: userSansPassword }
  },

  getProfil: async (userId: number) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { student: true, prof: true, professionnel: true },
    })
    if (!user) {
      const err: any = new Error('Utilisateur non trouvé')
      err.status = 404
      throw err
    }
    const { password: _, ...userSansPassword } = user
    return userSansPassword
  },

  updateProfil: async (userId: number, data: any) => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      const err: any = new Error('Utilisateur non trouvé')
      err.status = 404
      throw err
    }

    if (user.role === 'STUDENT') {
      return await prisma.student.update({
        where: { userId },
        data: { nom: data.nom, prenom: data.prenom, filiere: data.filiere }
      })
    } else if (user.role === 'PROF') {
      return await prisma.prof.update({
        where: { userId },
        data: { nom: data.nom, prenom: data.prenom, specialite: data.specialite }
      })
    } else if (user.role === 'PRO') {
      return await prisma.professionnel.update({
        where: { userId },
        data: { nom: data.nom, prenom: data.prenom, entreprise: data.entreprise }
      })
    }
  }
}

export default AuthService