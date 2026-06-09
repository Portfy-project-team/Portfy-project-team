import { Request, Response } from "express";
import {
  AjouterStage,
  GetMyStages,
  GetSubmittedStages,
  GetStageById,
  UpdateStage,
  DeleteStage,
  SubmitStage,
  RejectStage,
  ValidateStage,
  GetProfs,
} from "./stage.service.js";
import { StageSchema, UpdateStageSchema } from "./stage.validation.js";

// ── Helpers ───────────────────────────────────────────────────────

const getString = (val: string | string[] | undefined): string =>
  Array.isArray(val) ? val[0] : (val ?? "");

const parseId = (res: Response, raw: string | string[] | undefined): number | null => {
  const id = Number(getString(raw));
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "ID invalide" });
    return null;
  }
  return id;
};

const ERROR_MAP: Record<string, { status: number; message: string }> = {
  FORBIDDEN:                        { status: 404, message: "Stage introuvable" },
  STAGE_LOCKED:                     { status: 400, message: "Stage déjà soumis ou validé" },
  STAGE_NOT_SUBMITTED:              { status: 400, message: "Le stage doit être soumis avant cette action" },
  "Stage introuvable":              { status: 404, message: "Stage introuvable" },
  "Encadrant introuvable":          { status: 404, message: "Encadrant introuvable" },
  "Profil étudiant introuvable":    { status: 404, message: "Profil étudiant introuvable" },
  "Profil professeur introuvable":  { status: 404, message: "Profil professeur introuvable" },
  "Vous avez déjà un stage dans cette période": { status: 409, message: "Vous avez déjà un stage dans cette période" },
};

const handleError = (res: Response, error: unknown): Response => {
  if (error instanceof Error) {
    const mapped = ERROR_MAP[error.message];
    if (mapped) return res.status(mapped.status).json({ error: mapped.message });
  }
  console.error("[stage]", error);
  return res.status(500).json({ error: "Erreur interne du serveur" });
};

// ── Controllers ───────────────────────────────────────────────────

// CORRECTION 1 : .parse() remplacé par .safeParse() partout
// Retourne 400 structuré au lieu de laisser partir l'exception Zod

export const AjouterStageController = async (req: Request, res: Response) => {
  const parsed = StageSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error:  "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const stage = await AjouterStage(req.user!.id, parsed.data);
    res.status(201).json(stage);
  } catch (error) {
    handleError(res, error);
  }
};

export const GetMyStagesController = async (req: Request, res: Response) => {
  try {
    const stages = await GetMyStages(req.user!.id);
    res.status(200).json(stages);
  } catch (error) {
    handleError(res, error);
  }
};

export const GetSubmittedStagesController = async (req: Request, res: Response) => {
  try {
    const stages = await GetSubmittedStages(req.user!.id);
    res.status(200).json(stages);
  } catch (error) {
    handleError(res, error);
  }
};

export const GetStageByIdController = async (req: Request, res: Response) => {
  const stageId = parseId(res, req.params.id);
  if (stageId === null) return;

  try {
    const { id: userId, role } = req.user!;
    const stage = await GetStageById(stageId, userId, role);
    res.status(200).json(stage);
  } catch (error) {
    handleError(res, error);
  }
};

export const UpdateStageController = async (req: Request, res: Response) => {
  const stageId = parseId(res, req.params.id);
  if (stageId === null) return;

  const parsed = UpdateStageSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      error:  "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const stage = await UpdateStage(stageId, req.user!.id, parsed.data);
    res.status(200).json(stage);
  } catch (error) {
    handleError(res, error);
  }
};

export const DeleteStageController = async (req: Request, res: Response) => {
  const stageId = parseId(res, req.params.id);
  if (stageId === null) return;

  try {
    await DeleteStage(stageId, req.user!.id);
    res.status(200).json({ message: "Stage supprimé avec succès" });
  } catch (error) {
    handleError(res, error);
  }
};

export const SubmitStageController = async (req: Request, res: Response) => {
  const stageId = parseId(res, req.params.id);
  if (stageId === null) return;

  try {
    const stage = await SubmitStage(stageId, req.user!.id);
    res.status(200).json(stage);
  } catch (error) {
    handleError(res, error);
  }
};

export const ValidateStageController = async (req: Request, res: Response) => {
  const stageId = parseId(res, req.params.id);
  if (stageId === null) return;

  try {
    const stage = await ValidateStage(stageId, req.user!.id);
    res.status(200).json({ message: "Stage validé avec succès", stage });
  } catch (error) {
    handleError(res, error);
  }
};

// CORRECTION 2 : raison de rejet validée via Zod au lieu de req.body direct
// La version originale lisait req.body.raison sans validation —
// un string vide ou très long passait sans contrôle
export const RejectStageController = async (req: Request, res: Response) => {
  const stageId = parseId(res, req.params.id);
  if (stageId === null) return;

  const { raison } = req.body;

  if (!raison || typeof raison !== "string" || !raison.trim()) {
    res.status(400).json({ error: "La raison du rejet est obligatoire" });
    return;
  }

  if (raison.trim().length > 500) {
    res.status(400).json({ error: "La raison du rejet est trop longue (500 caractères max)" });
    return;
  }

  try {
    const stage = await RejectStage(stageId, req.user!.id, raison.trim());
    res.status(200).json({ message: "Stage rejeté avec succès", stage });
  } catch (error) {
    handleError(res, error);
  }
};

// CORRECTION 3 : GetProfsController — ajout de try/catch absent
// Si Prisma échoue, l'erreur n'était pas gérée dans la version originale
export const GetProfsController = async (req: Request, res: Response) => {
  try {
    const profs = await GetProfs();
    res.status(200).json(profs);
  } catch (error) {
    handleError(res, error);
  }
};