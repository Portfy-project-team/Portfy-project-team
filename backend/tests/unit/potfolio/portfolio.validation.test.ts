import { updatePortfolioSettingsSchema } from "../../../src/modules/portfolio/portfolio.validation";

describe("Portfolio Validation", () => {

  describe("updatePortfolioSettingsSchema", () => {

    it("should validate correct settings data", () => {
      const data = {
        objective: "Devenir développeur fullstack",
        visibilite: "PUBLIC",
      };

      const result = updatePortfolioSettingsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate with only objective", () => {
      const data = {
        objective: "Mon objectif",
      };

      const result = updatePortfolioSettingsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate with only visibilite", () => {
      const data = {
        visibilite: "PRIVATE",
      };

      const result = updatePortfolioSettingsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate LINK_ONLY visibilite", () => {
      const data = {
        visibilite: "LINK_ONLY",
      };

      const result = updatePortfolioSettingsSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate empty object", () => {
      const result = updatePortfolioSettingsSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("should reject invalid visibilite value", () => {
      const data = {
        visibilite: "INVALID",
      };

      const result = updatePortfolioSettingsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject objective too long", () => {
      const data = {
        objective: "a".repeat(1001),
      };

      const result = updatePortfolioSettingsSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

  });

});
