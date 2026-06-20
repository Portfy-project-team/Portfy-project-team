import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent, createAndLoginAdmin } from "../helpers/auth.helper";

describe("POST /api/skills/me", () => {

  let studentCookies: string[] = [];

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    studentCookies = s.cookies;
  });

  it("AS-01 : ajouter une compétence valide → 201", async () => {
    const res = await request(app)
      .post("/api/skills/me")
      .set("Cookie", studentCookies)
      .send({ nom: `JavaScript${Date.now()}`, categorie: "Frontend", niveau: "INTERMEDIAIRE" });

    expect(res.status).toBe(201);
    expect(res.body.skill).toHaveProperty("skillId");
    expect(res.body.skill.niveau).toBe("INTERMEDIAIRE");
  });

  it("AS-02 : ajouter sans niveau → 201 avec niveau DEBUTANT par défaut", async () => {
    const res = await request(app)
      .post("/api/skills/me")
      .set("Cookie", studentCookies)
      .send({ nom: `TypeScript${Date.now()}` });

    expect(res.status).toBe(201);
    expect(res.body.skill.niveau).toBe("DEBUTANT");
  });

  it("AS-03 : nom manquant → 400", async () => {
    const res = await request(app)
      .post("/api/skills/me")
      .set("Cookie", studentCookies)
      .send({ categorie: "Backend" });

    expect(res.status).toBe(400);
  });

  it("AS-04 : niveau invalide → 400", async () => {
    const res = await request(app)
      .post("/api/skills/me")
      .set("Cookie", studentCookies)
      .send({ nom: "Node.js", niveau: "SUPER_EXPERT" });

    expect(res.status).toBe(400);
  });

  it("AS-05 : compétence déjà existante → 409", async () => {
    const nom = `PrismaUnique${Date.now()}`;

    await request(app)
      .post("/api/skills/me")
      .set("Cookie", studentCookies)
      .send({ nom });

    const res = await request(app)
      .post("/api/skills/me")
      .set("Cookie", studentCookies)
      .send({ nom });

    expect(res.status).toBe(409);
  });

  it("AS-06 : sans token → 401", async () => {
    const res = await request(app)
      .post("/api/skills/me")
      .send({ nom: "Python" });

    expect(res.status).toBe(401);
  });

  it("AS-07 : ADMIN ne peut pas ajouter (route STUDENT) → 403", async () => {
    const admin = await createAndLoginAdmin();
    const res = await request(app)
      .post("/api/skills/me")
      .set("Cookie", admin.cookies)
      .send({ nom: "React" });

    expect(res.status).toBe(403);
  });
});