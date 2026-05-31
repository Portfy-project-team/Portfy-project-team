// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";

// describe("POST /api/projects/:id/submit", () => {

//   let studentCookies: string[] = [];
//   let projectId: number;

//   beforeAll(async () => {
//     const email = `submitproject${Date.now()}@test.com`;

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

//     const create = await request(app)
//       .post("/api/projects")
//       .set("Cookie", studentCookies)
//       .send({
//         titre: "Projet à soumettre",
//         type: "MODULE",
//       });

//     projectId = create.body.project.id;
//   });

//   it("SP-01 : submit project", async () => {
//     const res = await request(app)
//       .post(`/api/projects/${projectId}/submit`)
//       .set("Cookie", studentCookies);

//     expect(res.status).toBe(200);
//     expect(res.body.project.statusV).toBe("PENDING");
//   });

//   it("SP-02 : invalid id", async () => {
//     const res = await request(app)
//       .post("/api/projects/abc/submit")
//       .set("Cookie", studentCookies);

//     expect(res.status).toBe(400);
//   });

//   it("SP-03 : no token", async () => {
//     const res = await request(app)
//       .post(`/api/projects/${projectId}/submit`);

//     expect(res.status).toBe(401);
//   });

// });
import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("PUT /api/projects/:id", () => {

  let cookies: string[] = [];
  let projectId: number;

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    cookies = s.cookies;

    const res = await request(app)
      .post("/api/projects")
      .set("Cookie", cookies)
      .send({ titre: "Projet à modifier" });

    projectId = res.body.project.id;
  });

  it("UP-01 : update project titre", async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .set("Cookie", cookies)
      .send({ titre: "Titre modifié" });

    expect(res.status).toBe(200);
    expect(res.body.project.titre).toBe("Titre modifié");
  });

  it("UP-02 : invalid id returns 400", async () => {
    const res = await request(app)
      .put("/api/projects/abc")
      .set("Cookie", cookies)
      .send({ titre: "Test" });

    expect(res.status).toBe(400);
  });

  it("UP-03 : project not found returns 404", async () => {
    const res = await request(app)
      .put("/api/projects/999999")
      .set("Cookie", cookies)
      .send({ titre: "Test" });

    expect(res.status).toBe(404);
  });

  it("UP-04 : no token returns 401", async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .send({ titre: "Test" });

    expect(res.status).toBe(401);
  });
});