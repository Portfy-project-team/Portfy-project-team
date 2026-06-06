import { z } from "zod";

export const createActivitySchema = z.object({
  nom: z
    .string({ required_error: "Le nom est requis" })
    .trim()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(150, "Le nom est trop long"),

  description: z
    .string()
    .trim()
    .max(2000, "La description est trop longue")
    .optional(),

  type: z
    .string()
    .trim()
    .min(2, "Le type est trop court")
    .max(100, "Le type est trop long")
    .optional(),

  attestationUrl: z
    .string()
    .trim()
    .url("URL attestation invalide")
    .max(500, "URL trop longue")
    .optional(),
}).strict();

export const updateActivitySchema = createActivitySchema.partial().strict();

export const rejectActivitySchema = z.object({
  reason: z
    .string()
    .trim()
    .max(1000, "La raison est trop longue")
    .optional(),
}).strict();

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;