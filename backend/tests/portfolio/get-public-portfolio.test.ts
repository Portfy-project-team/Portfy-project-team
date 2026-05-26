import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("GET /api/portfolio/public/:studentId", () => {

  let studentId: number;
  let studentCookies: string[] = [];

  beforeAll(async () => {
    const email = `publicportfolio${Date.now()}@test.com`;

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

    const user = await prisma.user.findUnique({
      where: { email },
      include: { student: true },
    });

    studentId = user!.student!.id;

    // Créer portfolio PUBLIC
    await prisma.portfolio.upsert({
      where: { studentId },
      create: { studentId, visibilite: "PUBLIC" },
      update: { visibilite: "PUBLIC" },
    });
  });

  it("PP-01 : get public portfolio", async () => {
    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("portfolio");
  });

  it("PP-02 : invalid student id", async () => {
    const res = await request(app)
      .get("/api/portfolio/public/abc");

    expect(res.status).toBe(400);
  });

  it("PP-03 : student not found", async () => {
    const res = await request(app)
      .get("/api/portfolio/public/999999");

    expect(res.status).toBe(404);
  });

  it("PP-04 : private portfolio returns 403", async () => {
    // Mettre le portfolio en PRIVATE
    await prisma.portfolio.update({
      where: { studentId },
      data: { visibilite: "PRIVATE" },
    });

    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(403);
  });

  it("PP-05 : pending project not visible in public portfolio", async () => {
    // Remettre PUBLIC
    await prisma.portfolio.update({
      where: { studentId },
      data: { visibilite: "PUBLIC" },
    });

    const portfolio = await prisma.portfolio.findUnique({
      where: { studentId },
    });

    // Créer projet PENDING
    await prisma.projet.create({
      data: {
        titre: "Projet PENDING",
        statusV: "PENDING",
        portfolioId: portfolio!.id,
      },
    });

    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(200);

    const projets = res.body.portfolio?.portfolio?.projets ?? [];
    const hasPending = projets.some((p: any) => p.statusV === "PENDING");
    expect(hasPending).toBe(false);
  });

  it("PP-06 : validated project visible in public portfolio", async () => {
    const portfolio = await prisma.portfolio.findUnique({
      where: { studentId },
    });

    // Créer projet VALIDATED
    await prisma.projet.create({
      data: {
        titre: "Projet VALIDATED",
        statusV: "VALIDATED",
        portfolioId: portfolio!.id,
      },
    });

    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(200);

    const projets = res.body.portfolio?.portfolio?.projets ?? [];
    const hasValidated = projets.some((p: any) => p.statusV === "VALIDATED");
    expect(hasValidated).toBe(true);
  });

  it("PP-07 : pending stage not visible in public portfolio", async () => {
    const user = await prisma.user.findFirst({
      where: { student: { id: studentId } },
      include: { student: true },
    });

    // Créer stage PENDING
    await prisma.stage.create({
      data: {
        entreprise: "Entreprise Test",
        mission: "Mission test",
        statutV: "PENDING",
        studentId,
      },
    });

    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(200);

    const stages = res.body.portfolio?.Stage ?? [];
    const hasPending = stages.some((s: any) => s.statutV === "PENDING");
    expect(hasPending).toBe(false);
  });

});
