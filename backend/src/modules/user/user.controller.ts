import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { Role } from "@prisma/client";
import { ZodError } from "zod";
import {
  changePasswordSchema,
  updateProfSchema,
  updateProfessionnelSchema,
  updateStudentSchema,
} from "./user.validation.js";
import { prisma } from "../../utils/prisma.js";



export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const profile = await UserService.getFullProfile(req.user.id);
    res.status(200).json({ user: profile });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = changePasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    await UserService.changePassword(req.user.id, parsed.data);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.user;

    let profileData;

    switch (role) {
      case Role.STUDENT: {
        profileData = updateStudentSchema.parse(req.body);
        await UserService.upsertStudentProfile(req.user.id, profileData);
        break;
      }
      case Role.PROF: {
        profileData = updateProfSchema.parse(req.body);
        await UserService.upsertProfessorProfile(req.user.id, profileData);
        break;
      }
      case Role.PRO: {
        profileData = updateProfessionnelSchema.parse(req.body);
        await UserService.upsertCompanyProfile(req.user.id, profileData);
        break;
      }
      default: {
        res.status(400).json({ message: "This account has no specialized profile" });
        return;
      }
    }

    const fullProfile = await UserService.getFullProfile(req.user.id);
    res.json({
      message: "Profile updated successfully",
      user:    fullProfile,
    });
  } catch (err) {
    if (err instanceof ZodError) {
      res.status(400).json({
        message: "Données invalides",
        errors:  err.flatten().fieldErrors,
      });
      return;
    }
    next(err);
  }
};

export const getSkills = async (req: Request, res: Response) => {
  const skills = await prisma.skill.findMany();
  res.json(skills);
};

//  NOUVELLE FONCTION - UPLOAD AVATAR

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Vérifier si un fichier a été envoyé
    if (!req.file) {
      res.status(400).json({ message: "Veuillez sélectionner une image" });
      return;
    }

    // Appeler le service pour traiter l'upload
    const result = await UserService.uploadAvatar(req.user.id, req.file.path);

    // Réponse de succès
    res.json({
      message: "Photo de profil mise à jour avec succès",
      avatarUrl: result.avatarUrl,
    });
  } catch (err) {
    next(err);
  }
};