import { z } from "zod";

export const StageSchema = z
  .object({
    entreprise: z
      .string()
      .trim()
      .min(1,   "Entreprise requise")
      .max(150, "Nom entreprise trop long"),

    mission: z
      .string()
      .trim()
      .max(2000, "Mission trop longue")
      .optional(),

    technologies: z
      .array(z.string().trim().max(50, "Technologie trop longue"))
      .max(20, "Maximum 20 technologies")
      .optional(),

    dateDebut: z.coerce.date({ required_error: "Date de début requise" }),
    dateFin:   z.coerce.date({ required_error: "Date de fin requise" }),

    rapportUrl: z
      .string()
      .trim()
      .url("URL de rapport invalide")
      .max(500, "URL trop longue")
      .optional(),

    encadrantId: z
      .number({ required_error: "Encadrant académique requis" })
      .int("encadrantId doit être un entier")
      .positive("encadrantId invalide"),
  })
  .strict()
  .refine(
    (data) => data.dateFin > data.dateDebut,
    {
      message: "La date de fin doit être après la date de début",
      path:    ["dateFin"],
    }
  );

export const UpdateStageSchema = z
  .object({
    entreprise: z
      .string()
      .trim()
      .min(1)
      .max(150, "Nom entreprise trop long")
      .optional(),

    mission: z
      .string()
      .trim()
      .max(2000, "Mission trop longue")
      .optional(),

    technologies: z
      .array(z.string().trim().max(50, "Technologie trop longue"))
      .max(20, "Maximum 20 technologies")
      .optional(),

    dateDebut: z.coerce.date().optional(),
    dateFin:   z.coerce.date().optional(),

    rapportUrl: z
      .string()
      .trim()
      .url("URL de rapport invalide")
      .max(500, "URL trop longue")
      .optional(),

    encadrantId: z
      .number()
      .int("encadrantId doit être un entier")
      .positive("encadrantId invalide")
      .optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.dateDebut && data.dateFin) {
        return data.dateFin > data.dateDebut;
      }
      return true;
    },
    {
      message: "La date de fin doit être après la date de début",
      path:    ["dateFin"],
    }
  );

export type StageInput       = z.infer<typeof StageSchema>;
export type UpdateStageInput = z.infer<typeof UpdateStageSchema>;