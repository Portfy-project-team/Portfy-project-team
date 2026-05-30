import type { Role } from "@prisma/client";
import { prisma } from "../../utils/prisma.js";
import type {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectDecisionInput,
} from "./project.validation.js";

class ProjectError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

interface AuthUser {
  id: number;
  role: Role;
}

const getStudentWithPortfolio = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: { portfolio: true },
  });

  if (!student) {
    throw new ProjectError("Profil étudiant introuvable", 404);
  }

  if (student.portfolio) {
    return { student, portfolio: student.portfolio };
  }

  const portfolio = await prisma.portfolio.create({
    data: { studentId: student.id },
  });

  return { student, portfolio };
};

const getProfIdFromUser = async (userId: number) => {
  const prof = await prisma.prof.findUnique({
    where: { userId },
    select: { id: true },
  });
  return prof?.id ?? null;
};

const getProjectWithOwner = async (projectId: number) => {
  const project = await prisma.projet.findUnique({
    where: { id: projectId },
    include: {
      portfolio: {
        include: {
          student: {
            select: {
              id:      true,
              userId:  true,
              nom:     true,
              prenom:  true,
              filiere: true,
            },
          },
        },
      },
      Prof: {
        select: { id: true, nom: true, prenom: true },
      },
      skills: {
        include: { skill: true },
      },
    },
  });

  if (!project) {
    throw new ProjectError("Projet introuvable", 404);
  }

  return project;
};

const ensureStudentOwnsProject = async (
  projectId: number,
  userId: number
) => {
  const project = await getProjectWithOwner(projectId);

  if (project.portfolio.student.userId !== userId) {
    // 404 et non 403 — ne pas confirmer que le projet existe
    // Un 403 révèle à l'attaquant que la ressource existe mais lui est interdite
    // Un 404 ne révèle rien
    throw new ProjectError("Projet introuvable", 404);
  }

  return project;
};

// ── Create ────────────────────────────────────────────────────────
export const createProject = async (
  userId: number,
  data: CreateProjectInput
) => {
  const { portfolio } = await getStudentWithPortfolio(userId);

  return prisma.projet.create({
    data: {
      ...data,
      portfolioId:    portfolio.id,
      statusV:        "PENDING",
      dateSoumission: null,
    },
    // select explicite — ne retourner que ce qui est nécessaire
    select: {
      id:          true,
      titre:       true,
      description: true,
      technologie: true,
      type:        true,
      statusV:     true,
      githubLink:  true,
      youtubeLink: true,
      screenshots: true,
      resultats:   true,
      portfolioId: true,
    },
  });
};

// ── Get my projects ───────────────────────────────────────────────
export const getMyProjects = async (userId: number) => {
  const { portfolio } = await getStudentWithPortfolio(userId);

  return prisma.projet.findMany({
    where: { portfolioId: portfolio.id },
    orderBy: { id: "desc" },
    include: {
      skills: { include: { skill: true } },
      Prof:   { select: { id: true, nom: true, prenom: true } },
    },
  });
};

// ── Get by ID ─────────────────────────────────────────────────────
export const getProjectById = async (
  authUser: AuthUser,
  projectId: number
) => {
  const project = await getProjectWithOwner(projectId);

  // STUDENT ne voit que ses propres projets
  // PROF et ADMIN voient tous les projets
  if (
    authUser.role === "STUDENT" &&
    project.portfolio.student.userId !== authUser.id
  ) {
    // 404 — ne pas confirmer l'existence du projet à un étudiant non propriétaire
    throw new ProjectError("Projet introuvable", 404);
  }

  return project;
};

// ── Update ────────────────────────────────────────────────────────
export const updateProject = async (
  userId: number,
  projectId: number,
  data: UpdateProjectInput
) => {
  const project = await ensureStudentOwnsProject(projectId, userId);

  if (project.statusV === "VALIDATED") {
    throw new ProjectError("Un projet validé ne peut pas être modifié", 400);
  }

  return prisma.projet.update({
    where: { id: projectId },
    data,
  });
};

// ── Delete ────────────────────────────────────────────────────────
export const deleteProject = async (
  authUser: AuthUser,
  projectId: number
) => {
  const project = await getProjectWithOwner(projectId);

  // STUDENT : ownership obligatoire
  // ADMIN : peut supprimer n'importe quel projet
  if (
    authUser.role === "STUDENT" &&
    project.portfolio.student.userId !== authUser.id
  ) {
    throw new ProjectError("Projet introuvable", 404);
  }

  if (project.statusV === "VALIDATED" && authUser.role !== "ADMIN") {
    throw new ProjectError(
      "Un projet validé ne peut pas être supprimé",
      400
    );
  }

  await prisma.$transaction([
    prisma.projetSkill.deleteMany({   where: { projetId: projectId } }),
    prisma.projetBadge.deleteMany({   where: { projetId: projectId } }),
    prisma.commentaire.deleteMany({   where: { projetId: projectId } }),
    prisma.projet.delete({            where: { id: projectId } }),
  ]);
};

// ── Submit ────────────────────────────────────────────────────────
export const submitProject = async (userId: number, projectId: number) => {
  const project = await ensureStudentOwnsProject(projectId, userId);

  if (project.statusV === "VALIDATED") {
    throw new ProjectError("Un projet validé ne peut pas être resoumis", 400);
  }

  return prisma.projet.update({
    where: { id: projectId },
    data: {
      statusV:        "PENDING",
      dateSoumission: new Date(),
      noteProf:       null,
      score:          null,
      profId:         null,
    },
  });
};

// ── Get pending ───────────────────────────────────────────────────
export const getPendingProjects = async () => {
  return prisma.projet.findMany({
    where: {
      statusV:        "PENDING",
      dateSoumission: { not: null },
    },
    orderBy: { dateSoumission: "desc" },
    include: {
      portfolio: {
        include: {
          student: {
            select: {
              id:      true,
              nom:     true,
              prenom:  true,
              filiere: true,
              user: {
                select: { email: true },
              },
            },
          },
        },
      },
    },
  });
};

// ── Validate ──────────────────────────────────────────────────────
export const validateProject = async (
  authUser: AuthUser,
  projectId: number,
  data: ProjectDecisionInput
) => {
  const project = await getProjectWithOwner(projectId);

  if (project.statusV !== "PENDING" || !project.dateSoumission) {
    throw new ProjectError(
      "Ce projet n'est pas en attente de validation",
      400
    );
  }

  const profId =
    authUser.role === "PROF"
      ? await getProfIdFromUser(authUser.id)
      : null;

  return prisma.projet.update({
    where: { id: projectId },
    data: {
      statusV:  "VALIDATED",
      noteProf: data.noteProf,
      score:    data.score,
      profId,
    },
  });
};

// ── Reject ────────────────────────────────────────────────────────
export const rejectProject = async (
  authUser: AuthUser,
  projectId: number,
  data: ProjectDecisionInput
) => {
  const project = await getProjectWithOwner(projectId);

  if (project.statusV !== "PENDING" || !project.dateSoumission) {
    throw new ProjectError(
      "Ce projet n'est pas en attente de validation",
      400
    );
  }

  const profId =
    authUser.role === "PROF"
      ? await getProfIdFromUser(authUser.id)
      : null;

  return prisma.projet.update({
    where: { id: projectId },
    data: {
      statusV:  "REJECTED",
      noteProf: data.noteProf,
      score:    data.score,
      profId,
    },
  });
};