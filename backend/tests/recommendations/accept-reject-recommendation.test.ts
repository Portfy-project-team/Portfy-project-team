import request from "supertest";
import app from "../../src/index";
import {
  createAndLoginStudent,
  createAndLoginProf,
  getStudentId,
  ensurePortfolio,
} from "../helpers/auth.helper";

describe("PUT /api/recommendations/:id/accept et reject", () => {

  let ownerCookies: string[] = [];
  let portfolioId:  number;
  let recoIdForAccept: number;
  let recoIdForReject: number;

  beforeAll(async () => {
    const owner = await createAndLoginStudent();
    ownerCookies = owner.cookies;
    const sId = await getStudentId(owner.email);
    const p   = await ensurePortfolio(sId);
    portfolioId = p.id;

    const prof = await createAndLoginProf();

    const r1 = await request(app)
      .post("/api/recommendations")
      .set("Cookie", prof.cookies)
      .send({ portfolioId, message: "Recommandation que le propriétaire va accepter." });
    recoIdForAccept = r1.body.recommendation.id;

    const r2 = await request(app)
      .post("/api/recommendations")
      .set("Cookie", prof.cookies)
      .send({ portfolioId, message: "Recommandation que le propriétaire va rejeter." });
    recoIdForReject = r2.body.recommendation.id;
  });

  it("ARR-01 : propriétaire accepte une recommandation → 200 VALIDATED", async () => {
    const res = await request(app)
      .put(`/api/recommendations/${recoIdForAccept}/accept`)
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(200);
    expect(res.body.recommendation.statut).toBe("VALIDATED");
  });

  it("ARR-02 : propriétaire rejette une recommandation → 200 REJECTED", async () => {
    const res = await request(app)
      .put(`/api/recommendations/${recoIdForReject}/reject`)
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(200);
    expect(res.body.recommendation.statut).toBe("REJECTED");
  });

  it("ARR-03 : accepter une reco déjà VALIDATED → 400", async () => {
    const res = await request(app)
      .put(`/api/recommendations/${recoIdForAccept}/accept`)
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(400);
  });

  it("ARR-04 : rejeter une reco déjà REJECTED → 400", async () => {
    const res = await request(app)
      .put(`/api/recommendations/${recoIdForReject}/reject`)
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(400);
  });

  it("ARR-05 : autre étudiant ne peut pas accepter → 403", async () => {
    const prof = await createAndLoginProf();

    const r = await request(app)
      .post("/api/recommendations")
      .set("Cookie", prof.cookies)
      .send({ portfolioId, message: "Reco réservée au propriétaire uniquement." });

    const other = await createAndLoginStudent();
    const res = await request(app)
      .put(`/api/recommendations/${r.body.recommendation.id}/accept`)
      .set("Cookie", other.cookies);

    expect(res.status).toBe(403);
  });

  it("ARR-06 : ID invalide → 400", async () => {
    const res = await request(app)
      .put("/api/recommendations/abc/accept")
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(400);
  });

  it("ARR-07 : recommandation inexistante → 404", async () => {
    const res = await request(app)
      .put("/api/recommendations/999999/accept")
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(404);
  });

  it("ARR-08 : sans token → 401", async () => {
    const res = await request(app)
      .put(`/api/recommendations/${recoIdForAccept}/accept`);

    expect(res.status).toBe(401);
  });
});