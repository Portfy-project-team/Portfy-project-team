import { z } from 'zod';

export const updateStudentSchema = z.object({
  nom: z.string().trim().optional(),
  prenom: z.string().trim().optional(),
  filiere: z.string().trim().optional(),
  bio: z.string().trim().max(500).optional(),
  formationType: z.string().trim().optional(),
  niveau: z.string().trim().optional(),
  anneeEntree: z.coerce.number().int().optional(),
  diplomePrevu: z.coerce.number().int().optional(),
  disponibilite: z.string().trim().optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  etablissement: z.string().trim().optional(),
  skillsTexte: z.string().optional(),
    avatarUrl: z.string().url().optional().or(z.literal("")),
  skills: z
    .array(
      z.object({
        skillId: z.number(),
        niveau: z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"]).optional(),
      })
    )
    .max(20)
    .optional(),
});

export const updateProfSchema = z.object({
  nom: z.string().trim().optional(),
  prenom: z.string().trim().optional(),
  departement: z.string().trim().optional(),
  specialite: z.string().trim().optional(),
  bio: z.string().trim().max(500).optional(),
  linkedin: z.string().url().optional().or(z.literal("")),
  etablissement: z.string().trim().optional(),
    avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const updateProfessionnelSchema = z.object({
  nom: z.string().trim().optional(),
  prenom: z.string().trim().optional(),
  entreprise: z.string().trim().optional(),
  poste: z.string().trim().optional(),
  secteur: z.string().trim().optional(),
  localisation: z.string().trim().optional(),
  descriptionEntreprise: z.string().trim().max(1000).optional(),
  siteEntreprise: z.string().url().optional().or(z.literal("")),
    avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type UpdateProfInput = z.infer<typeof updateProfSchema>;
export type UpdateProfessionnelInput = z.infer<typeof updateProfessionnelSchema>;