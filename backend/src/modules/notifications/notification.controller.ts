import { Request, Response } from "express";
import {
  GetMyNotifications,
  MarkAsRead,
  MarkAllAsRead,
} from "./notification.service.js";

const PROFILE_ERRORS = [
  "Profil étudiant introuvable",
  "Profil professeur introuvable",
  "Profil professionnel introuvable",
  "Profil admin introuvable",
];

const handleError = (res: Response, error: unknown): Response => {
  if (error instanceof Error) {
    if (PROFILE_ERRORS.includes(error.message))
      return res.status(404).json({ error: error.message });

    if (error.message === "Notification introuvable")
      return res.status(404).json({ error: error.message });

    // CORRECTION 1 : FORBIDDEN retourne 404 et non 403
    // Un 403 confirme que la notification existe mais est interdite
    // Un 404 ne révèle rien — anti-énumération des notifications
    if (error.message === "FORBIDDEN")
      return res.status(404).json({ error: "Notification introuvable" });
  }

  console.error("[notification]", error);
  return res.status(500).json({ error: "Erreur interne du serveur" });
};

export const GetMyNotificationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const notifications = await GetMyNotifications(
      req.user!.id,
      req.user!.role
    );
    return res.status(200).json(notifications);
  } catch (error) {
    return handleError(res, error);
  }
};

export const MarkAsReadController = async (req: Request, res: Response) => {
  // CORRECTION 2 : parseId renforcé — Number.isInteger exclut les décimaux
  // isNaN(Number("1.5")) = false alors que 1.5 n'est pas un ID valide
  const notificationId = Number(req.params.id);

  if (!Number.isInteger(notificationId) || notificationId <= 0) {
    return res.status(400).json({ error: "Identifiant invalide" });
  }

  try {
    const notification = await MarkAsRead(
      notificationId,
      req.user!.id,
      req.user!.role
    );
    return res.status(200).json({
      message:      "Notification marquée comme lue",
      notification,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// CORRECTION 3 : req.user! avec ! — req.user est garanti par verifyToken
// mais TypeScript ne le sait pas sans l'assertion
// La version originale utilisait req.user sans ! — warning TypeScript potentiel
export const MarkAllAsReadController = async (
  req: Request,
  res: Response
) => {
  try {
    await MarkAllAsRead(req.user!.id, req.user!.role);
    return res.status(200).json({
      message: "Toutes les notifications marquées comme lues",
    });
  } catch (error) {
    return handleError(res, error);
  }
};