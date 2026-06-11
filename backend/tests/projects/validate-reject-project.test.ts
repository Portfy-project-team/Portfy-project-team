import request from "supertest";
import app from "../../src/index.js";
import { prisma } from "../../src/utils/prisma.js";

describe("PUT /api/projects/:id/validate and reject", () => {

  let studentCookies: string[] = [];
  let profCookies: string[] = [];
  let projectId: number;
  let projectIdToReject: number;

  beforeAll(async () => {
    // créer étudiant
    const studentEmail = `validatestudent${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email: studentEmail,
      password: "SecurePassword123!!!",
      role: "STUDENT",
    });

    await prisma.user.update({
      where: { email: studentEmail },
      data: { isEmailVerified: true },
    });

    const studentLogin = await request(app).post("/api/auth/login").send({
      email: studentEmail,
      password: "SecurePassword123!!!",
    });

    studentCookies = Array.isArray(studentLogin.headers["set-cookie"])
      ? studentLogin.headers["set-cookie"]
      : [];

    // créer prof
    const profEmail = `validateprof${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email: profEmail,
      password: "SecurePassword123!!!",
      role: "STUDENT",
    });

    await prisma.user.update({
      where: { email: profEmail },
      data: { role: "PROF", isEmailVerified: true },
    });

    const profLogin = await request(app).post("/api/auth/login").send({
      email: profEmail,
      password: "SecurePassword123!!!",
    });

    profCookies = Array.isArray(profLogin.headers["set-cookie"])
      ? profLogin.headers["set-cookie"]
      : [];

    // créer et soumettre projet 1
    const create1 = await request(app)
      .post("/api/projects")
      .set("Cookie", studentCookies)
      .send({ titre: "Projet à valider", type: "MODULE" });

    projectId = create1.body.project.id;

    await request(app)
      .post(`/api/projects/${projectId}/submit`)
      .set("Cookie", studentCookies);

    // créer et soumettre projet 2
    const create2 = await request(app)
      .post("/api/projects")
      .set("Cookie", studentCookies)
      .send({ titre: "Projet à rejeter", type: "HACKATHON" });

    projectIdToReject = create2.body.project.id;

    await request(app)
      .post(`/api/projects/${projectIdToReject}/submit`)
      .set("Cookie", studentCookies);
  });

  it("VR-01 : prof validate project", async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}/validate`)
      .set("Cookie", profCookies)
      .send({
        noteProf: "Très bon projet",
        score: 18,
      });

    expect(res.status).toBe(200);
    expect(res.body.project.statusV).toBe("VALIDATED");
  });

  it("VR-02 : prof reject project", async () => {
    const res = await request(app)
      .put(`/api/projects/${projectIdToReject}/reject`)
      .set("Cookie", profCookies)
      .send({
        noteProf: "Projet incomplet",
        score: 8,
      });

    expect(res.status).toBe(200);
    expect(res.body.project.statusV).toBe("REJECTED");
  });

  it("VR-03 : student cannot validate", async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}/validate`)
      .set("Cookie", studentCookies)
      .send({ noteProf: "Test" });

    expect(res.status).toBe(403);
  });

  it("VR-04 : no token", async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}/validate`)
      .send({ noteProf: "Test" });

    expect(res.status).toBe(401);
  });

});
