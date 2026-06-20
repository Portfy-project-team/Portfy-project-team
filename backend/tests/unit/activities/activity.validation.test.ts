import {
  createActivitySchema,
  updateActivitySchema,
} from "../../../src/modules/activities/activity.validation";

describe("Activity Validation", () => {

  describe("createActivitySchema", () => {

    it("ATV-U01 : nom seul valide → succès", () => {
      expect(createActivitySchema.safeParse({ nom: "Hackathon 2024" }).success).toBe(true);
    });

    it("ATV-U02 : tous les champs valides → succès", () => {
      expect(createActivitySchema.safeParse({
        nom:            "Club Informatique",
        description:    "Club de l'ENSA",
        type:           "Club",
        attestationUrl: "https://example.com/att.pdf",
      }).success).toBe(true);
    });

    it("ATV-U03 : nom manquant → échec", () => {
      expect(createActivitySchema.safeParse({ type: "Sport" }).success).toBe(false);
    });

    it("ATV-U04 : nom trop court (< 3) → échec", () => {
      expect(createActivitySchema.safeParse({ nom: "AB" }).success).toBe(false);
    });

    it("ATV-U05 : nom trop long (> 150) → échec", () => {
      expect(createActivitySchema.safeParse({ nom: "a".repeat(151) }).success).toBe(false);
    });

    it("ATV-U06 : URL invalide → échec", () => {
      expect(createActivitySchema.safeParse({ nom: "Test", attestationUrl: "pas-une-url" }).success).toBe(false);
    });

    it("ATV-U07 : description trop longue (> 2000) → échec", () => {
      expect(createActivitySchema.safeParse({ nom: "Test", description: "a".repeat(2001) }).success).toBe(false);
    });

    it("ATV-U08 : champ inconnu (strict) → échec", () => {
      expect(createActivitySchema.safeParse({ nom: "Test", champInconnu: "x" }).success).toBe(false);
    });
  });

  describe("updateActivitySchema", () => {

    it("ATV-U09 : objet vide → succès (tout optionnel)", () => {
      expect(updateActivitySchema.safeParse({}).success).toBe(true);
    });

    it("ATV-U10 : nom seul → succès", () => {
      expect(updateActivitySchema.safeParse({ nom: "Nouveau nom" }).success).toBe(true);
    });
  });
});