import bcrypt from "bcryptjs";

describe("User Service", () => {

  it("should compare passwords", async () => {

    const password = "Password123!";

    const hashed = await bcrypt.hash(password, 12);

    const isValid = await bcrypt.compare(password, hashed);

    expect(isValid).toBe(true);
  });

});