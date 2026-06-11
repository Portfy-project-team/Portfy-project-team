import { z } from "zod";

export const createLetterSchema = z
  .object({
    studentId: z
      .number({ required_error: "studentId est requis" })
      .int("studentId doit être un entier")
      .positive("studentId invalide"),

    type: z
      .string()
      .trim()
      .min(3, "Le type doit contenir au moins 3 caractères")
      .max(100, "Le type est trop long")
      .optional(),

    contenu: z
      .string({ required_error: "Le contenu est requis" })
      .trim()
      .min(10, "Le contenu doit contenir au moins 10 caractères")
      .max(5000, "Le contenu est trop long"),
  })
  .strict();

export const updateLetterVisibilitySchema = z
  .object({
    visibilite: z.enum(["PUBLIC", "PRIVATE", "DOWNLOADABLE"], {
      errorMap: () => ({
        message: "Visibilité invalide. Valeurs acceptées : PUBLIC, PRIVATE, DOWNLOADABLE",
      }),
    }),
  })
  .strict();

export type CreateLetterInput = z.infer<typeof createLetterSchema>;
export type UpdateLetterVisibilityInput = z.infer<
  typeof updateLetterVisibilitySchema
>;