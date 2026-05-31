import { z } from "zod";

export const updatePortfolioSettingsSchema = z.object({
  objective:  z.string().max(1000).optional(),
  visibilite: z.enum(["PUBLIC", "PRIVATE", "LINK_ONLY"]).optional(),
});

export type UpdatePortfolioSettingsInput = z.infer<typeof updatePortfolioSettingsSchema>;