import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("GET /api/skills/me", () => {

  let studentCookies: string[] = [];

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    studentCookies = s.cookies;

    await request(app)
      .post("/api/skills/me")
      .set("Cookie", studentCookies)
      .send({ nom: `Vue${Date.now()}`, categorie: "Frontend" });
  });

  it("GS-01 : récupérer mes compétences → 200 avec tableau", async () => {
    const res = await request(app)
      .get("/api/skills/me")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("skills");
    expect(Array.isArray(res.body.skills)).toBe(true);
  });

  it("GS-02 : chaque compétence contient skill et niveau", async () => {
    const res = await request(app)
      .get("/api/skills/me")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
    res.body.skills.forEach((s: any) => {
      expect(s).toHaveProperty("skill");
      expect(s).toHaveProperty("niveau");
      expect(s.skill).toHaveProperty("nom");
    });
  });

  it("GS-03 : sans token → 401", async () => {
    const res = await request(app).get("/api/skills/me");
    expect(res.status).toBe(401);
  });
});