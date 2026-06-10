import type { Request, Response } from "express";
import { createRecommendationSchema } from "./recommendation.validation.js";
import {
  createRecommendation,
  getPendingRecommendationsForMe,
  acceptRecommendation,
  rejectRecommendation,
} from "./recommendation.service.js";

const parseId = (value: unknown): number | null => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const handleError = (error: unknown, res: Response, context: string): void => {
  if (error instanceof Error && "statusCode" in error) {
    res.status(Number((error as any).statusCode)).json({ message: error.message });
    return;
  }
  console.error(`[${context}]`, error);
  res.status(500).json({ message: "Une erreur est survenue" });
};

export const createRecommendationController = async (req: Request, res: Response): Promise<void> => {
  const parsed = createRecommendationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Données invalides", errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const reco = await createRecommendation(req.user!, parsed.data);
    res.status(201).json({ message: "Recommandation créée, en attente de validation", recommendation: reco });
  } catch (error) {
    handleError(error, res, "createRecommendationController");
  }
};

export const getPendingRecommendationsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const recommendations = await getPendingRecommendationsForMe(req.user!.id);
    res.status(200).json({ recommendations });
  } catch (error) {
    handleError(error, res, "getPendingRecommendationsController");
  }
};

export const acceptRecommendationController = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ message: "Id recommandation invalide" }); return; }
  try {
    const reco = await acceptRecommendation(req.user!.id, id);
    res.status(200).json({ message: "Recommandation acceptée", recommendation: reco });
  } catch (error) {
    handleError(error, res, "acceptRecommendationController");
  }
};

export const rejectRecommendationController = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ message: "Id recommandation invalide" }); return; }
  try {
    const reco = await rejectRecommendation(req.user!.id, id);
    res.status(200).json({ message: "Recommandation rejetée", recommendation: reco });
  } catch (error) {
    handleError(error, res, "rejectRecommendationController");
  }
};