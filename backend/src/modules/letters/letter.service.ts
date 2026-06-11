import type { Role } from "@prisma/client";
import { prisma } from "../../utils/prisma.js";
import type {
  CreateLetterInput,
  UpdateLetterVisibilityInput,
} from "./letter.validation.js";

class LetterError extends Error {
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
    throw new LetterError("Profil étudiant introuvable", 404);
  }

  return student;
};

const getProfByUserId = async (userId: number) => {
  const prof = await prisma.prof.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!prof) {
    throw new LetterError("Profil professeur introuvable", 404);
  }

  return prof;
};

export const createLetter = async (
  professorUserId: number,
  data: CreateLetterInput
) => {
  const prof = await getProfByUserId(professorUserId);

  const targetStudent = await prisma.student.findUnique({
    where: { id: data.studentId },
    select: { id: true },
  });

  if (!targetStudent) {
    throw new LetterError("Étudiant cible introuvable", 404);
  }

  return prisma.lettreRecommandation.create({
    data: {
      type: data.type,
      contenu: data.contenu,
      profId: prof.id,
      visibilite: "PRIVATE",
      LettreStudent: {
        create: {
          studentId: targetStudent.id,
        },
      },
    },
    include: {
      Prof: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          departement: true,
          specialite: true,
        },
      },
      LettreStudent: {
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

export const getMyLetters = async (studentUserId: number) => {
  const student = await getStudentByUserId(studentUserId);

  return prisma.lettreRecommandation.findMany({
    where: {
      LettreStudent: {
        some: {
          studentId: student.id,
        },
      },
    },
    orderBy: { date: "desc" },
    include: {
      Prof: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          departement: true,
          specialite: true,
        },
      },
      LettreStudent: {
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

export const getLettersCreatedByMe = async (professorUserId: number) => {
  const prof = await getProfByUserId(professorUserId);

  return prisma.lettreRecommandation.findMany({
    where: {
      profId: prof.id,
    },
    orderBy: { date: "desc" },
    include: {
      LettreStudent: {
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

export const updateLetterVisibility = async (
  studentUserId: number,
  letterId: number,
  data: UpdateLetterVisibilityInput
) => {
  const student = await getStudentByUserId(studentUserId);

  const ownership = await prisma.lettreStudent.findUnique({
    where: {
      lettreId_studentId: {
        lettreId: letterId,
        studentId: student.id,
      },
    },
    select: {
      lettreId: true,
      studentId: true,
    },
  });

  if (!ownership) {
    throw new LetterError("Accès refusé", 403);
  }

  return prisma.lettreRecommandation.update({
    where: { id: letterId },
    data: {
      visibilite: data.visibilite,
    },
    include: {
      Prof: {
        select: {
          id: true,
          nom: true,
          prenom: true,
        },
      },
      LettreStudent: true,
    },
  });
};

export const deleteLetter = async (authUser: AuthUser, letterId: number) => {
  const letter = await prisma.lettreRecommandation.findUnique({
    where: { id: letterId },
    select: {
      id: true,
      profId: true,
    },
  });

  if (!letter) {
    throw new LetterError("Lettre introuvable", 404);
  }

  if (authUser.role === "PROF") {
    const prof = await getProfByUserId(authUser.id);

    if (letter.profId !== prof.id) {
      throw new LetterError("Accès refusé", 403);
    }
  }

  await prisma.$transaction([
    prisma.lettreStudent.deleteMany({
      where: { lettreId: letterId },
    }),
    prisma.lettreRecommandation.delete({
      where: { id: letterId },
    }),
  ]);
};