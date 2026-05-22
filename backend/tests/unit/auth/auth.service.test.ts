import bcrypt from "bcryptjs";

describe("Auth Service", () => {

  it("should hash password correctly", async () => {

    const password = "Password123!";

    const hash = await bcrypt.hash(password, 10);

    const isMatch = await bcrypt.compare(password, hash);

    expect(isMatch).toBe(true);

  });

});