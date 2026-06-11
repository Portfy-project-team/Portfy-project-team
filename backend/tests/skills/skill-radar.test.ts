import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("GET /api/skills/me/radar et stats", () => {

  let studentCookies: string[] = [];

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    studentCookies = s.cookies;

    // Ajouter des compétences de différentes catégories
    await request(app).post("/api/skills/me").set("Cookie", studentCookies)
      .send({ nom: `React${Date.now()}`, categorie: "Frontend", niveau: "AVANCE" });
    await request(app).post("/api/skills/me").set("Cookie", studentCookies)
      .send({ nom: `Node${Date.now()}`, categorie: "Backend", niveau: "INTERMEDIAIRE" });
    await request(app).post("/api/skills/me").set("Cookie", studentCookies)
      .send({ nom: `SQL${Date.now()}`, categorie: "Backend", niveau: "EXPERT" });
  });

  it("SR-01 : radar retourne tableau par catégorie → 200", async () => {
    const res = await request(app)
      .get("/api/skills/me/radar")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("radar");
    expect(Array.isArray(res.body.radar)).toBe(true);
  });

  it("SR-02 : chaque item radar contient categorie, score et maxScore", async () => {
    const res = await request(app)
      .get("/api/skills/me/radar")
      .set("Cookie", studentCookies);

    res.body.radar.forEach((item: any) => {
      expect(item).toHaveProperty("categorie");
      expect(item).toHaveProperty("score");
      expect(item).toHaveProperty("maxScore");
      expect(item.maxScore).toBe(4);
      expect(item.score).toBeGreaterThan(0);
      expect(item.score).toBeLessThanOrEqual(4);
    });
  });

  it("SR-03 : stats retourne total, byLevel et byCategory → 200", async () => {
    const res = await request(app)
      .get("/api/skills/me/stats")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
    expect(res.body.stats).toHaveProperty("total");
    expect(res.body.stats).toHaveProperty("byLevel");
    expect(res.body.stats).toHaveProperty("byCategory");
    expect(res.body.stats.total).toBeGreaterThan(0);
  });

  it("SR-04 : byLevel contient les 4 niveaux", async () => {
    const res = await request(app)
      .get("/api/skills/me/stats")
      .set("Cookie", studentCookies);

    const { byLevel } = res.body.stats;
    expect(byLevel).toHaveProperty("DEBUTANT");
    expect(byLevel).toHaveProperty("INTERMEDIAIRE");
    expect(byLevel).toHaveProperty("AVANCE");
    expect(byLevel).toHaveProperty("EXPERT");
  });

  it("SR-05 : radar sans token → 401", async () => {
    const res = await request(app).get("/api/skills/me/radar");
    expect(res.status).toBe(401);
  });

  it("SR-06 : stats sans token → 401", async () => {
    const res = await request(app).get("/api/skills/me/stats");
    expect(res.status).toBe(401);
  });
});