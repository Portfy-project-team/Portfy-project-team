import { z } from "zod";

export const createCommentSchema = z.object({
  portfolioId: z
    .number({ required_error: "portfolioId est requis" })
    .int()
    .positive(),
  projetId: z.number().int().positive().optional(),
  contenu: z
    .string({ required_error: "Le contenu est requis" })
    .trim()
    .min(5,  "Le contenu doit contenir au moins 5 caractères")
    .max(2000, "Le contenu est trop long"),
}).strict();

export type CreateCommentInput = z.infer<typeof createCommentSchema>;