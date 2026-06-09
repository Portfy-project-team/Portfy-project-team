import { prisma } from "../../utils/prisma.js";
import {
  ChangePasswordInput,
  UpdateProfessionnelInput,
  UpdateProfInput,
  UpdateStudentInput,
} from "./user.validation.js";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

export const UserService = {

  async getFullProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id:        true,
        email:     true,
        role:      true,
        status:    true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        student: {
          select: {
            id:            true,
            nom:           true,
            prenom:        true,
            avatarUrl:  true,
            filiere:       true,
            bio:           true,
            formationType: true,
            niveau:        true,
            anneeEntree:   true,
            diplomePrevu:  true,
            disponibilite: true,
            linkedin:      true,
            etablissement: true,
            skillsTexte:   true,
            dateC:         true,
            skills: {
              include: { skill: true },
            },
          },
        },
        prof: {
          select: {
            id:           true,
            nom:          true,
            prenom:       true,
            avatarUrl:  true,
            departement:  true,
            specialite:   true,
            bio:          true,
            linkedin:     true,
            etablissement:true,
          },
        },
        professionnel: {
          select: {
            id:                    true,
            nom:                   true,
            prenom:                true,
            avatarUrl:  true,
            entreprise:            true,
            poste:                 true,
            secteur:               true,
            localisation:          true,
            descriptionEntreprise: true,
            siteEntreprise:        true,
            statusV:               true,
          },
        },
      },
    });
  },

  async upsertStudentProfile(userId: number, data: UpdateStudentInput) {
    const { skills, ...studentData } = data;

    return prisma.$transaction(async (tx) => {
      const student = await tx.student.upsert({
        where:  { userId },
        create: { userId, ...studentData },
        update: studentData,
      });

      if (skills) {
        await tx.studentSkill.deleteMany({
          where: { studentId: student.id },
        });

        if (skills.length > 0) {
          await tx.studentSkill.createMany({
            data: skills.map((skill) => ({
              studentId: student.id,
              skillId:   skill.skillId,
              niveau:    skill.niveau ?? "DEBUTANT",
            })),
          });
        }
      }

      return tx.student.findUnique({
        where:   { id: student.id },
        include: {
          skills: {
            include: { skill: true },
          },
        },
      });
    });
  },

  async upsertProfessorProfile(userId: number, data: UpdateProfInput) {
    return prisma.prof.upsert({
      where:  { userId },
      create: { userId, ...data },
      update: data,
    });
  },

  async upsertCompanyProfile(userId: number, data: UpdateProfessionnelInput) {
    return prisma.professionnel.upsert({
      where:  { userId },
      create: { userId, ...data },
      update: data,
    });
  },

  async changePassword(userId: number, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("user not found");
    if (!user.password) throw new Error("Utilisez Google pour vous connecter");

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) throw new Error("current password is incorrect");

    const hashed = await bcrypt.hash(data.newPassword, 12);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data:  { password: hashed },
      }),
      prisma.refreshToken.deleteMany({
        where: { userId },
      }),
    ]);
  },

  // ==========================================
  //  FONCTION UPLOAD AVATAR
  // ==========================================

  /**
   * Upload et mise à jour de la photo de profil (avatar)
   * @param userId - ID de l'utilisateur connecté
   * @param filePath - Chemin du fichier uploadé par Multer
   * @returns L'URL du nouvel avatar
   */
  async uploadAvatar(userId: number, filePath: string) {
    // 1. Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Utilisateur introuvable");

    // 2. Supprimer l'ancien avatar si il existe (Correction du chemin)
    const oldAvatar = user.avatarUrl;
    if (oldAvatar) {
      // Nettoyer l'URL au cas où elle contiendrait le BACKEND_URL des tests précédents
      let cleanOldPath = oldAvatar;
      if (process.env.BACKEND_URL && oldAvatar.startsWith(process.env.BACKEND_URL)) {
        cleanOldPath = oldAvatar.replace(process.env.BACKEND_URL, '');
      }
      
      // Retirer le slash initial pour que path.join fonctionne correctement (évite de cibler la racine du disque)
      cleanOldPath = cleanOldPath.startsWith('/') ? cleanOldPath.slice(1) : cleanOldPath;
      
      const oldPath = path.join(process.cwd(), cleanOldPath);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // 3. Normaliser le chemin pour la base de données (Chemin relatif EXCLUSIVEMENT)
    const avatarUrl = `/uploads/avatars/${path.basename(filePath)}`;

    // 4. Mettre à jour l'avatar dans la table User
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    // 5. Mettre à jour l'avatar dans le profil spécialisé selon le rôle
    const updateData = { avatarUrl };

    switch (user.role) {
      case "STUDENT":
        await prisma.student.upsert({
          where: { userId },
          create: { userId, ...updateData },
          update: updateData,
        });
        break;
      case "PROF":
        await prisma.prof.upsert({
          where: { userId },
          create: { userId, ...updateData },
          update: updateData,
        });
        break;
      case "PRO":
        await prisma.professionnel.upsert({
          where: { userId },
          create: { userId, ...updateData },
          update: updateData,
        });
        break;
    }

    // 6. Retourner l'URL de l'avatar 
    // On renvoie l'URL relative (pour l'affichage local) et l'URL complète (si le front-end en a besoin)
    return { 
      avatarUrl: avatarUrl,
      fullUrl: `${process.env.BACKEND_URL || ''}${avatarUrl}` 
    };
  },
};