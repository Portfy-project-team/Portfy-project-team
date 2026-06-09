import { z } from "zod";

export const StageSchema = z.object({
  entreprise:   z.string().min(1, "Entreprise requise"),
  mission:      z.string().optional(),
  technologies: z.array(z.string()).optional(),
  dateDebut:    z.coerce.date({ required_error: "Date de début requise" }),
  dateFin:      z.coerce.date({ required_error: "Date de fin requise" }),
  rapportUrl:    z.string().url().optional(),
  encadrantId:  z.number({ required_error: "Encadrant académique requis" }),

}).refine(
  (data) => data.dateFin > data.dateDebut,
  { message: "La date de fin doit être après la date de début",
    path:["dateFin"]
   }
);

export const UpdateStageSchema = z.object({
  entreprise: z.string().min(1).optional(),
  mission: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  dateDebut: z.coerce.date().optional(),
  dateFin: z.coerce.date().optional(),
  reportUrl: z.string().url().optional(),
});

export type StageInput = z.infer<typeof StageSchema>;