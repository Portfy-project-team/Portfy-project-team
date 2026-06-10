import type { Role } from "@prisma/client";
import { prisma } from "../../utils/prisma.js";
import type { CreateRecommendationInput } from "./recommendation.validation.js";

class RecoError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

interface AuthUser { id: number; role: Role; }

const getAuthorIds = async (userId: number, role: Role) => {
  if (role === "STUDENT") {
    const s = await prisma.student.findUnique({ where: { userId }, select: { id: true } });
    return { authorStudentId: s?.id ?? null, authorProfId: null, authorProId: null };
  }
  if (role === "PROF") {
    const p = await prisma.prof.findUnique({ where: { userId }, select: { id: true } });
    return { authorStudentId: null, authorProfId: p?.id ?? null, authorProId: null };
  }
  if (role === "PRO") {
    const pro = await prisma.professionnel.findUnique({ where: { userId }, select: { id: true } });
    return { authorStudentId: null, authorProfId: null, authorProId: pro?.id ?? null };
  }
  throw new RecoError("Rôle non autorisé à recommander", 403);
};

export const createRecommendation = async (authUser: AuthUser, data: CreateRecommendationInput) => {
  const portfolio = await prisma.portfolio.findUnique({
    where:  { id: data.portfolioId },
    select: { id: true },
  });

  if (!portfolio) throw new RecoError("Portfolio introuvable", 404);

  const authorIds = await getAuthorIds(authUser.id, authUser.role);

  return prisma.recommendation.create({
    data: {
      portfolioId: data.portfolioId,
      message:     data.message,
      statut:      "PENDING",
      ...authorIds,
    },
  });
};

export const getPendingRecommendationsForMe = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where:  { userId },
    select: { id: true, portfolio: { select: { id: true } } },
  });

  if (!student?.portfolio) throw new RecoError("Portfolio introuvable", 404);

  return prisma.recommendation.findMany({
    where:   { portfolioId: student.portfolio.id, statut: "PENDING" },
    orderBy: { date: "desc" },
  });
};




export const acceptRecommendation = async (userId: number, recoId: number) => {
  const reco = await prisma.recommendation.findUnique({ where: { id: recoId } });
  if (!reco) throw new RecoError("Recommandation introuvable", 404);

  // Chercher le portfolio de l'utilisateur qui fait la requête
  const student = await prisma.student.findUnique({
    where:  { userId },
    select: { id: true, portfolio: { select: { id: true } } },
  });

  // Si l'utilisateur n'a pas de portfolio OU que ce n'est pas le sien → 403
  if (!student?.portfolio || reco.portfolioId !== student.portfolio.id) {
    throw new RecoError("Accès refusé", 403);
  }

  if (reco.statut !== "PENDING") throw new RecoError("Cette recommandation n'est pas en attente", 400);

  return prisma.recommendation.update({ where: { id: recoId }, data: { statut: "VALIDATED" } });
};

export const rejectRecommendation = async (userId: number, recoId: number) => {
  const reco = await prisma.recommendation.findUnique({ where: { id: recoId } });
  if (!reco) throw new RecoError("Recommandation introuvable", 404);

  const student = await prisma.student.findUnique({
    where:  { userId },
    select: { id: true, portfolio: { select: { id: true } } },
  });

  if (!student?.portfolio || reco.portfolioId !== student.portfolio.id) {
    throw new RecoError("Accès refusé", 403);
  }

  if (reco.statut !== "PENDING") throw new RecoError("Cette recommandation n'est pas en attente", 400);

  return prisma.recommendation.update({ where: { id: recoId }, data: { statut: "REJECTED" } });
};

// export const acceptRecommendation = async (userId: number, recoId: number) => {
//   const student = await prisma.student.findUnique({
//     where:  { userId },
//     select: { id: true, portfolio: { select: { id: true } } },
//   });

//   if (!student?.portfolio) throw new RecoError("Portfolio introuvable", 404);

//   const reco = await prisma.recommendation.findUnique({ where: { id: recoId } });
//   if (!reco) throw new RecoError("Recommandation introuvable", 404);

//   if (reco.portfolioId !== student.portfolio.id) throw new RecoError("Accès refusé", 403);
//   if (reco.statut !== "PENDING") throw new RecoError("Cette recommandation n'est pas en attente", 400);

//   return prisma.recommendation.update({ where: { id: recoId }, data: { statut: "VALIDATED" } });
// };

// export const rejectRecommendation = async (userId: number, recoId: number) => {
//   const student = await prisma.student.findUnique({
//     where:  { userId },
//     select: { id: true, portfolio: { select: { id: true } } },
//   });

//   if (!student?.portfolio) throw new RecoError("Portfolio introuvable", 404);

//   const reco = await prisma.recommendation.findUnique({ where: { id: recoId } });
//   if (!reco) throw new RecoError("Recommandation introuvable", 404);

//   if (reco.portfolioId !== student.portfolio.id) throw new RecoError("Accès refusé", 403);
//   if (reco.statut !== "PENDING") throw new RecoError("Cette recommandation n'est pas en attente", 400);

//   return prisma.recommendation.update({ where: { id: recoId }, data: { statut: "REJECTED" } });
// };