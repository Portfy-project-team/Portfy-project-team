import type { Request, Response } from "express";
import {
  createLetterSchema,
  updateLetterVisibilitySchema,
} from "./letter.validation.js";
import {
  createLetter,
  getMyLetters,
  getLettersCreatedByMe,
  updateLetterVisibility,
  deleteLetter,
} from "./letter.service.js";

const parseId = (
  value: string | string[] | undefined
): number | null => {
  if (Array.isArray(value)) {
    return null;
  }

  const id = Number(value);
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

export const createLetterController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = createLetterSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const letter = await createLetter(req.user!.id, parsed.data);

    res.status(201).json({
      message: "Lettre créée avec succès",
      letter,
    });
  } catch (error) {
    handleError(error, res, "createLetterController");
  }
};

export const getMyLettersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const letters = await getMyLetters(req.user!.id);
    res.status(200).json({ letters });
  } catch (error) {
    handleError(error, res, "getMyLettersController");
  }
};

export const getLettersCreatedByMeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const letters = await getLettersCreatedByMe(req.user!.id);
    res.status(200).json({ letters });
  } catch (error) {
    handleError(error, res, "getLettersCreatedByMeController");
  }
};

export const updateLetterVisibilityController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const letterId = parseId(req.params.id);

  if (!letterId) {
    res.status(400).json({ message: "Id lettre invalide" });
    return;
  }

  const parsed = updateLetterVisibilitySchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const letter = await updateLetterVisibility(
      req.user!.id,
      letterId,
      parsed.data
    );

    res.status(200).json({
      message: "Visibilité mise à jour",
      letter,
    });
  } catch (error) {
    handleError(error, res, "updateLetterVisibilityController");
  }
};

export const deleteLetterController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const letterId = parseId(req.params.id);

  if (!letterId) {
    res.status(400).json({ message: "Id lettre invalide" });
    return;
  }

  try {
    await deleteLetter(req.user!, letterId);

    res.status(200).json({
      message: "Lettre supprimée avec succès",
    });
  } catch (error) {
    handleError(error, res, "deleteLetterController");
  }
};