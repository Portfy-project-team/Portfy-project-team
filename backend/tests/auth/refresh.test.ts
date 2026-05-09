import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("POST /api/auth/refresh", () => {

  it("RT-01 : valid refresh", async () => {
    const email = `refresh${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "Secure123!!!",
      role: "STUDENT",
    });

    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "Secure123!!!",
    });

    const cookies = login.headers["set-cookie"];

    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);

    const rawRefreshedCookies = res.headers["set-cookie"];
    const refreshedCookies = Array.isArray(rawRefreshedCookies)
      ? rawRefreshedCookies
      : [];

    expect(
      refreshedCookies.some((c: string) =>
        c.includes("access_token")
      )
    ).toBe(true);
  });

  it("RT-04 : no token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh");

    expect(res.status).toBe(401);
  });

});



// import request from "supertest";
// import app from "../../src/index";

// describe("POST /api/auth/refresh", () => {

//   it("RT-01 : valid refresh", async () => {
//     const email = `refresh${Date.now()}@test.com`;

//     await request(app).post("/api/auth/register").send({
//       email,
//       password: "Secure123!!!",
//       role: "STUDENT",
//     });

//     const login = await request(app).post("/api/auth/login").send({
//       email,
//       password: "Secure123!!!",
//     });

//     const cookies = login.headers["set-cookie"];

//     const res = await request(app)
//       .post("/api/auth/refresh")
//       .set("Cookie", cookies);

//     expect(res.status).toBe(200);

//     // const refreshedCookies = res.headers["set-cookie"];
//     const rawRefreshedCookies = res.headers["set-cookie"];
// const refreshedCookies = Array.isArray(rawRefreshedCookies) ? rawRefreshedCookies : [];
//     expect(refreshedCookies.some((c: string) => c.includes("access_token"))).toBe(true);
//   });

//   it("RT-04 : no token", async () => {
//     const res = await request(app)
//       .post("/api/auth/refresh");

//     expect(res.status).toBe(401);
//   });

// });
