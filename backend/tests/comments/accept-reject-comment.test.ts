import request from "supertest";
import app from "../../src/index";
import {
  createAndLoginStudent,
  createAndLoginProf,
  getStudentId,
  ensurePortfolio,
} from "../helpers/auth.helper";

describe("PUT /api/comments/:id/accept et reject", () => {

  let ownerCookies: string[] = [];
  let portfolioId:  number;
  let commentIdForAccept: number;
  let commentIdForReject: number;

  beforeAll(async () => {
    const owner = await createAndLoginStudent();
    ownerCookies = owner.cookies;
    const sId = await getStudentId(owner.email);
    const p   = await ensurePortfolio(sId);
    portfolioId = p.id;

    const prof = await createAndLoginProf();

    const r1 = await request(app)
      .post("/api/comments")
      .set("Cookie", prof.cookies)
      .send({ portfolioId, contenu: "Commentaire à accepter par le propriétaire." });
    commentIdForAccept = r1.body.comment.id;

    const r2 = await request(app)
      .post("/api/comments")
      .set("Cookie", prof.cookies)
      .send({ portfolioId, contenu: "Commentaire à rejeter par le propriétaire." });
    commentIdForReject = r2.body.comment.id;
  });

  it("ARC-01 : propriétaire accepte un commentaire → 200 VALIDATED", async () => {
    const res = await request(app)
      .put(`/api/comments/${commentIdForAccept}/accept`)
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(200);
    expect(res.body.comment.statut).toBe("VALIDATED");
  });

  it("ARC-02 : propriétaire rejette un commentaire → 200 REJECTED", async () => {
    const res = await request(app)
      .put(`/api/comments/${commentIdForReject}/reject`)
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(200);
    expect(res.body.comment.statut).toBe("REJECTED");
  });

  it("ARC-03 : accepter un commentaire déjà VALIDATED → 400", async () => {
    const res = await request(app)
      .put(`/api/comments/${commentIdForAccept}/accept`)
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(400);
  });

  it("ARC-04 : rejeter un commentaire déjà REJECTED → 400", async () => {
    const res = await request(app)
      .put(`/api/comments/${commentIdForReject}/reject`)
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(400);
  });

  it("ARC-05 : autre étudiant ne peut pas accepter (pas son portfolio) → 403", async () => {
    const other = await createAndLoginStudent();
    const prof  = await createAndLoginProf();

    // Créer un nouveau commentaire PENDING
    const r = await request(app)
      .post("/api/comments")
      .set("Cookie", prof.cookies)
      .send({ portfolioId, contenu: "Commentaire que seul le owner peut accepter." });

    const res = await request(app)
      .put(`/api/comments/${r.body.comment.id}/accept`)
      .set("Cookie", other.cookies);

    expect(res.status).toBe(403);
  });

  it("ARC-06 : ID invalide → 400", async () => {
    const res = await request(app)
      .put("/api/comments/abc/accept")
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(400);
  });

  it("ARC-07 : commentaire inexistant → 404", async () => {
    const res = await request(app)
      .put("/api/comments/999999/accept")
      .set("Cookie", ownerCookies);

    expect(res.status).toBe(404);
  });

  it("ARC-08 : sans token → 401", async () => {
    const res = await request(app)
      .put(`/api/comments/${commentIdForAccept}/accept`);

    expect(res.status).toBe(401);
  });
});