import {
  AjouterUserSchema,
  updateUserSchema,
} from "../../../src/modules/admin/admin.validation";

describe("Admin Validation", () => {

  describe("AjouterUserSchema", () => {

    it("should validate correct user data", () => {
      const data = {
        email:    "kholoud@test.com",
        password: "Password123!",
        role:     "ADMIN",
      };

      const result = AjouterUserSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate STUDENT role", () => {
      const data = {
        email:    "student@test.com",
        password: "Password123!",
        role:     "STUDENT",
      };

      const result = AjouterUserSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate PROF role", () => {
      const data = {
        email:    "prof@test.com",
        password: "Password123!",
        role:     "PROF",
      };

      const result = AjouterUserSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const data = {
        email:    "invalid-email",
        password: "Password123!",
        role:     "ADMIN",
      };

      const result = AjouterUserSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const data = {
        email:    "kholoud@test.com",
        password: "123",
        role:     "ADMIN",
      };

      const result = AjouterUserSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject missing role", () => {
      const data = {
        email:    "kholoud@test.com",
        password: "Password123!",
      };

      const result = AjouterUserSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject invalid role", () => {
      const data = {
        email:    "kholoud@test.com",
        password: "Password123!",
        role:     "SUPERUSER",
      };

      const result = AjouterUserSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("updateUserSchema", () => {

    it("should validate partial update (role only)", () => {
      const result = updateUserSchema.safeParse({ role: "PROF" });
      expect(result.success).toBe(true);
    });

    it("should validate partial update (email only)", () => {
      const result = updateUserSchema.safeParse({ email: "new@test.com" });
      expect(result.success).toBe(true);
    });

    it("should validate empty object (all fields optional)", () => {
      const result = updateUserSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("should reject invalid email in update", () => {
      const result = updateUserSchema.safeParse({ email: "bad-email" });
      expect(result.success).toBe(false);
    });

    it("should reject invalid role in update", () => {
      const result = updateUserSchema.safeParse({ role: "SUPERUSER" });
      expect(result.success).toBe(false);
    });
  });
});

// import {
//   createUserSchema,
//   updateUserSchema,
// } from "../../../src/modules/admin/admin.validation";

// describe("Admin Validation", () => {

//   describe("createUserSchema", () => {

//     it("should validate correct user data", () => {

//       const data = {
//         name: "Kholoud",
//         email: "kholoud@test.com",
//         password: "Password123!",
//         role: "ADMIN",
//       };

//       const result = createUserSchema.safeParse(data);

//       expect(result.success).toBe(true);
//     });

//     it("should reject invalid email", () => {

//       const data = {
//         name: "Kholoud",
//         email: "invalid-email",
//         password: "Password123!",
//         role: "ADMIN",
//       };

//       const result = createUserSchema.safeParse(data);

//       expect(result.success).toBe(false);
//     });

//   });

//   describe("updateUserSchema", () => {

//     it("should validate update data", () => {

//       const data = {
//         name: "Updated Name",
//       };

//       const result = updateUserSchema.safeParse(data);

//       expect(result.success).toBe(true);
//     });

//   });

// });
