import request from "supertest";
import app from "../../src/index.js";
import { prisma } from "../../src/utils/prisma.js";

describe("PUT /api/projects/:id", () => {

  let studentCookies: string[] = [];
  let projectId: number;

  beforeAll(async () => {
    const email = `updateproject${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "SecurePassword123!!!",
      role: "STUDENT",
    });

    await prisma.user.update({
      where: { email },
      data: { isEmailVerified: true },
    });

    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "SecurePassword123!!!",
    });

    studentCookies = Array.isArray(login.headers["set-cookie"])
      ? login.headers["set-cookie"]
      : [];

    const create = await request(app)
      .post("/api/projects")
      .set("Cookie", studentCookies)
      .send({
        titre: "Projet à modifier",
        type: "PERSONNEL",
      });

    projectId = create.body.project.id;
  });

  it("UP-01 : update project titre", async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .set("Cookie", studentCookies)
      .send({
        titre: "Titre modifié",
      });

    expect(res.status).toBe(200);
    expect(res.body.project.titre).toBe("Titre modifié");
  });

  it("UP-02 : invalid id", async () => {
    const res = await request(app)
      .put("/api/projects/abc")
      .set("Cookie", studentCookies)
      .send({ titre: "Test" });

    expect(res.status).toBe(400);
  });

  it("UP-03 : project not found", async () => {
    const res = await request(app)
      .put("/api/projects/999999")
      .set("Cookie", studentCookies)
      .send({ titre: "Test" });

    expect(res.status).toBe(404);
  });

  it("UP-04 : no token", async () => {
    const res = await request(app)
      .put(`/api/projects/${projectId}`)
      .send({ titre: "Test" });

    expect(res.status).toBe(401);
  });

});
