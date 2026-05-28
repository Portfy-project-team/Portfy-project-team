import {
  changePasswordSchema,
} from "../../../src/modules/user/user.validation";

describe("User Validation", () => {

  it("should validate password change", () => {

    const data = {
      currentPassword: "oldpassword",
      newPassword: "newpassword",
    };

    const result = changePasswordSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

});
