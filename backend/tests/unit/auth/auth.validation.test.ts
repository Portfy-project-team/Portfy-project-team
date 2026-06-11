import { registerSchema } from "../../../src/modules/auth/auth.validation.js";

describe("Auth Validation", () => {

  describe("registerSchema", () => {

    it("should validate correct register data", () => {
      const data = {
        email: "test@test.com",
        password: "Password123!",
        role: "STUDENT",
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const data = {
        email: "invalid-email",
        password: "Password123!",
        role: "STUDENT",
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

    it("should reject weak password", () => {
      const data = {
        email: "test@test.com",
        password: "123",
        role: "STUDENT",
      };

      const result = registerSchema.safeParse(data);

      expect(result.success).toBe(false);
    });

  });

});
