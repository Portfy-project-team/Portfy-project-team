import type { Request, Response } from "express";
import {
  createActivitySchema,
  updateActivitySchema,
} from "./activity.validation.js";
import {
  createActivity,
  getMyActivities,
  updateActivity,
  deleteActivity,
  getPendingActivities,
  validateActivity,
  rejectActivity,
} from "./activity.service.js";

const parseId = (value: unknown): number | null => {
  if (typeof value !== "string") {
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

export const createActivityController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = createActivitySchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const activity = await createActivity(req.user!.id, parsed.data);

    res.status(201).json({
      message: "Activité créée avec succès",
      activity,
    });
  } catch (error) {
    handleError(error, res, "createActivityController");
  }
};

export const getMyActivitiesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activities = await getMyActivities(req.user!.id);
    res.status(200).json({ activities });
  } catch (error) {
    handleError(error, res, "getMyActivitiesController");
  }
};

export const updateActivityController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const activityId = parseId(req.params.id);

  if (!activityId) {
    res.status(400).json({ message: "Id activité invalide" });
    return;
  }

  const parsed = updateActivitySchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const activity = await updateActivity(req.user!.id, activityId, parsed.data);

    res.status(200).json({
      message: "Activité modifiée avec succès",
      activity,
    });
  } catch (error) {
    handleError(error, res, "updateActivityController");
  }
};

export const deleteActivityController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const activityId = parseId(req.params.id);

  if (!activityId) {
    res.status(400).json({ message: "Id activité invalide" });
    return;
  }

  try {
    await deleteActivity(req.user!.id, activityId);

    res.status(200).json({
      message: "Activité supprimée avec succès",
    });
  } catch (error) {
    handleError(error, res, "deleteActivityController");
  }
};

export const getPendingActivitiesController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const activities = await getPendingActivities();
    res.status(200).json({ activities });
  } catch (error) {
    handleError(error, res, "getPendingActivitiesController");
  }
};

export const validateActivityController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const activityId = parseId(req.params.id);

  if (!activityId) {
    res.status(400).json({ message: "Id activité invalide" });
    return;
  }

  try {
    const activity = await validateActivity(req.user!, activityId);

    res.status(200).json({
      message: "Activité validée avec succès",
      activity,
    });
  } catch (error) {
    handleError(error, res, "validateActivityController");
  }
};

export const rejectActivityController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const activityId = parseId(req.params.id);

  if (!activityId) {
    res.status(400).json({ message: "Id activité invalide" });
    return;
  }

  try {
    const activity = await rejectActivity(req.user!, activityId);

    res.status(200).json({
      message: "Activité rejetée",
      activity,
    });
  } catch (error) {
    handleError(error, res, "rejectActivityController");
  }
};