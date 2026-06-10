// CORRECTION : utiliser l'instance Prisma partagée
// La version originale crée une nouvelle instance PrismaClient à chaque import
// ce qui ouvre une nouvelle connexion à la BDD — fuite de connexions possible
// L'instance partagée dans utils/prisma.ts est un singleton qui réutilise la même connexion
import { prisma } from "../../utils/prisma.js";

export const fetchAuthenticatedStudentProfile = async (userId: number) => {
  const profile = await prisma.student.findUnique({
    where: { userId },
    include: {
      user: {
        select: { avatarUrl: true },
      },
      portfolio: {
        include: {
          projets: {
            where:   { statusV: "VALIDATED" },
            orderBy: { dateSoumission: "desc" },
            include: { skills: { include: { skill: true } } },
          },
        },
      },
      Stage: {
        where:   { statutV: "VALIDATED" },
        orderBy: { dateDebut: "desc" },
      },
      skills: {
        include: { skill: true },
      },
      StudentFormation: {
        include: { Formation: true },
        orderBy: { formationId: "desc" },
      },
    },
  });

  if (!profile) throw new Error("PROFILE_NOT_FOUND");

  return {
    ...profile,
    avatarUrl: profile.avatarUrl || profile.user?.avatarUrl || null,
  };
};