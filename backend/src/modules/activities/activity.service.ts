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
  id: number;
  role: Role;
}

const getStudentByUserId = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!student) {
    throw new ActivityError("Profil étudiant introuvable", 404);
  }

  return student;
};

const getAdminByUserId = async (userId: number) => {
  const admin = await prisma.admin.findUnique({
    where: { userId },
    select: { id: true },
  });

  return admin;
};

const ensureStudentOwnsActivity = async (
  userId: number,
  activityId: number
) => {
  const student = await getStudentByUserId(userId);

  const link = await prisma.studentActivite.findUnique({
    where: {
      studentId_activiteId: {
        studentId: student.id,
        activiteId: activityId,
      },
    },
    include: {
      ActiviteParascolaire: true,
    },
  });

  if (!link) {
    throw new ActivityError("Activité introuvable ou accès refusé", 403);
  }

  return link.ActiviteParascolaire;
};

export const createActivity = async (
  userId: number,
  data: CreateActivityInput
) => {
  const student = await getStudentByUserId(userId);

  return prisma.activiteParascolaire.create({
    data: {
      nom: data.nom,
      description: data.description,
      type: data.type,
      attestationUrl: data.attestationUrl,
      statutV: "PENDING",
      StudentActivite: {
        create: {
          studentId: student.id,
        },
      },
    },
    include: {
      StudentActivite: {
        include: {
          Student: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              filiere: true,
            },
          },
        },
      },
    },
  });
};

export const getMyActivities = async (userId: number) => {
  const student = await getStudentByUserId(userId);

  return prisma.activiteParascolaire.findMany({
    where: {
      StudentActivite: {
        some: {
          studentId: student.id,
        },
      },
    },
    orderBy: { id: "desc" },
    include: {
      Admin: {
        select: {
          id: true,
          nom: true,
          prenom: true,
        },
      },
    },
  });
};

export const updateActivity = async (
  userId: number,
  activityId: number,
  data: UpdateActivityInput
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

export const getPendingActivities = async () => {
  return prisma.activiteParascolaire.findMany({
    where: {
      statutV: "PENDING",
    },
    orderBy: { id: "desc" },
    include: {
      StudentActivite: {
        include: {
          Student: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              filiere: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const validateActivity = async (
  authUser: AuthUser,
  activityId: number
) => {
  const activity = await prisma.activiteParascolaire.findUnique({
    where: { id: activityId },
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
  });
};

export const rejectActivity = async (
  authUser: AuthUser,
  activityId: number
) => {
  const activity = await prisma.activiteParascolaire.findUnique({
    where: { id: activityId },
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
  });
};