import { z } from "zod";

export const createRecommendationSchema = z.object({
  portfolioId: z
    .number({ required_error: "portfolioId est requis" })
    .int()
    .positive(),
  message: z
    .string({ required_error: "Le message est requis" })
    .trim()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(2000, "Le message est trop long"),
}).strict();

export type CreateRecommendationInput = z.infer<typeof createRecommendationSchema>;