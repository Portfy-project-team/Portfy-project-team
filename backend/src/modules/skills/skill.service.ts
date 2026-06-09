import { prisma } from "../../utils/prisma.js";
import type {
  CreateStudentSkillInput,
  UpdateStudentSkillInput,
} from "./skill.validation.js";

class SkillError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

const niveauScore = {
  DEBUTANT:      1,
  INTERMEDIAIRE: 2,
  AVANCE:        3,
  EXPERT:        4,
} as const;

const getStudentByUserId = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where:  { userId },
    select: { id: true },
  });

  if (!student) {
    throw new SkillError("Profil étudiant introuvable", 404);
  }

  return student;
};

// ── Add skill ─────────────────────────────────────────────────────
export const addStudentSkill = async (
  userId: number,
  data:   CreateStudentSkillInput
) => {
  const student = await getStudentByUserId(userId);

  // CORRECTION 1 : findUnique au lieu de findFirst
  // Le schéma Prisma définit @@unique([etablissement, diplome, specialite]) sur Skill
  // et nom est @unique sur Skill — findUnique est plus approprié et plus performant
  let skill = await prisma.skill.findUnique({
    where: { nom: data.nom },
  });

  if (!skill) {
    skill = await prisma.skill.create({
      data: {
        nom:       data.nom,
        categorie: data.categorie,
      },
    });
  }

  const existing = await prisma.studentSkill.findUnique({
    where: {
      studentId_skillId: {
        studentId: student.id,
        skillId:   skill.id,
      },
    },
    select: { studentId: true },
  });

  if (existing) {
    throw new SkillError(
      "Cette compétence existe déjà pour cet étudiant",
      409
    );
  }

  return prisma.studentSkill.create({
    data: {
      studentId: student.id,
      skillId:   skill.id,
      niveau:    data.niveau ?? "DEBUTANT",
    },
    select: {
      niveau:    true,
      dateAjout: true,
      skill: {
        select: {
          id:        true,
          nom:       true,
          categorie: true,
        },
      },
    },
  });
};

// ── Get my skills ─────────────────────────────────────────────────
export const getMySkills = async (userId: number) => {
  const student = await getStudentByUserId(userId);

  return prisma.studentSkill.findMany({
    where:   { studentId: student.id },
    orderBy: { dateAjout: "desc" },
    select: {
      niveau:    true,
      dateAjout: true,
      skill: {
        select: {
          id:        true,
          nom:       true,
          categorie: true,
        },
      },
    },
  });
};

// ── Update skill ──────────────────────────────────────────────────
export const updateStudentSkill = async (
  userId:  number,
  skillId: number,
  data:    UpdateStudentSkillInput
) => {
  const student = await getStudentByUserId(userId);

  const existing = await prisma.studentSkill.findUnique({
    where: {
      studentId_skillId: {
        studentId: student.id,
        skillId,
      },
    },
    select: { studentId: true },
  });

  if (!existing) {
    // CORRECTION 2 : 404 — ownership check
    // Si la compétence n'appartient pas à l'étudiant connecté
    // on retourne 404 pour ne pas confirmer son existence
    throw new SkillError("Compétence introuvable", 404);
  }

  return prisma.studentSkill.update({
    where: {
      studentId_skillId: {
        studentId: student.id,
        skillId,
      },
    },
    data:  { niveau: data.niveau },
    select: {
      niveau:    true,
      dateAjout: true,
      skill: {
        select: {
          id:        true,
          nom:       true,
          categorie: true,
        },
      },
    },
  });
};

// ── Delete skill ──────────────────────────────────────────────────
export const deleteStudentSkill = async (
  userId:  number,
  skillId: number
) => {
  const student = await getStudentByUserId(userId);

  const existing = await prisma.studentSkill.findUnique({
    where: {
      studentId_skillId: {
        studentId: student.id,
        skillId,
      },
    },
    select: { studentId: true },
  });

  if (!existing) {
    throw new SkillError("Compétence introuvable", 404);
  }

  await prisma.studentSkill.delete({
    where: {
      studentId_skillId: {
        studentId: student.id,
        skillId,
      },
    },
  });
};

// ── Radar ─────────────────────────────────────────────────────────
export const getMySkillRadar = async (userId: number) => {
  const skills = await getMySkills(userId);

  const grouped = new Map<string, { total: number; count: number }>();

  for (const item of skills) {
    const category = item.skill.categorie ?? "Autres";
    const score    = niveauScore[item.niveau];
    const current  = grouped.get(category) ?? { total: 0, count: 0 };

    grouped.set(category, {
      total: current.total + score,
      count: current.count + 1,
    });
  }

  return Array.from(grouped.entries()).map(([categorie, value]) => ({
    categorie,
    score:    Number((value.total / value.count).toFixed(2)),
    maxScore: 4,
    count:    value.count,
  }));
};

// ── Stats ─────────────────────────────────────────────────────────
export const getMySkillStats = async (userId: number) => {
  const skills = await getMySkills(userId);

  const byLevel = {
    DEBUTANT:      0,
    INTERMEDIAIRE: 0,
    AVANCE:        0,
    EXPERT:        0,
  };

  const byCategory: Record<string, number> = {};

  for (const item of skills) {
    byLevel[item.niveau] += 1;

    const category = item.skill.categorie ?? "Autres";
    byCategory[category] = (byCategory[category] ?? 0) + 1;
  }

  return {
    total: skills.length,
    byLevel,
    byCategory,
  };
};