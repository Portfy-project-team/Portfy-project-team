import type { Request, Response } from "express";
import { createCommentSchema } from "./comment.validation.js";
import {
  createComment,
  getPendingCommentsForMe,
  acceptComment,
  rejectComment,
} from "./comment.service.js";

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

export const createCommentController = async (req: Request, res: Response): Promise<void> => {
  const parsed = createCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Données invalides", errors: parsed.error.flatten().fieldErrors });
    return;
  }
  try {
    const comment = await createComment(req.user!, parsed.data);
    res.status(201).json({ message: "Commentaire créé, en attente de validation", comment });
  } catch (error) {
    handleError(error, res, "createCommentController");
  }
};

export const getPendingCommentsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const comments = await getPendingCommentsForMe(req.user!.id);
    res.status(200).json({ comments });
  } catch (error) {
    handleError(error, res, "getPendingCommentsController");
  }
};

export const acceptCommentController = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ message: "Id commentaire invalide" }); return; }
  try {
    const comment = await acceptComment(req.user!.id, id);
    res.status(200).json({ message: "Commentaire accepté", comment });
  } catch (error) {
    handleError(error, res, "acceptCommentController");
  }
};

export const rejectCommentController = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  if (!id) { res.status(400).json({ message: "Id commentaire invalide" }); return; }
  try {
    const comment = await rejectComment(req.user!.id, id);
    res.status(200).json({ message: "Commentaire rejeté", comment });
  } catch (error) {
    handleError(error, res, "rejectCommentController");
  }
};