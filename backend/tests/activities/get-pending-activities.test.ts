import request from "supertest";
import app from "../../src/index";
import { createAndLoginAdmin, createAndLoginStudent } from "../helpers/auth.helper";

describe("GET /api/activities/pending", () => {

  let adminCookies:   string[] = [];
  let studentCookies: string[] = [];

  beforeAll(async () => {
    const admin = await createAndLoginAdmin();
    adminCookies = admin.cookies;

    const s = await createAndLoginStudent();
    studentCookies = s.cookies;

    await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({ nom: "Activité en attente pour pending test" });
  });

  it("GPA-01 : admin récupère les activités PENDING → 200", async () => {
    const res = await request(app)
      .get("/api/activities/pending")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("activities");
    expect(Array.isArray(res.body.activities)).toBe(true);
  });

  it("GPA-02 : toutes les activités retournées sont PENDING", async () => {
    const res = await request(app)
      .get("/api/activities/pending")
      .set("Cookie", adminCookies);

    res.body.activities.forEach((a: any) => {
      expect(a.statutV).toBe("PENDING");
    });
  });

  it("GPA-03 : étudiant ne peut pas voir les activités pending → 403", async () => {
    const res = await request(app)
      .get("/api/activities/pending")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(403);
  });

  it("GPA-04 : sans token → 401", async () => {
    const res = await request(app).get("/api/activities/pending");
    expect(res.status).toBe(401);
  });
});