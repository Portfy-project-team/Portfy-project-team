import type { Request, Response } from "express";
import {
  createStudentSkillSchema,
  updateStudentSkillSchema,
} from "./skill.validation.js";
import {
  addStudentSkill,
  getMySkills,
  updateStudentSkill,
  deleteStudentSkill,
  getMySkillRadar,
  getMySkillStats,
} from "./skill.service.js";

const parseSkillId = (req: Request): number | null => {
  const id = Number(req.params.skillId);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const handleError = (error: unknown, res: Response, context: string): void => {
  if (error instanceof Error && "statusCode" in error) {
    const statusCode = Number((error as { statusCode: number }).statusCode);
    res.status(statusCode).json({ message: error.message });
    return;
  }

  console.error(`[${context}]`, error);
  res.status(500).json({ message: "Une erreur est survenue" });
};

export const addStudentSkillController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = createStudentSkillSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const skill = await addStudentSkill(req.user!.id, parsed.data);

    res.status(201).json({
      message: "Compétence ajoutée avec succès",
      skill,
    });
  } catch (error) {
    handleError(error, res, "addStudentSkillController");
  }
};

export const getMySkillsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const skills = await getMySkills(req.user!.id);
    res.status(200).json({ skills });
  } catch (error) {
    handleError(error, res, "getMySkillsController");
  }
};

export const updateStudentSkillController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const skillId = parseSkillId(req);

  if (!skillId) {
    res.status(400).json({ message: "Id compétence invalide" });
    return;
  }

  const parsed = updateStudentSkillSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const skill = await updateStudentSkill(req.user!.id, skillId, parsed.data);

    res.status(200).json({
      message: "Compétence modifiée avec succès",
      skill,
    });
  } catch (error) {
    handleError(error, res, "updateStudentSkillController");
  }
};

export const deleteStudentSkillController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const skillId = parseSkillId(req);

  if (!skillId) {
    res.status(400).json({ message: "Id compétence invalide" });
    return;
  }

  try {
    await deleteStudentSkill(req.user!.id, skillId);

    res.status(200).json({
      message: "Compétence supprimée avec succès",
    });
  } catch (error) {
    handleError(error, res, "deleteStudentSkillController");
  }
};

export const getMySkillRadarController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const radar = await getMySkillRadar(req.user!.id);
    res.status(200).json({ radar });
  } catch (error) {
    handleError(error, res, "getMySkillRadarController");
  }
};

export const getMySkillStatsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await getMySkillStats(req.user!.id);
    res.status(200).json({ stats });
  } catch (error) {
    handleError(error, res, "getMySkillStatsController");
  }
};