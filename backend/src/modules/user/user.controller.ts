import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { Role } from "@prisma/client";
import {
  changePasswordSchema,
  updateProfSchema,
  updateProfessionnelSchema,
  updateStudentSchema,
} from "./user.validation.js";
import { prisma } from "../../utils/prisma.js";

// export const getMe = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const profile = await UserService.getFullProfile(req.user!.id);
//     res.status(200).json({ user: profile });
//   } catch (err) {
//     next(err);
//   }
// };
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await UserService.getFullProfile(req.user!.id);

    if (!profile) {
      res.status(404).json({ message: "Profil introuvable" });
      return;
    }

    res.status(200).json({ user: profile });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const parsed = changePasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    await UserService.changePassword(req.user!.id, parsed.data);
    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (err) {
    // CORRECTION 1 : erreurs métier connues gérées explicitement
    // au lieu de tout envoyer dans next(err) qui retourne 500
    if (err instanceof Error) {
      const knownErrors: Record<string, number> = {
        "Mot de passe actuel incorrect":       401,
        "Utilisez Google pour vous connecter": 403,
        "Utilisateur introuvable":             404,
      };
      const status = knownErrors[err.message];
      if (status) {
        res.status(status).json({ message: err.message });
        return;
      }
    }
    next(err);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // CORRECTION 2 : .parse() remplacé par .safeParse() dans chaque case
  // La version originale utilisait encore .parse() qui lève une exception Zod
  // capturée par le instanceof ZodError en bas — mais le status code retourné
  // était correct. Avec safeParse on contrôle explicitement le flow.
  try {
    const { role } = req.user!;

    switch (role) {
      case Role.STUDENT: {
        const parsed = updateStudentSchema.safeParse(req.body);
        if (!parsed.success) {
          res.status(400).json({
            message: "Données invalides",
            errors:  parsed.error.flatten().fieldErrors,
          });
          return;
        }
        await UserService.upsertStudentProfile(req.user!.id, parsed.data);
        break;
      }
      case Role.PROF: {
        const parsed = updateProfSchema.safeParse(req.body);
        if (!parsed.success) {
          res.status(400).json({
            message: "Données invalides",
            errors:  parsed.error.flatten().fieldErrors,
          });
          return;
        }
        await UserService.upsertProfessorProfile(req.user!.id, parsed.data);
        break;
      }
      case Role.PRO: {
        const parsed = updateProfessionnelSchema.safeParse(req.body);
        if (!parsed.success) {
          res.status(400).json({
            message: "Données invalides",
            errors:  parsed.error.flatten().fieldErrors,
          });
          return;
        }
        await UserService.upsertCompanyProfile(req.user!.id, parsed.data);
        break;
      }
      default: {
        res.status(400).json({ message: "Ce compte n'a pas de profil spécialisé" });
        return;
      }
    }

    const fullProfile = await UserService.getFullProfile(req.user!.id);
    res.json({ message: "Profil mis à jour avec succès", user: fullProfile });
  } catch (err) {
    next(err);
  }
};

// CORRECTION 3 : getSkills — ajout try/catch et select explicite
export const getSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const skills = await prisma.skill.findMany({
      select:  { id: true, nom: true, categorie: true },
      orderBy: { nom: "asc" },
    });
    res.json({ skills });
  } catch (err) {
    next(err);
  }
};

export const uploadAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Veuillez sélectionner une image" });
      return;
    }

    const result = await UserService.uploadAvatar(req.user!.id, req.file.path);

    res.json({
      message:   "Photo de profil mise à jour avec succès",
      avatarUrl: result.avatarUrl,
    });
  } catch (err) {
    next(err);
  }
};