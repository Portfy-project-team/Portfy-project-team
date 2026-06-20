import {
  createStudentSkillSchema,
  updateStudentSkillSchema,
} from "../../../src/modules/skills/skill.validation";

describe("Skill Validation", () => {

  describe("createStudentSkillSchema", () => {

    it("SKV-U01 : nom seul → succès (niveau DEBUTANT par défaut)", () => {
      expect(createStudentSkillSchema.safeParse({ nom: "JavaScript" }).success).toBe(true);
    });

    it("SKV-U02 : tous les champs valides → succès", () => {
      expect(createStudentSkillSchema.safeParse({
        nom:      "React",
        categorie: "Frontend",
        niveau:   "AVANCE",
      }).success).toBe(true);
    });

    it("SKV-U03 : nom manquant → échec", () => {
      expect(createStudentSkillSchema.safeParse({ categorie: "Frontend" }).success).toBe(false);
    });

    it("SKV-U04 : nom trop court (< 2) → échec", () => {
      expect(createStudentSkillSchema.safeParse({ nom: "A" }).success).toBe(false);
    });

    it("SKV-U05 : nom trop long (> 100) → échec", () => {
      expect(createStudentSkillSchema.safeParse({ nom: "a".repeat(101) }).success).toBe(false);
    });

    it("SKV-U06 : niveau invalide → échec", () => {
      expect(createStudentSkillSchema.safeParse({ nom: "Python", niveau: "NINJA" }).success).toBe(false);
    });

    it("SKV-U07 : tous les niveaux valides acceptés", () => {
      const niveaux = ["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"];
      niveaux.forEach((n) => {
        expect(createStudentSkillSchema.safeParse({ nom: "Test", niveau: n }).success).toBe(true);
      });
    });

    it("SKV-U08 : champ inconnu (strict) → échec", () => {
      expect(createStudentSkillSchema.safeParse({ nom: "Test", extra: "x" }).success).toBe(false);
    });
  });

  describe("updateStudentSkillSchema", () => {

    it("SKV-U09 : niveau EXPERT → succès", () => {
      expect(updateStudentSkillSchema.safeParse({ niveau: "EXPERT" }).success).toBe(true);
    });

    it("SKV-U10 : niveau invalide → échec", () => {
      expect(updateStudentSkillSchema.safeParse({ niveau: "SUPER" }).success).toBe(false);
    });

    it("SKV-U11 : niveau manquant → échec (requis)", () => {
      expect(updateStudentSkillSchema.safeParse({}).success).toBe(false);
    });
  });
});