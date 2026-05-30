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
  id:   number;
  role: Role;
}

const getStudentByUserId = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where:  { userId },
    select: { id: true },
  });

  if (!student) {
    throw new LetterError("Profil étudiant introuvable", 404);
  }

  return student;
};

const getProfByUserId = async (userId: number) => {
  const prof = await prisma.prof.findUnique({
    where:  { userId },
    select: { id: true },
  });

  if (!prof) {
    throw new LetterError("Profil professeur introuvable", 404);
  }

  return prof;
};

// ── Create ────────────────────────────────────────────────────────
export const createLetter = async (
  professorUserId: number,
  data: CreateLetterInput
) => {
  const prof = await getProfByUserId(professorUserId);

  const targetStudent = await prisma.student.findUnique({
    where:  { id: data.studentId },
    select: { id: true },
  });

  if (!targetStudent) {
    throw new LetterError("Étudiant cible introuvable", 404);
  }

  return prisma.lettreRecommandation.create({
    data: {
      type:       data.type,
      contenu:    data.contenu,
      profId:     prof.id,
      visibilite: "PRIVATE", // toujours PRIVATE à la création
      LettreStudent: {
        create: { studentId: targetStudent.id },
      },
    },
    // select explicite — ne retourner que ce qui est nécessaire
    select: {
      id:         true,
      type:       true,
      contenu:    true,
      visibilite: true,
      date:       true,
      Prof: {
        select: {
          id:          true,
          nom:         true,
          prenom:      true,
          departement: true,
          specialite:  true,
        },
      },
      LettreStudent: {
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

// ── Get my letters (student) ──────────────────────────────────────
export const getMyLetters = async (studentUserId: number) => {
  const student = await getStudentByUserId(studentUserId);

  return prisma.lettreRecommandation.findMany({
    where: {
      LettreStudent: {
        some: { studentId: student.id },
      },
    },
    orderBy: { date: "desc" },
    select: {
      id:         true,
      type:       true,
      contenu:    true,
      visibilite: true,
      date:       true,
      Prof: {
        select: {
          id:          true,
          nom:         true,
          prenom:      true,
          departement: true,
          specialite:  true,
        },
      },
      LettreStudent: {
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

// ── Get letters created by prof ───────────────────────────────────
export const getLettersCreatedByMe = async (professorUserId: number) => {
  const prof = await getProfByUserId(professorUserId);

  return prisma.lettreRecommandation.findMany({
    where:   { profId: prof.id },
    orderBy: { date: "desc" },
    select: {
      id:         true,
      type:       true,
      contenu:    true,
      visibilite: true,
      date:       true,
      LettreStudent: {
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

// ── Update visibility ─────────────────────────────────────────────
export const updateLetterVisibility = async (
  studentUserId: number,
  letterId: number,
  data: UpdateLetterVisibilityInput
) => {
  const student = await getStudentByUserId(studentUserId);

  const ownership = await prisma.lettreStudent.findUnique({
    where: {
      lettreId_studentId: {
        lettreId:  letterId,
        studentId: student.id,
      },
    },
    select: { lettreId: true, studentId: true },
  });

  if (!ownership) {
    // 404 et non 403 — ne pas confirmer que la lettre existe
    throw new LetterError("Lettre introuvable", 404);
  }

  return prisma.lettreRecommandation.update({
    where: { id: letterId },
    data:  { visibilite: data.visibilite },
    select: {
      id:         true,
      type:       true,
      visibilite: true,
      date:       true,
      Prof: {
        select: { id: true, nom: true, prenom: true },
      },
    },
  });
};

// ── Delete ────────────────────────────────────────────────────────
export const deleteLetter = async (authUser: AuthUser, letterId: number) => {
  const letter = await prisma.lettreRecommandation.findUnique({
    where:  { id: letterId },
    select: { id: true, profId: true },
  });

  if (!letter) {
    throw new LetterError("Lettre introuvable", 404);
  }

  if (authUser.role === "PROF") {
    const prof = await getProfByUserId(authUser.id);

    if (letter.profId !== prof.id) {
      // 404 et non 403 — ne pas confirmer que la lettre existe
      throw new LetterError("Lettre introuvable", 404);
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