// stage.controller.ts
import { Request, Response } from "express";
import {
  AjouterStage, GetMyStages, GetSubmittedStages, GetStageById,
  UpdateStage, DeleteStage, SubmitStage, RejectStage, ValidateStage, GetProfs,
} from "./stage.service.js";
import { StageSchema, UpdateStageSchema } from "./stage.validation.js";
import { ZodError } from "zod";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const getString = (val: string | string[] | undefined): string =>
  Array.isArray(val) ? val[0] : (val ?? "");

/** Parse et valide un ID numérique depuis les params ou query */
const parseId = (res: Response, raw: string | string[] | undefined): number | null => {
  const id = Number(getString(raw));
  if (isNaN(id) || id <= 0) {
    res.status(400).json({ error: "ID invalide" });
    return null;
  }
  return id;
};

/** Map des messages d'erreur métier → status HTTP + message client */
const ERROR_MAP: Record<string, { status: number; message: string }> = {
  FORBIDDEN:                      { status: 403, message: "Accès refusé" },
  STAGE_LOCKED:                   { status: 400, message: "Stage déjà soumis ou validé" },
  STAGE_NOT_SUBMITTED:            { status: 400, message: "Le stage doit être soumis avant cette action" },
  "Stage introuvable":            { status: 404, message: "Stage introuvable" },
  "Encadrant introuvable":        { status: 404, message: "Encadrant introuvable" },
  "Profil étudiant introuvable":  { status: 404, message: "Profil étudiant introuvable" },
  "Profil professeur introuvable":{ status: 404, message: "Profil professeur introuvable" },
  "Vous avez déjà un stage dans cette période": { status: 409, message: "Vous avez déjà un stage dans cette période" },
};

/** Gestion centralisée des erreurs */
const handleError = (res: Response, error: unknown): Response => {
    console.error("🔴 ERROR:", error); // ← السطر الجديد فقط

  if (error instanceof ZodError)
    return res.status(400).json({ error: error.issues });

  if (error instanceof Error) {
    const mapped = ERROR_MAP[error.message];
    if (mapped) return res.status(mapped.status).json({ error: mapped.message });
  }

  return res.status(500).json({ error: "Erreur interne du serveur" });
};

// ─────────────────────────────────────────────
// Controllers
// ─────────────────────────────────────────────

export const AjouterStageController = async (req: Request, res: Response) => {
  try {
    const data  = StageSchema.parse(req.body);
    const stage = await AjouterStage(req.user.id, data);
    res.status(201).json(stage);
  } catch (error) {
    handleError(res, error);
  }
};

export const GetMyStagesController = async (req: Request, res: Response) => {
  try {
    const stages = await GetMyStages(req.user.id);
    res.status(200).json(stages);
  } catch (error) {
    handleError(res, error);
  }
};

export const GetSubmittedStagesController = async (req: Request, res: Response) => {
  try {
    const stages = await GetSubmittedStages(req.user.id);
    res.status(200).json(stages);
  } catch (error) {
    handleError(res, error);
  }
};

export const GetStageByIdController = async (req: Request, res: Response) => {
  try {
    const stageId = parseId(res, req.params.id);
    if (stageId === null) return;

    const { id: userId, role } = req.user;
    const stage = await GetStageById(stageId, userId, role);
    res.status(200).json(stage);
  } catch (error) {
    handleError(res, error);
  }
};

export const UpdateStageController = async (req: Request, res: Response) => {
  try {
    const stageId = parseId(res, req.params.id);
    if (stageId === null) return;

    const data  = UpdateStageSchema.parse(req.body);
    const stage = await UpdateStage(stageId, req.user.id, data);
    res.status(200).json(stage);
  } catch (error) {
    handleError(res, error);
  }
};

export const DeleteStageController = async (req: Request, res: Response) => {
  try {
    const stageId = parseId(res, req.params.id);
    if (stageId === null) return;

    await DeleteStage(stageId, req.user.id);
    res.status(200).json({ message: "Stage supprimé avec succès" });
  } catch (error) {
    handleError(res, error);
  }
};

export const SubmitStageController = async (req: Request, res: Response) => {
  try {
    const stageId = parseId(res, req.params.id);
    if (stageId === null) return;

    const stage = await SubmitStage(stageId, req.user.id);
    res.status(200).json(stage);
  } catch (error) {
    handleError(res, error);
  }
};

export const ValidateStageController = async (req: Request, res: Response) => {
  try {
    const stageId = parseId(res, req.params.id);
    if (stageId === null) return;

    const stage = await ValidateStage(stageId, req.user.id);
    res.status(200).json({ message: "Stage validé avec succès", stage });
  } catch (error) {
    handleError(res, error);
  }
};

export const RejectStageController = async (req: Request, res: Response) => {
  try {
    const stageId = parseId(res, req.params.id);
    if (stageId === null) return;

    const { raison } = req.body;
    if (!raison?.trim()) {
      return res.status(400).json({ error: "La raison du rejet est obligatoire" });
    }

    const stage = await RejectStage(stageId, req.user.id, raison);
    res.status(200).json({ message: "Stage rejeté avec succès", stage });
  } catch (error) {
    handleError(res, error);
  }
};

export const GetProfsController = async (req: Request, res: Response) => {
  try {
    const profs = await GetProfs();
    res.status(200).json(profs);
  } catch (error) {
    handleError(res, error);
  }
};

