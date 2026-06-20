import { registerSchema } from "../../../src/modules/auth/auth.validation";

describe("Auth Validation", () => {

  describe("registerSchema", () => {

    it("should validate correct register data (STUDENT)", () => {
      const data = {
        name:     "Jean",
        prenom:   "Dupont",
        email:    "test@test.com",
        password: "Password123!",
        role:     "STUDENT",
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate correct register data (PROF)", () => {
      const data = {
        name:     "Alice",
        prenom:   "Martin",
        email:    "prof@test.com",
        password: "Password123!",
        role:     "PROF",
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate correct register data (PRO)", () => {
      const data = {
        name:     "Bob",
        prenom:   "Dupont",
        email:    "pro@test.com",
        password: "Password123!",
        role:     "PRO",
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const data = {
        name:     "Jean",
        prenom:   "Dupont",
        email:    "invalid-email",
        password: "Password123!",
        role:     "STUDENT",
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject weak password (too short)", () => {
      const data = {
        name:     "Jean",
        prenom:   "Dupont",
        email:    "test@test.com",
        password: "123",
        role:     "STUDENT",
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject password without uppercase", () => {
      const data = {
        name:     "Jean",
        prenom:   "Dupont",
        email:    "test@test.com",
        password: "password123!",
        role:     "STUDENT",
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject missing name", () => {
      const data = {
        prenom:   "Dupont",
        email:    "test@test.com",
        password: "Password123!",
        role:     "STUDENT",
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject missing prenom", () => {
      const data = {
        name:     "Jean",
        email:    "test@test.com",
        password: "Password123!",
        role:     "STUDENT",
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject invalid role", () => {
      const data = {
        name:     "Jean",
        prenom:   "Dupont",
        email:    "test@test.com",
        password: "Password123!",
        role:     "SUPERUSER",
      };

      const result = registerSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});

// import { registerSchema } from "../../../src/modules/auth/auth.validation";

// describe("Auth Validation", () => {

//   describe("registerSchema", () => {

//     it("should validate correct register data", () => {
//       const data = {
//         email: "test@test.com",
//         password: "Password123!",
//         role: "STUDENT",
//       };

//       const result = registerSchema.safeParse(data);

//       expect(result.success).toBe(true);
//     });

//     it("should reject invalid email", () => {
//       const data = {
//         email: "invalid-email",
//         password: "Password123!",
//         role: "STUDENT",
//       };

//       const result = registerSchema.safeParse(data);

//       expect(result.success).toBe(false);
//     });

//     it("should reject weak password", () => {
//       const data = {
//         email: "test@test.com",
//         password: "123",
//         role: "STUDENT",
//       };

//       const result = registerSchema.safeParse(data);

//       expect(result.success).toBe(false);
//     });

//   });

// });
