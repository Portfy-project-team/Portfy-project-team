import { z } from "zod";

// CORRECTION 1 : .strict() sur tous les schémas — anti-mass assignment
// CORRECTION 2 : limites max sur les champs texte — sans limite un attaquant
//                peut envoyer des strings de plusieurs Mo
// CORRECTION 3 : changePasswordSchema renforcé — newPassword aligné avec
//                la politique de mot de passe du projet (min 12 + complexité)

export const updateStudentSchema = z.object({
  nom:     z.string().trim().max(80,  "Nom trop long").optional(),
  prenom:  z.string().trim().max(80,  "Prénom trop long").optional(),
  filiere: z.string().trim().max(150, "Filière trop longue").optional(),
  bio:     z.string().trim().max(500, "Bio trop longue").optional(),
  skills: z
    .array(
      z.object({
        skillId: z.number().int().positive("skillId invalide"),
        niveau:  z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"]).optional(),
      })
    )
    .max(20, "Maximum 20 compétences")
    .optional(),
}).strict();

export const updateProfSchema = z.object({
  nom:         z.string().trim().max(80,  "Nom trop long").optional(),
  prenom:      z.string().trim().max(80,  "Prénom trop long").optional(),
  departement: z.string().trim().max(150, "Département trop long").optional(),
  specialite:  z.string().trim().max(150, "Spécialité trop longue").optional(),
}).strict();

export const updateProfessionnelSchema = z.object({
  nom:       z.string().trim().max(80,  "Nom trop long").optional(),
  prenom:    z.string().trim().max(80,  "Prénom trop long").optional(),
  entreprise: z.string().trim().max(150, "Nom entreprise trop long").optional(),
  poste:     z.string().trim().max(150, "Poste trop long").optional(),
}).strict();

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Le mot de passe actuel est requis")
    .max(72),

  newPassword: z
    .string()
    .min(12, "Le nouveau mot de passe doit contenir au moins 12 caractères")
    .max(72, "Le mot de passe ne peut pas dépasser 72 caractères")
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
      "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial"
    ),
}).strict();

export type ChangePasswordInput       = z.infer<typeof changePasswordSchema>;
export type UpdateStudentInput        = z.infer<typeof updateStudentSchema>;
export type UpdateProfInput           = z.infer<typeof updateProfSchema>;
export type UpdateProfessionnelInput  = z.infer<typeof updateProfessionnelSchema>;