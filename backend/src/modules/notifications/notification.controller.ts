import { Request, Response } from "express";
import { GetMyNotifications, MarkAsRead, MarkAllAsRead } from "./notification.service.js";

const PROFILE_ERRORS = ["Profil étudiant introuvable", "Profil professeur introuvable"];

const handleError = (res: Response, error: unknown): Response => {
  if (error instanceof Error) {
    if (PROFILE_ERRORS.includes(error.message))
      return res.status(404).json({ error: error.message });
    if (error.message === "Notification introuvable")
      return res.status(404).json({ error: error.message });
    if (error.message === "FORBIDDEN")
      return res.status(403).json({ error: "Accès refusé" });
  }
  return res.status(500).json({ error: "Erreur interne du serveur" });
};

export const GetMyNotificationsController = async (req: Request, res: Response) => {
  try {
    const notifications = await GetMyNotifications(req.user.id, req.user.role);
    return res.status(200).json(notifications);
  } catch (error) {
    return handleError(res, error);
  }
};

export const MarkAsReadController = async (req: Request, res: Response) => {
  try {
    const notificationId = Number(req.params.id);
    if (isNaN(notificationId))
      return res.status(400).json({ error: "Identifiant invalide" });

    const notification = await MarkAsRead(notificationId, req.user.id, req.user.role);
    return res.status(200).json({ message: "Notification marquée comme lue", notification });
  } catch (error) {
    return handleError(res, error);
  }
};

export const MarkAllAsReadController = async (req: Request, res: Response) => {
  try {
    await MarkAllAsRead(req.user.id, req.user.role);
    return res.status(200).json({ message: "Toutes les notifications marquées comme lues" });
  } catch (error) {
    return handleError(res, error);
  }
};