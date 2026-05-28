import bcrypt from "bcryptjs";

describe("Admin Service", () => {

  it("should hash password", async () => {

    const password = "Password123!";

    const hashed = await bcrypt.hash(password, 12);

    expect(hashed).not.toBe(password);
  });

});
