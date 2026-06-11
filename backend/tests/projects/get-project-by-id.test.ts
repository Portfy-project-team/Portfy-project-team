import request from "supertest";
import app from "../../src/index.js";
import { prisma } from "../../src/utils/prisma.js";

describe("GET /api/projects/:id", () => {

  let studentCookies: string[] = [];
  let projectId: number;

  beforeAll(async () => {
    const email = `getprojectbyid${Date.now()}@test.com`;

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
        titre: "Projet par ID",
        type: "INTEGRATION",
      });

    projectId = create.body.project.id;
  });

  it("GPI-01 : get project by id", async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}`)
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
    expect(res.body.project.id).toBe(projectId);
  });

  it("GPI-02 : invalid id", async () => {
    const res = await request(app)
      .get("/api/projects/abc")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(400);
  });

  it("GPI-03 : project not found", async () => {
    const res = await request(app)
      .get("/api/projects/999999")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(404);
  });

  it("GPI-04 : no token", async () => {
    const res = await request(app).get(`/api/projects/${projectId}`);
    expect(res.status).toBe(401);
  });

});
