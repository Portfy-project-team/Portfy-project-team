import {
  createUserSchema,
  updateUserSchema,
} from "../../../src/modules/admin/admin.validation";

describe("Admin Validation", () => {

  describe("createUserSchema", () => {

    it("should validate correct user data", () => {

      const data = {
        name: "Kholoud",
        email: "kholoud@test.com",
        password: "Password123!",
        role: "ADMIN",
      };

      const result = createUserSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {

      const data = {
        name: "Kholoud",
        email: "invalid-email",
        password: "Password123!",
        role: "ADMIN",
      };

      const result = createUserSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

  });

  describe("updateUserSchema", () => {

    it("should validate update data", () => {

      const data = {
        name: "Updated Name",
      };

      const result = updateUserSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

  });

});