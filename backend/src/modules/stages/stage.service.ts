// stage.service.ts
import { StatutValidation } from "@prisma/client";
import { prisma } from "../../utils/prisma.js";
import { StageInput } from "./stage.validation.js";

// ─────────────────────────────────────────────
// Helpers privés
// ─────────────────────────────────────────────

const calculerDuree = (dateDebut: Date, dateFin: Date): number =>
  Math.round((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24 * 30));

const getStudentOrThrow = async (userId: number) => {
  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) throw new Error("Profil étudiant introuvable");
  return student;
};

const getProfOrThrow = async (userId: number) => {
  const prof = await prisma.prof.findUnique({ where: { userId } });
  if (!prof) throw new Error("Profil professeur introuvable");
  return prof;
};

const getStageOrThrow = async (stageId: number) => {
  const stage = await prisma.stage.findUnique({ where: { id: stageId } });
  if (!stage) throw new Error("Stage introuvable");
  return stage;
};

/** Vérifie que le stage appartient à l'étudiant ET est encore en PENDING */
const assertStageEditableByStudent = async (stageId: number, userId: number) => {
  const student = await getStudentOrThrow(userId);
  const stage   = await getStageOrThrow(stageId);

  if (stage.studentId !== student.id)               throw new Error("FORBIDDEN");
  if (stage.statutV   !== StatutValidation.PENDING)  throw new Error("STAGE_LOCKED");

  return { student, stage };
};

// ─────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────

export const AjouterStage = async (userId: number, stageData: StageInput) => {
  const student = await getStudentOrThrow(userId);
  const { encadrantId, ...stageInfo } = stageData;

  const encadrant = await prisma.prof.findUnique({ where: { id: encadrantId } });
  if (!encadrant) throw new Error("Encadrant introuvable");

  const chevauchement = await prisma.stage.findFirst({
    where: {
      studentId: student.id,
      AND: [
        { dateDebut: { lte: stageInfo.dateFin } },
        { dateFin:   { gte: stageInfo.dateDebut } },
      ],
    },
  });

  if (chevauchement) throw new Error("CHEVAUCHEMENT_DATES");

  return prisma.stage.create({
    data: {
      ...stageInfo,
      studentId:   student.id,
      encadrantId: encadrant.id,
      duree:       calculerDuree(stageInfo.dateDebut, stageInfo.dateFin),
      statutV:     StatutValidation.PENDING,
    },
  });
};

export const GetMyStages = async (userId: number) => {
  const student = await getStudentOrThrow(userId);
  return prisma.stage.findMany({
    where:   { studentId: student.id },
    orderBy: { dateDebut: "desc" },
  });
};

export const GetSubmittedStages = async (profUserId: number) => {
  const prof = await getProfOrThrow(profUserId);
  return prisma.stage.findMany({
    where:   { statutV: StatutValidation.SUBMITTED, encadrantId: prof.id },
    include: { Student: { select: { id: true, userId: true } } },
    orderBy: { dateDebut: "desc" },
  });
};

export const GetStageById = async (
  stageId: number,
  userId:  number,
  role:    string
) => {
  const stage = await prisma.stage.findUnique({
    where:   { id: stageId },
    include: { Student: { select: { id: true, userId: true } } },
  });
  if (!stage) throw new Error("Stage introuvable");

  if (role === "STUDENT") {
    const student = await getStudentOrThrow(userId);
    if (stage.studentId !== student.id) throw new Error("FORBIDDEN");
  }

  if (role === "PROF") {
    const prof = await getProfOrThrow(userId);
    if (stage.encadrantId !== prof.id) throw new Error("FORBIDDEN");
  }

  return stage;
};

export const UpdateStage = async (
  stageId: number,
  userId:  number,
  data:    Partial<StageInput>
) => {
  const { stage } = await assertStageEditableByStudent(stageId, userId);

  if (data.encadrantId) {
    const encadrant = await prisma.prof.findUnique({ where: { id: data.encadrantId } });
    if (!encadrant) throw new Error("Encadrant introuvable");
  }

  const dateDebut = data.dateDebut ?? stage.dateDebut;
  const dateFin   = data.dateFin   ?? stage.dateFin;

  return prisma.stage.update({
    where: { id: stageId },
    data:  {
      ...data,
      duree: calculerDuree(dateDebut, dateFin),
    },
  });
};

export const DeleteStage = async (stageId: number, userId: number) => {
  await assertStageEditableByStudent(stageId, userId);
  return prisma.stage.delete({ where: { id: stageId } });
};

export const SubmitStage = async (stageId: number, userId: number) => {
  await assertStageEditableByStudent(stageId, userId);
  return prisma.stage.update({
    where: { id: stageId },
    data:  { statutV: StatutValidation.SUBMITTED },
  });
};

// ─────────────────────────────────────────────
// Actions professeur
// ─────────────────────────────────────────────

/** Helper commun pour ValidateStage / RejectStage */
const assertStageSubmittedByProf = async (stageId: number, profUserId: number) => {
  const prof  = await getProfOrThrow(profUserId);
  const stage = await prisma.stage.findUnique({
    where:   { id: stageId },
    include: { Student: true },
  });
  if (!stage) throw new Error("Stage introuvable");
  if (stage.statutV     !== StatutValidation.SUBMITTED) throw new Error("STAGE_NOT_SUBMITTED");
  if (stage.encadrantId !== prof.id)                    throw new Error("FORBIDDEN");

  return { prof, stage };
};

const envoyerNotificationStage = (
  studentId:   number,
  _entreprise: string,
  stageId:     number,
  type:        "STAGE_VALIDATED" | "STAGE_REJECTED",
  message:     string
) =>
  prisma.notification.create({
    data: {
      studentId,
      message,
      type,
      entityId:   stageId,
      entityType: "STAGE",
      link:       `${process.env.FRONTEND_URL}/stages/${stageId}`,
    },
  });

export const ValidateStage = async (stageId: number, profUserId: number) => {
  const { prof, stage } = await assertStageSubmittedByProf(stageId, profUserId);

  const stageValide = await prisma.stage.update({
    where: { id: stageId },
    data:  { statutV: StatutValidation.VALIDATED, encadrantId: prof.id },
  });

  await envoyerNotificationStage(
    stage.Student.id,
    stage.entreprise,
    stage.id,
    "STAGE_VALIDATED",
    `Votre stage "${stage.entreprise}" a été validé avec succès`
  );

  return stageValide;
};

export const RejectStage = async (
  stageId:    number,
  profUserId: number,
  raison:     string
) => {
  const { prof, stage } = await assertStageSubmittedByProf(stageId, profUserId);

  const stageRejete = await prisma.stage.update({
    where: { id: stageId },
    data:  {
      statutV:         StatutValidation.REJECTED,
      encadrantId:     prof.id,
      rejectionReason: raison,
    },
  });

  await envoyerNotificationStage(
    stage.Student.id,
    stage.entreprise,
    stage.id,
    "STAGE_REJECTED",
    `Votre stage "${stage.entreprise}" a été rejeté. Raison : ${raison}`
  );

  return stageRejete;
};

export const GetProfs = async () =>
  prisma.prof.findMany({
    select: {
      id:          true,
      nom:         true,
      prenom:      true,
      departement: true,
      specialite:  true,
    },
  });