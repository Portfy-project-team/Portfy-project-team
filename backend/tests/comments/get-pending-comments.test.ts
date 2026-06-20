import request from "supertest";
import app from "../../src/index";
import {
  createAndLoginStudent,
  createAndLoginProf,
  getStudentId,
  ensurePortfolio,
} from "../helpers/auth.helper";

describe("GET /api/comments/pending/me", () => {

  let ownerCookies: string[] = [];
  let portfolioId:  number;

  beforeAll(async () => {
    const owner = await createAndLoginStudent();
    ownerCookies = owner.cookies;
    const sId = await getStudentId(owner.email);
    const p   = await ensurePortfolio(sId);
    portfolioId = p.id;

    // Créer un commentaire sur le portfolio de l'owner
    const prof = await createAndLoginProf();
    await request(app)
      .post("/api/comments")
      .set("Cookie", prof.cookies)
      .send({ portfolioId, contenu: "Commentaire en attente de validation." });
  });

  it("GPC-01 : étudiant voit ses commentaires PENDING → 200", async () => {
    const res = await request(app)
      .get("/api/comments/pending/me")
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("comments");
    expect(Array.isArray(res.body.comments)).toBe(true);
    expect(res.body.comments.length).toBeGreaterThan(0);
  });

  it("GPC-02 : tous les commentaires sont PENDING", async () => {
    const res = await request(app)
      .get("/api/comments/pending/me")
      .set("Cookie", ownerCookies);

    res.body.comments.forEach((c: any) => {
      expect(c.statut).toBe("PENDING");
    });
  });

  it("GPC-03 : sans token → 401", async () => {
    const res = await request(app).get("/api/comments/pending/me");
    expect(res.status).toBe(401);
  });

  it("GPC-04 : PROF ne peut pas accéder (route STUDENT) → 403", async () => {
    const prof = await createAndLoginProf();
    const res = await request(app)
      .get("/api/comments/pending/me")
      .set("Cookie", prof.cookies);

    expect(res.status).toBe(403);
  });
});