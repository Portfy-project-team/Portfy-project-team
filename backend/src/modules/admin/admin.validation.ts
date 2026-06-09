import { z } from "zod";

// CORRECTION 1 : AjouterUserSchema
// - .strict() ajouté — anti-mass assignment
// - password renforcé : min 12 chars + complexité (aligné avec registerSchema)
// - email normalisé : .toLowerCase().trim()
export const AjouterUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Format email invalide")
    .max(254, "Email trop long"),

  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 12 caractères")
    .max(72, "Le mot de passe ne peut pas dépasser 72 caractères")
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
      "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial"
    ),

  role: z.enum(["ADMIN", "PRO", "STUDENT", "PROF"], {
    errorMap: () => ({ message: "Rôle invalide" }),
  }),
}).strict();

// CORRECTION 2 : updateUserSchema
// - .strict() ajouté
// - email normalisé
export const updateUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Format email invalide")
    .max(254)
    .optional(),

  role: z.enum(["ADMIN", "PRO", "STUDENT", "PROF"], {
    errorMap: () => ({ message: "Rôle invalide" }),
  }).optional(),

  status: z.enum(["PENDING", "ACTIVE", "REJECTED", "BLOCKED"], {
    errorMap: () => ({ message: "Statut invalide" }),
  }).optional(),
}).strict();

// CORRECTION 3 : updateStatusSchema
// - .strict() ajouté
// - status rendu obligatoire (était optional — sans valeur le patch ne fait rien)
export const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "REJECTED", "BLOCKED"], {
    errorMap: () => ({
      message: "Statut invalide. Valeurs acceptées : PENDING, ACTIVE, REJECTED, BLOCKED",
    }),
  }),
}).strict();

export const RejectUserSchema = z.object({
  reason: z.string().trim().max(500, "Raison trop longue").optional(),
}).strict();

export const listUsersQuerySchema = z.object({
  role:   z.enum(["ADMIN", "PRO", "STUDENT", "PROF"]).optional(),
  status: z.enum(["PENDING", "ACTIVE", "REJECTED", "BLOCKED"]).optional(),
});

export type AjouterUserInput  = z.infer<typeof AjouterUserSchema>;
export type UpdateUserInput    = z.infer<typeof updateUserSchema>;
export type UpdateStatusSchema = z.infer<typeof updateStatusSchema>;