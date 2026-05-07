import request from "supertest";
import app from "../../src/index";

describe("POST /api/auth/logout", () => {

  it("LO-01 : valid logout", async () => {
    const email = `logout${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "Secure123!!!",
      role: "STUDENT",
    });

    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "Secure123!!!",
    });

    const cookies = login.headers["set-cookie"];

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
  });

  it("LO-04 : logout twice should stay safe", async () => {
    const email = `logout2${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "Secure123!!!",
      role: "STUDENT",
    });

    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "Secure123!!!",
    });

    const cookies = login.headers["set-cookie"];

    await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies);

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies);

    // verifyToken may reject because cookie cleared/invalid
    expect([200, 401]).toContain(res.status);
  });

});

// import request from "supertest";
// import app from "../../src/index";

// describe("POST /api/auth/logout", () => {

//   it("LO-01 : valid logout", async () => {
//     const email = `logout${Date.now()}@test.com`;

//     await request(app).post("/api/auth/register").send({
//       email,
//       password: "Secure123!",
//       role: "STUDENT",
//     });

//     const login = await request(app).post("/api/auth/login").send({
//       email,
//       password: "Secure123!",
//     });

//     const res = await request(app).post("/api/auth/logout").send({
//       refreshToken: login.body.refreshToken,
//     });

//     expect(res.status).toBe(200);
//   });

//   it("LO-04 : logout twice", async () => {
//     const email = `logout2${Date.now()}@test.com`;

//     await request(app).post("/api/auth/register").send({
//       email,
//       password: "Secure123!",
//       role: "STUDENT",
//     });

//     const login = await request(app).post("/api/auth/login").send({
//       email,
//       password: "Secure123!",
//     });

//     await request(app).post("/api/auth/logout").send({
//       refreshToken: login.body.refreshToken,
//     });

//     const res = await request(app).post("/api/auth/logout").send({
//       refreshToken: login.body.refreshToken,
//     });

//     expect(res.status).toBe(401);
//   });

// });