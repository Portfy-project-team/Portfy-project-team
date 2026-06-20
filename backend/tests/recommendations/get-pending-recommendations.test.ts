import request from "supertest";
import app from "../../src/index";
import {
  createAndLoginStudent,
  createAndLoginProf,
  getStudentId,
  ensurePortfolio,
} from "../helpers/auth.helper";

describe("GET /api/recommendations/pending/me", () => {

  let ownerCookies: string[] = [];
  let portfolioId:  number;

  beforeAll(async () => {
    const owner = await createAndLoginStudent();
    ownerCookies = owner.cookies;
    const sId = await getStudentId(owner.email);
    const p   = await ensurePortfolio(sId);
    portfolioId = p.id;

    const prof = await createAndLoginProf();
    await request(app)
      .post("/api/recommendations")
      .set("Cookie", prof.cookies)
      .send({ portfolioId, message: "Recommandation en attente de validation par l'étudiant." });
  });

  it("GPR-01 : étudiant voit ses recommandations PENDING → 200", async () => {
    const res = await request(app)
      .get("/api/recommendations/pending/me")
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("recommendations");
    expect(Array.isArray(res.body.recommendations)).toBe(true);
    expect(res.body.recommendations.length).toBeGreaterThan(0);
  });

  it("GPR-02 : toutes les recommandations sont PENDING", async () => {
    const res = await request(app)
      .get("/api/recommendations/pending/me")
      .set("Cookie", ownerCookies);

    res.body.recommendations.forEach((r: any) => {
      expect(r.statut).toBe("PENDING");
    });
  });

  it("GPR-03 : sans token → 401", async () => {
    const res = await request(app).get("/api/recommendations/pending/me");
    expect(res.status).toBe(401);
  });

  it("GPR-04 : PROF ne peut pas accéder (route STUDENT) → 403", async () => {
    const prof = await createAndLoginProf();
    const res = await request(app)
      .get("/api/recommendations/pending/me")
      .set("Cookie", prof.cookies);

    expect(res.status).toBe(403);
  });
});