import request from "supertest";
import app from "../../src/index";

describe("POST /api/auth/login", () => {

  it("L-01 : valid login", async () => {
    const email = `login${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "Secure123!!!",
      role: "STUDENT",
    });

    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "Secure123!!!",
    });

    expect(res.status).toBe(200);
    // const cookies = res.headers["set-cookie"] as string[];
    // const cookies = res.headers["set-cookie"] ;
    const rawCookies = res.headers["set-cookie"];
    const cookies = Array.isArray(rawCookies) ? rawCookies : [];
    expect(cookies).toBeDefined();
    expect(cookies.some((c: string) => c.includes("access_token"))).toBe(true);
    expect(cookies.some((c: string) => c.includes("refresh_token"))).toBe(true);
  });

  it("L-02 : email not found", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "unknown@test.com",
      password: "Secure123!!!",
    });

    expect(res.status).toBe(401);
  });

  it("L-03 : wrong password", async () => {
    const email = `wrong${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "Secure123!!!",
      role: "STUDENT",
    });

    const res = await request(app).post("/api/auth/login").send({
      email,
      password: "WrongPass999!!!",
    });

    expect(res.status).toBe(401);
  });

});

// import request from "supertest";
// import app from "../../src/index";

// describe("POST /api/auth/login", () => {

//   it("L-01 : valid login", async () => {
//     const email = `login${Date.now()}@test.com`;

//     // register first
//     await request(app).post("/api/auth/register").send({
//       email,
//       password: "Secure123!",
//       role: "STUDENT",
//     });

//     const res = await request(app).post("/api/auth/login").send({
//       email,
//       password: "Secure123!",
//     });

//     expect(res.status).toBe(200);
//     expect(res.body.accessToken).toBeDefined();
//     expect(res.body.refreshToken).toBeDefined();
//   });

//   it("L-02 : email not found", async () => {
//     const res = await request(app).post("/api/auth/login").send({
//       email: "unknown@test.com",
//       password: "Secure123!",
//     });

//     expect(res.status).toBe(401);
//   });

//   it("L-03 : wrong password", async () => {
//     const email = `wrong${Date.now()}@test.com`;

//     await request(app).post("/api/auth/register").send({
//       email,
//       password: "Secure123!",
//       role: "STUDENT",
//     });

//     const res = await request(app).post("/api/auth/login").send({
//       email,
//       password: "wrongpass",
//     });

//     expect(res.status).toBe(401);
//   });

// });