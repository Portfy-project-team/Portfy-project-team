import type { Role } from "@prisma/client";
import { prisma } from "../../utils/prisma.js";
import type { CreateCommentInput } from "./comment.validation.js";

class CommentError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

interface AuthUser { id: number; role: Role; }

// Récupérer l'id du profil selon le rôle
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
  throw new CommentError("Rôle non autorisé à commenter", 403);
};

export const createComment = async (authUser: AuthUser, data: CreateCommentInput) => {
  const portfolio = await prisma.portfolio.findUnique({
    where:  { id: data.portfolioId },
    select: { id: true, studentId: true },
  });

  if (!portfolio) throw new CommentError("Portfolio introuvable", 404);

  const authorIds = await getAuthorIds(authUser.id, authUser.role);

  return prisma.commentaire.create({
    data: {
      portfolioId: data.portfolioId,
      projetId:    data.projetId ?? null,
      contenu:     data.contenu,
      statut:      "PENDING",
      ...authorIds,
    },
  });
};

// Commentaires en attente destinés à MON portfolio
export const getPendingCommentsForMe = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where:  { userId },
    select: { id: true, portfolio: { select: { id: true } } },
  });

  if (!student?.portfolio) throw new CommentError("Portfolio introuvable", 404);

  return prisma.commentaire.findMany({
    where:   { portfolioId: student.portfolio.id, statut: "PENDING" },
    orderBy: { dateC: "desc" },
  });
};

// export const acceptComment = async (userId: number, commentId: number) => {
//   const student = await prisma.student.findUnique({
//     where:  { userId },
//     select: { id: true, portfolio: { select: { id: true } } },
//   });

//   if (!student?.portfolio) throw new CommentError("Portfolio introuvable", 404);

//   const comment = await prisma.commentaire.findUnique({ where: { id: commentId } });
//   if (!comment) throw new CommentError("Commentaire introuvable", 404);

//   if (comment.portfolioId !== student.portfolio.id)
//     throw new CommentError("Accès refusé", 403);

//   if (comment.statut !== "PENDING")
//     throw new CommentError("Ce commentaire n'est pas en attente", 400);

//   return prisma.commentaire.update({
//     where: { id: commentId },
//     data:  { statut: "VALIDATED" },
//   });
// };

// export const rejectComment = async (userId: number, commentId: number) => {
//   const student = await prisma.student.findUnique({
//     where:  { userId },
//     select: { id: true, portfolio: { select: { id: true } } },
//   });

//   if (!student?.portfolio) throw new CommentError("Portfolio introuvable", 404);

//   const comment = await prisma.commentaire.findUnique({ where: { id: commentId } });
//   if (!comment) throw new CommentError("Commentaire introuvable", 404);

//   if (comment.portfolioId !== student.portfolio.id)
//     throw new CommentError("Accès refusé", 403);

//   if (comment.statut !== "PENDING")
//     throw new CommentError("Ce commentaire n'est pas en attente", 400);

//   return prisma.commentaire.update({
//     where: { id: commentId },
//     data:  { statut: "REJECTED" },
//   });
// };
export const acceptComment = async (userId: number, commentId: number) => {
  const comment = await prisma.commentaire.findUnique({ where: { id: commentId } });
  if (!comment) throw new CommentError("Commentaire introuvable", 404);

  const student = await prisma.student.findUnique({
    where:  { userId },
    select: { id: true, portfolio: { select: { id: true } } },
  });

  // Si pas de portfolio OU pas le bon → 403
  if (!student?.portfolio || comment.portfolioId !== student.portfolio.id) {
    throw new CommentError("Accès refusé", 403);
  }

  if (comment.statut !== "PENDING") throw new CommentError("Ce commentaire n'est pas en attente", 400);

  return prisma.commentaire.update({ where: { id: commentId }, data: { statut: "VALIDATED" } });
};

export const rejectComment = async (userId: number, commentId: number) => {
  const comment = await prisma.commentaire.findUnique({ where: { id: commentId } });
  if (!comment) throw new CommentError("Commentaire introuvable", 404);

  const student = await prisma.student.findUnique({
    where:  { userId },
    select: { id: true, portfolio: { select: { id: true } } },
  });

  if (!student?.portfolio || comment.portfolioId !== student.portfolio.id) {
    throw new CommentError("Accès refusé", 403);
  }

  if (comment.statut !== "PENDING") throw new CommentError("Ce commentaire n'est pas en attente", 400);

  return prisma.commentaire.update({ where: { id: commentId }, data: { statut: "REJECTED" } });
};