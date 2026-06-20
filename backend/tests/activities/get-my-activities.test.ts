import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("GET /api/activities/me", () => {

  let studentCookies: string[] = [];

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    studentCookies = s.cookies;

    // Créer une activité pour avoir des données
    await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({ nom: "Activité pour get test", type: "Sport" });
  });

  it("GMA-01 : étudiant récupère ses activités → 200 avec tableau", async () => {
    const res = await request(app)
      .get("/api/activities/me")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("activities");
    expect(Array.isArray(res.body.activities)).toBe(true);
  });

  it("GMA-02 : les activités appartiennent à l'étudiant connecté", async () => {
    const res = await request(app)
      .get("/api/activities/me")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
    expect(res.body.activities.length).toBeGreaterThan(0);
  });

  it("GMA-03 : sans token → 401", async () => {
    const res = await request(app).get("/api/activities/me");
    expect(res.status).toBe(401);
  });
});