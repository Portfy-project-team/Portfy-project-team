import { z } from "zod";

// CORRECTION : .strict() ajouté — anti-mass assignment
// Sans .strict(), un étudiant peut envoyer scoreCredibilite ou studentId
// dans le body et potentiellement les injecter via le spread ...data dans upsert
export const updatePortfolioSettingsSchema = z
  .object({
    objective:  z.string().trim().max(1000, "Objectif trop long").optional(),
    visibilite: z.enum(["PUBLIC", "PRIVATE", "LINK_ONLY"], {
      errorMap: () => ({
        message: "Visibilité invalide. Valeurs acceptées : PUBLIC, PRIVATE, LINK_ONLY",
      }),
    }).optional(),
  })
  .strict();

export type UpdatePortfolioSettingsInput = z.infer<typeof updatePortfolioSettingsSchema>;