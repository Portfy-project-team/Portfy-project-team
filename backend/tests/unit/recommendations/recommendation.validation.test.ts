import { createRecommendationSchema } from "../../../src/modules/recommendations/recommendation.validation";

describe("Recommendation Validation", () => {

  it("RCV-U01 : payload valide → succès", () => {
    expect(createRecommendationSchema.safeParse({
      portfolioId: 1,
      message:     "Je recommande vivement cet étudiant sérieux.",
    }).success).toBe(true);
  });

  it("RCV-U02 : portfolioId manquant → échec", () => {
    expect(createRecommendationSchema.safeParse({ message: "Bon profil." }).success).toBe(false);
  });

  it("RCV-U03 : message manquant → échec", () => {
    expect(createRecommendationSchema.safeParse({ portfolioId: 1 }).success).toBe(false);
  });

  it("RCV-U04 : message trop court (< 10) → échec", () => {
    expect(createRecommendationSchema.safeParse({ portfolioId: 1, message: "Bien." }).success).toBe(false);
  });

  it("RCV-U05 : message trop long (> 2000) → échec", () => {
    expect(createRecommendationSchema.safeParse({ portfolioId: 1, message: "a".repeat(2001) }).success).toBe(false);
  });

  it("RCV-U06 : portfolioId négatif → échec", () => {
    expect(createRecommendationSchema.safeParse({ portfolioId: -1, message: "Bon étudiant sérieux." }).success).toBe(false);
  });

  it("RCV-U07 : champ inconnu (strict) → échec", () => {
    expect(createRecommendationSchema.safeParse({ portfolioId: 1, message: "Bon étudiant.", extra: "x" }).success).toBe(false);
  });
});