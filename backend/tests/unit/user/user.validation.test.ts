import {
  updateStudentSchema,
  updateProfSchema,
  updateProfessionnelSchema,
  changePasswordSchema,
} from "../../../src/modules/user/user.validation";

describe("User Validation", () => {

  describe("updateStudentSchema", () => {

    it("UV-U01 : objet vide → succès", () => {
      expect(updateStudentSchema.safeParse({}).success).toBe(true);
    });

    it("UV-U02 : nom seul → succès", () => {
      expect(updateStudentSchema.safeParse({ nom: "Jean" }).success).toBe(true);
    });

    it("UV-U03 : bio trop longue (> 500) → échec", () => {
      expect(updateStudentSchema.safeParse({ bio: "a".repeat(501) }).success).toBe(false);
    });

    it("UV-U04 : skills valides → succès", () => {
      expect(updateStudentSchema.safeParse({
        skills: [{ skillId: 1, niveau: "AVANCE" }],
      }).success).toBe(true);
    });

    it("UV-U05 : niveau de skill invalide → échec", () => {
      expect(updateStudentSchema.safeParse({
        skills: [{ skillId: 1, niveau: "NINJA" }],
      }).success).toBe(false);
    });

    it("UV-U06 : trop de skills (> 20) → échec", () => {
      const skills = Array.from({ length: 21 }, (_, i) => ({ skillId: i + 1 }));
      expect(updateStudentSchema.safeParse({ skills }).success).toBe(false);
    });
  });

  describe("updateProfSchema", () => {

    it("UV-U07 : objet vide → succès", () => {
      expect(updateProfSchema.safeParse({}).success).toBe(true);
    });

    it("UV-U08 : departement seul → succès", () => {
      expect(updateProfSchema.safeParse({ departement: "Informatique" }).success).toBe(true);
    });
  });

  describe("updateProfessionnelSchema", () => {

    it("UV-U09 : objet vide → succès", () => {
      expect(updateProfessionnelSchema.safeParse({}).success).toBe(true);
    });

    it("UV-U10 : entreprise seule → succès", () => {
      expect(updateProfessionnelSchema.safeParse({ entreprise: "Google" }).success).toBe(true);
    });
  });

  describe("changePasswordSchema", () => {

    it("UV-U11 : payload valide → succès", () => {
      expect(changePasswordSchema.safeParse({
        currentPassword: "OldPass123!",
        newPassword:     "NewPass456!",  // 11 chars, majuscule + chiffre + spécial
      }).success).toBe(true);
    });

    it("UV-U12 : currentPassword manquant → échec", () => {
      expect(changePasswordSchema.safeParse({
        newPassword: "NewPass456!",
      }).success).toBe(false);
    });

    it("UV-U13 : newPassword trop court (< 8) → échec", () => {
      expect(changePasswordSchema.safeParse({
        currentPassword: "OldPass123!",
        newPassword:     "Ab1!",
      }).success).toBe(false);
    });

    it("UV-U14 : newPassword sans majuscule → échec", () => {
      expect(changePasswordSchema.safeParse({
        currentPassword: "OldPass123!",
        newPassword:     "newpass123!",
      }).success).toBe(false);
    });

    it("UV-U15 : newPassword sans chiffre → échec", () => {
      expect(changePasswordSchema.safeParse({
        currentPassword: "OldPass123!",
        newPassword:     "NewPassword!",
      }).success).toBe(false);
    });

    it("UV-U16 : objet vide → échec", () => {
      expect(changePasswordSchema.safeParse({}).success).toBe(false);
    });
  });
});