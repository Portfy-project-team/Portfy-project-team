import request from "supertest";
import app from "../../src/index.js";
import { prisma } from "../../src/utils/prisma.js";

describe("DELETE /api/projects/:id", () => {

  let studentCookies: string[] = [];
  let projectId: number;

  beforeAll(async () => {
    const email = `deleteproject${Date.now()}@test.com`;

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
        titre: "Projet à supprimer",
        type: "PERSONNEL",
      });

    projectId = create.body.project.id;
  });

  it("DP-01 : delete project", async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
  });

  it("DP-02 : project already deleted", async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set("Cookie", studentCookies);

    expect(res.status).toBe(404);
  });

  it("DP-03 : invalid id", async () => {
    const res = await request(app)
      .delete("/api/projects/abc")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(400);
  });

  it("DP-04 : no token", async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}`);

    expect(res.status).toBe(401);
  });

});
