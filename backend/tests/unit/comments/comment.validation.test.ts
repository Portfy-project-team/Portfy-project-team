import { createCommentSchema } from "../../../src/modules/comments/comment.validation";

describe("Comment Validation", () => {

  it("CMV-U01 : payload valide → succès", () => {
    expect(createCommentSchema.safeParse({ portfolioId: 1, contenu: "Excellent portfolio !" }).success).toBe(true);
  });

  it("CMV-U02 : avec projetId → succès", () => {
    expect(createCommentSchema.safeParse({ portfolioId: 1, projetId: 5, contenu: "Bon projet aussi." }).success).toBe(true);
  });

  it("CMV-U03 : portfolioId manquant → échec", () => {
    expect(createCommentSchema.safeParse({ contenu: "Sans portfolio." }).success).toBe(false);
  });

  it("CMV-U04 : contenu manquant → échec", () => {
    expect(createCommentSchema.safeParse({ portfolioId: 1 }).success).toBe(false);
  });

  it("CMV-U05 : contenu trop court (< 5) → échec", () => {
    expect(createCommentSchema.safeParse({ portfolioId: 1, contenu: "Hi" }).success).toBe(false);
  });

  it("CMV-U06 : contenu trop long (> 2000) → échec", () => {
    expect(createCommentSchema.safeParse({ portfolioId: 1, contenu: "a".repeat(2001) }).success).toBe(false);
  });

  it("CMV-U07 : portfolioId négatif → échec", () => {
    expect(createCommentSchema.safeParse({ portfolioId: -1, contenu: "Test valide." }).success).toBe(false);
  });

  it("CMV-U08 : champ inconnu (strict) → échec", () => {
    expect(createCommentSchema.safeParse({ portfolioId: 1, contenu: "Test.", extra: "x" }).success).toBe(false);
  });
});