import bcrypt from "bcryptjs";

describe("Admin Service", () => {

  it("AS-01 : should hash password and verify it", async () => {
    const password = "Password123!";
    const hashed   = await bcrypt.hash(password, 12);

    expect(hashed).not.toBe(password);

    const isMatch = await bcrypt.compare(password, hashed);
    expect(isMatch).toBe(true);
  });

  it("AS-02 : different passwords should not match", async () => {
    const hashed  = await bcrypt.hash("Password123!", 12);
    const isMatch = await bcrypt.compare("WrongPassword!", hashed);

    expect(isMatch).toBe(false);
  });
});


// import bcrypt from "bcryptjs";

// describe("Admin Service", () => {

//   it("should hash password", async () => {

//     const password = "Password123!";

//     const hashed = await bcrypt.hash(password, 12);

//     expect(hashed).not.toBe(password);
//   });

// });
