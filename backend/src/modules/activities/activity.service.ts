import type { Role } from "@prisma/client";
import { prisma } from "../../utils/prisma.js";
import type {
  CreateActivityInput,
  UpdateActivityInput,
} from "./activity.validation.js";

class ActivityError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

interface AuthUser {
  id:   number;
  role: Role;
}

const getStudentByUserId = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where:  { userId },
    select: { id: true },
  });

  if (!student) {
    throw new ActivityError("Profil étudiant introuvable", 404);
  }

  return student;
};

const getAdminByUserId = async (userId: number) => {
  const admin = await prisma.admin.findUnique({
    where:  { userId },
    select: { id: true },
  });

  return admin;
};

const ensureStudentOwnsActivity = async (
  userId:     number,
  activityId: number
) => {
  const student = await getStudentByUserId(userId);

  const link = await prisma.studentActivite.findUnique({
    where: {
      studentId_activiteId: {
        studentId:  student.id,
        activiteId: activityId,
      },
    },
    include: {
      ActiviteParascolaire: true,
    },
  });

  if (!link) {
    // CORRECTION 1 : 404 au lieu de 403
    // Un 403 confirme que l'activité existe mais est interdite
    // Un 404 ne révèle rien — anti-énumération des IDs d'activités
    throw new ActivityError("Activité introuvable", 404);
  }

  return link.ActiviteParascolaire;
};

// ── Create ────────────────────────────────────────────────────────
export const createActivity = async (
  userId: number,
  data:   CreateActivityInput
) => {
  const student = await getStudentByUserId(userId);

  return prisma.activiteParascolaire.create({
    data: {
      nom:            data.nom,
      description:    data.description,
      type:           data.type,
      attestationUrl: data.attestationUrl,
      statutV:        "PENDING",
      StudentActivite: {
        create: { studentId: student.id },
      },
    },
    // CORRECTION 2 : select explicite au lieu de include sans filtre
    // include retournait tous les champs de StudentActivite et Student
    // select limite exactement ce qui est retourné au client
    select: {
      id:             true,
      nom:            true,
      description:    true,
      type:           true,
      attestationUrl: true,
      statutV:        true,
      StudentActivite: {
        select: {
          Student: {
            select: {
              id:      true,
              nom:     true,
              prenom:  true,
              filiere: true,
            },
          },
        },
      },
    },
  });
};

// ── Get my activities ─────────────────────────────────────────────
export const getMyActivities = async (userId: number) => {
  const student = await getStudentByUserId(userId);

  return prisma.activiteParascolaire.findMany({
    where: {
      StudentActivite: {
        some: { studentId: student.id },
      },
    },
    orderBy: { id: "desc" },
    select: {
      id:             true,
      nom:            true,
      description:    true,
      type:           true,
      attestationUrl: true,
      statutV:        true,
      Admin: {
        select: {
          id:     true,
          nom:    true,
          prenom: true,
        },
      },
    },
  });
};

// ── Update ────────────────────────────────────────────────────────
export const updateActivity = async (
  userId:     number,
  activityId: number,
  data:       UpdateActivityInput
) => {
  const activity = await ensureStudentOwnsActivity(userId, activityId);

  if (activity.statutV === "VALIDATED") {
    throw new ActivityError(
      "Une activité validée ne peut pas être modifiée",
      400
    );
  }

  return prisma.activiteParascolaire.update({
    where: { id: activityId },
    data: {
      ...data,
      statutV: "PENDING",
      adminId: null,
    },
  });
};

// ── Delete ────────────────────────────────────────────────────────
export const deleteActivity = async (userId: number, activityId: number) => {
  const activity = await ensureStudentOwnsActivity(userId, activityId);

  if (activity.statutV === "VALIDATED") {
    throw new ActivityError(
      "Une activité validée ne peut pas être supprimée",
      400
    );
  }

  await prisma.$transaction([
    prisma.studentActivite.deleteMany({
      where: { activiteId: activityId },
    }),
    prisma.activiteParascolaire.delete({
      where: { id: activityId },
    }),
  ]);
};

// ── Get pending ───────────────────────────────────────────────────
export const getPendingActivities = async () => {
  return prisma.activiteParascolaire.findMany({
    where:   { statutV: "PENDING" },
    orderBy: { id: "desc" },
    select: {
      id:             true,
      nom:            true,
      description:    true,
      type:           true,
      attestationUrl: true,
      statutV:        true,
      StudentActivite: {
        select: {
          Student: {
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
export const validateActivity = async (
  authUser:   AuthUser,
  activityId: number
) => {
  const activity = await prisma.activiteParascolaire.findUnique({
    where:  { id: activityId },
    select: { id: true, statutV: true },
  });

  if (!activity) {
    throw new ActivityError("Activité introuvable", 404);
  }

  if (activity.statutV !== "PENDING") {
    throw new ActivityError("Cette activité n'est pas en attente", 400);
  }

  const admin = await getAdminByUserId(authUser.id);

  return prisma.activiteParascolaire.update({
    where: { id: activityId },
    data: {
      statutV: "VALIDATED",
      adminId: admin?.id ?? null,
    },
    select: {
      id:      true,
      nom:     true,
      statutV: true,
      adminId: true,
    },
  });
};

// ── Reject ────────────────────────────────────────────────────────
export const rejectActivity = async (
  authUser:   AuthUser,
  activityId: number
) => {
  const activity = await prisma.activiteParascolaire.findUnique({
    where:  { id: activityId },
    select: { id: true, statutV: true },
  });

  if (!activity) {
    throw new ActivityError("Activité introuvable", 404);
  }

  if (activity.statutV !== "PENDING") {
    throw new ActivityError("Cette activité n'est pas en attente", 400);
  }

  const admin = await getAdminByUserId(authUser.id);

  return prisma.activiteParascolaire.update({
    where: { id: activityId },
    data: {
      statutV: "REJECTED",
      adminId: admin?.id ?? null,
    },
    select: {
      id:      true,
      nom:     true,
      statutV: true,
      adminId: true,
    },
  });
};