import { prisma } from "../../utils/prisma.js";
import type {
  ChangePasswordInput,
  UpdateProfessionnelInput,
  UpdateProfInput,
  UpdateStudentInput,
} from "./user.validation.js";
import bcrypt from "bcryptjs";
import fs     from "fs";
import path   from "path";

export const UserService = {

  async getFullProfile(userId: number) {
    return prisma.user.findUnique({
      where:  { id: userId },
      select: {
        id:        true,
        email:     true,
        role:      true,
        status:    true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        // password, googleId, emailVerificationToken exclus
        student: {
          select: {
            id:            true,
            nom:           true,
            prenom:        true,
            avatarUrl:     true,
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
            skills: { include: { skill: true } },
          },
        },
        prof: {
          select: {
            id:            true,
            nom:           true,
            prenom:        true,
            avatarUrl:     true,
            departement:   true,
            specialite:    true,
            bio:           true,
            linkedin:      true,
            etablissement: true,
          },
        },
        professionnel: {
          select: {
            id:                    true,
            nom:                   true,
            prenom:                true,
            avatarUrl:             true,
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
        await tx.studentSkill.deleteMany({ where: { studentId: student.id } });
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
        include: { skills: { include: { skill: true } } },
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

  // CORRECTION 1 : select explicite sur findUnique
  // La version originale chargeait tous les champs de l'utilisateur
  // dont googleId, emailVerificationToken, etc. inutilement en mémoire
  async changePassword(userId: number, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { id: true, password: true },
    });

    if (!user) throw new Error("Utilisateur introuvable");
    if (!user.password) throw new Error("Utilisez Google pour vous connecter");

    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) throw new Error("Mot de passe actuel incorrect");

    const hashed = await bcrypt.hash(data.newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data:  { password: hashed },
      }),
      prisma.refreshToken.deleteMany({ where: { userId } }),
    ]);
  },

  async uploadAvatar(userId: number, filePath: string) {
    const user = await prisma.user.findUnique({
      where:  { id: userId },
      // CORRECTION 2 : select explicite — charger uniquement ce dont on a besoin
      select: { id: true, role: true, avatarUrl: true },
    });

    if (!user) throw new Error("Utilisateur introuvable");

    // Supprimer l'ancien avatar
    const oldAvatar = user.avatarUrl;
    if (oldAvatar) {
      let cleanOldPath = oldAvatar;
      if (process.env.BACKEND_URL && oldAvatar.startsWith(process.env.BACKEND_URL)) {
        cleanOldPath = oldAvatar.replace(process.env.BACKEND_URL, "");
      }
      cleanOldPath = cleanOldPath.startsWith("/")
        ? cleanOldPath.slice(1)
        : cleanOldPath;

      // CORRECTION 3 : protection path traversal sur la suppression de l'ancien avatar
      // Sans cette vérification, un avatarUrl malformé en BDD pourrait
      // permettre de supprimer des fichiers arbitraires du serveur
      if (!cleanOldPath.includes("..")) {
        const oldPath = path.join(process.cwd(), cleanOldPath);
        if (
          oldPath.startsWith(path.join(process.cwd(), "uploads")) &&
          fs.existsSync(oldPath)
        ) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const avatarUrl = `/uploads/avatars/${path.basename(filePath)}`;

    await prisma.user.update({
      where: { id: userId },
      data:  { avatarUrl },
    });

    const updateData = { avatarUrl };

    switch (user.role) {
      case "STUDENT":
        await prisma.student.upsert({
          where:  { userId },
          create: { userId, ...updateData },
          update: updateData,
        });
        break;
      case "PROF":
        await prisma.prof.upsert({
          where:  { userId },
          create: { userId, ...updateData },
          update: updateData,
        });
        break;
      case "PRO":
        await prisma.professionnel.upsert({
          where:  { userId },
          create: { userId, ...updateData },
          update: updateData,
        });
        break;
    }

    // Retourner uniquement l'URL relative — pas de fullUrl avec BACKEND_URL
    // Le frontend construit l'URL complète avec sa propre config VITE_API_URL
    return { avatarUrl };
  },
};