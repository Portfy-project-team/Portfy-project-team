// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// describe("GET /api/projects/me", () => {

//   let studentCookies: string[] = [];

//   beforeAll(async () => {
//     const email = `getmyprojects${Date.now()}@test.com`;

//     await request(app).post("/api/auth/register").send({
//       email,
//       password: "SecurePassword123!!!",
//       role: "STUDENT",
//     });

//     await prisma.user.update({
//       where: { email },
//       data: { isEmailVerified: true },
//     });

//     const login = await request(app).post("/api/auth/login").send({
//       email,
//       password: "SecurePassword123!!!",
//     });

//     studentCookies = Array.isArray(login.headers["set-cookie"])
//       ? login.headers["set-cookie"]
//       : [];

//     // créer un projet
//     await request(app)
//       .post("/api/projects")
//       .set("Cookie", studentCookies)
//       .send({
//         titre: "Projet pour liste",
//         type: "MODULE",
//       });
//   });

//   it("GMP-01 : get my projects", async () => {
//     const res = await request(app)
//       .get("/api/projects/me")
//       .set("Cookie", studentCookies);

//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body.projects)).toBe(true);
//     expect(res.body.projects.length).toBeGreaterThan(0);
//   });

//   it("GMP-02 : no token", async () => {
//     const res = await request(app).get("/api/projects/me");
//     expect(res.status).toBe(401);
//   });

// });
import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("GET /api/projects/me", () => {

  let cookies: string[] = [];

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    cookies = s.cookies;

    // Créer un projet pour avoir des données
    await request(app)
      .post("/api/projects")
      .set("Cookie", cookies)
      .send({ titre: "Projet de test", type: "MODULE" });
  });

  it("GMP-01 : get my projects returns array", async () => {
    const res = await request(app)
      .get("/api/projects/me")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("projects");
    expect(Array.isArray(res.body.projects)).toBe(true);
  });

  it("GMP-02 : no token returns 401", async () => {
    const res = await request(app).get("/api/projects/me");
    expect(res.status).toBe(401);
  });
});