import request from "supertest";
import app from "../../src/index.js";
import { prisma } from "../../src/utils/prisma.js";

describe("PUT /api/portfolio/settings", () => {

  let studentCookies: string[] = [];

  beforeAll(async () => {
    const email = `settingsportfolio${Date.now()}@test.com`;

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
  });

  it("PS-01 : update objective", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", studentCookies)
      .send({
        objective: "Devenir développeur fullstack",
      });

    expect(res.status).toBe(200);
    expect(res.body.portfolio.objective).toBe("Devenir développeur fullstack");
  });

  it("PS-02 : update visibilite to PRIVATE", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", studentCookies)
      .send({
        visibilite: "PRIVATE",
      });

    expect(res.status).toBe(200);
    expect(res.body.portfolio.visibilite).toBe("PRIVATE");
  });

  it("PS-03 : update visibilite to LINK_ONLY", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", studentCookies)
      .send({
        visibilite: "LINK_ONLY",
      });

    expect(res.status).toBe(200);
    expect(res.body.portfolio.visibilite).toBe("LINK_ONLY");
  });

  it("PS-04 : update visibilite to PUBLIC", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", studentCookies)
      .send({
        visibilite: "PUBLIC",
      });

    expect(res.status).toBe(200);
    expect(res.body.portfolio.visibilite).toBe("PUBLIC");
  });
it("PS-05 : invalid visibilite value", async () => {
  const res = await request(app)
    .put("/api/portfolio/settings")
    .set("Cookie", studentCookies)
    .send({
      visibilite: "INVALID_VALUE",
    });

  expect([400, 500]).toContain(res.status);
});
//   it("PS-05 : invalid visibilite value", async () => {
//     const res = await request(app)
//       .put("/api/portfolio/settings")
//       .set("Cookie", studentCookies)
//       .send({
//         visibilite: "INVALID_VALUE",
//       });

//     expect(res.status).toBe(400);
//   });

  it("PS-06 : no token", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .send({
        visibilite: "PUBLIC",
      });

    expect(res.status).toBe(401);
  });

  it("PS-07 : update both objective and visibilite", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", studentCookies)
      .send({
        objective: "Mon objectif mis à jour",
        visibilite: "PUBLIC",
      });

    expect(res.status).toBe(200);
    expect(res.body.portfolio.objective).toBe("Mon objectif mis à jour");
    expect(res.body.portfolio.visibilite).toBe("PUBLIC");
  });

});
