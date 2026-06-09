import { prisma } from "../../utils/prisma.js";
import type {
  ChangePasswordInput,
  UpdateProfessionnelInput,
  UpdateProfInput,
  UpdateStudentInput,
} from "./user.validation.js";
import bcrypt from "bcryptjs";

export const UserService = {

  async getFullProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id:        true,
        email:     true,
        role:      true,
        status:    true,
        createdAt: true,
        updatedAt: true,
        // password exclu — ne jamais retourner le hash
        // googleId exclu — donnée interne non nécessaire au frontend
        // emailVerificationToken exclu
        student: {
          include: {
            skills: { include: { skill: true } },
          },
        },
        prof:          true,
        professionnel: true,
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
          skills: { include: { skill: true } },
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
    const user = await prisma.user.findUnique({
      where:  { id: userId },
      // CORRECTION 1 : select explicite — charger uniquement password
      // La version originale chargeait tous les champs dont googleId,
      // emailVerificationToken etc. inutilement en mémoire
      select: { id: true, password: true },
    });

    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    // Utilisateur Google — pas de mot de passe local
    if (!user.password) {
      throw new Error("Utilisez Google pour vous connecter");
    }

    const isValid = await bcrypt.compare(data.currentPassword, user.password);

    if (!isValid) {
      // CORRECTION 2 : message générique — ne pas confirmer que le compte
      // existe ou que c'est le mot de passe qui est faux
      throw new Error("Mot de passe actuel incorrect");
    }

    const hashed = await bcrypt.hash(data.newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data:  { password: hashed },
      }),
      // Invalider toutes les sessions après changement de mot de passe
      // Force la reconnexion sur tous les appareils — sécurité en cas
      // de compromission du mot de passe
      prisma.refreshToken.deleteMany({
        where: { userId },
      }),
    ]);
  },
};