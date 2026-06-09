import { Request, Response, NextFunction } from "express";
import {
  AjouterUserSchema,
  listUsersQuerySchema,
  RejectUserSchema,
  updateStatusSchema,
  updateUserSchema,
} from "./admin.validation.js";
import { AdminServices } from "./admin.service.js";
import { prisma } from "../../utils/prisma.js";
import { UserStatus } from "@prisma/client";

// Helper — valider et parser un ID entier positif depuis req.params
const parseId = (value: string): number | null => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

// CORRECTION 1 : remplacement de .parse() par .safeParse() partout
// .parse() lève une exception Zod qui part dans next(err) sans distinction
// avec les erreurs serveur. .safeParse() permet de retourner 400 explicitement
// avec les erreurs de validation structurées par champ.

export const AjouterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = AjouterUserSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where:  { email: parsed.data.email },
      select: { id: true },
    });

    if (existingUser) {
      res.status(409).json({ message: "Inscription impossible" });
      return;
    }

    const user = await AdminServices.AjouterUser(parsed.data);
    res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsed = listUsersQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({
      message: "Paramètres invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const users = await AdminServices.getAllUsers(parsed.data);
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // CORRECTION 2 : parseId sécurisé — Number("abc") = NaN mais aussi
  // Number("1.5") = 1.5 qui n'est pas un entier valide comme ID Prisma
  const id = parseId(req.params.id);

  if (!id) {
    res.status(400).json({ message: "Id utilisateur invalide" });
    return;
  }

  try {
    const userExists = await prisma.user.findUnique({
      where:  { id },
      select: { id: true },
    });

    if (!userExists) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }

    await AdminServices.deleteUser(id);
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseId(req.params.id);

  if (!id) {
    res.status(400).json({ message: "Id utilisateur invalide" });
    return;
  }

  const parsed = updateUserSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const userExists = await prisma.user.findUnique({
      where:  { id },
      select: { id: true },
    });

    if (!userExists) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }

    const updatedUser = await AdminServices.updateUser(id, parsed.data);
    res.json({ message: "Utilisateur modifié", user: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseId(req.params.id);

  if (!id) {
    res.status(400).json({ message: "Id utilisateur invalide" });
    return;
  }

  const parsed = updateStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const userExists = await prisma.user.findUnique({
      where:  { id },
      select: { id: true, status: true },
    });

    if (!userExists) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }

    if (userExists.status === parsed.data.status) {
      res.status(409).json({
        message: `L'utilisateur est déjà ${parsed.data.status}`,
      });
      return;
    }

    const user = await AdminServices.updateUserStatus(
      id,
      parsed.data.status as UserStatus
    );
    res.json({ message: `Statut mis à jour`, user });
  } catch (err) {
    next(err);
  }
};

export const approveUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseId(req.params.id);

  if (!id) {
    res.status(400).json({ message: "Id utilisateur invalide" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where:  { id },
      select: { id: true, status: true },
    });

    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }

    if (user.status !== UserStatus.PENDING) {
      res.status(409).json({
        message: "Seuls les comptes en attente peuvent être approuvés",
      });
      return;
    }

    const updatedUser = await AdminServices.approveUser(id);
    res.json({ message: "Utilisateur approuvé", user: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const rejectUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = parseId(req.params.id);

  if (!id) {
    res.status(400).json({ message: "Id utilisateur invalide" });
    return;
  }

  const parsed = RejectUserSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where:  { id },
      select: { id: true, status: true },
    });

    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable" });
      return;
    }

    if (user.status !== UserStatus.PENDING) {
      res.status(409).json({
        message: "Seuls les comptes en attente peuvent être rejetés",
      });
      return;
    }

    const rejectedUser = await AdminServices.rejectUser(id, parsed.data.reason);
    res.json({
      message: "Utilisateur rejeté",
      reason:  parsed.data.reason,
      user:    rejectedUser,
    });
  } catch (err) {
    next(err);
  }
};