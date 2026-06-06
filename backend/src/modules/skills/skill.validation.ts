import { z } from "zod";

export const createStudentSkillSchema = z.object({
  nom: z
    .string({ required_error: "Le nom de la compétence est requis" })
    .trim()
    .min(2, "Le nom est trop court")
    .max(100, "Le nom est trop long"),

  categorie: z
    .string()
    .trim()
    .min(2, "La catégorie est trop courte")
    .max(100, "La catégorie est trop longue")
    .optional(),

  niveau: z
    .enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"])
    .optional(),
}).strict();

export const updateStudentSkillSchema = z.object({
  niveau: z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"]),
}).strict();

export type CreateStudentSkillInput = z.infer<typeof createStudentSkillSchema>;
export type UpdateStudentSkillInput = z.infer<typeof updateStudentSkillSchema>;