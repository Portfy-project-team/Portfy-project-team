import { z } from 'zod';

export const updateStudentSchema = z.object({
  nom: z.string().optional(),
  prenom: z.string().optional(),
  filiere: z.string().optional(),
      bio:z.string().max(500).optional(),

  skills: z
    .array(
      z.object({
        skillId: z.number(),
        niveau: z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"]).optional(),
      })
    )
    .max(20)
    .optional(),});

export const updateProfSchema = z.object({
  nom: z.string().optional(),
  prenom: z.string().optional(),
  departement: z.string().optional(),
  specialite: z.string().optional(),
});

export const updateProfessionnelSchema = z.object({
  nom: z.string().optional(),
  prenom: z.string().optional(),
  entreprise: z.string().optional(),
  poste: z.string().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type UpdateProfInput = z.infer<typeof updateProfSchema>;
export type UpdateProfessionnelInput = z.infer<typeof updateProfessionnelSchema>;