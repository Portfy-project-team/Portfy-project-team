import request from "supertest";
import app from "../../src/index";
import {
  createAndLoginStudent,
  createAndLoginProf,
  getStudentId,
  ensurePortfolio,
} from "../helpers/auth.helper";

describe("POST /api/comments", () => {

  let profCookies:    string[] = [];
  let studentCookies: string[] = [];
  let portfolioId:    number;

  beforeAll(async () => {
    const prof = await createAndLoginProf();
    profCookies = prof.cookies;

    const owner = await createAndLoginStudent();
    studentCookies = owner.cookies;
    const sId = await getStudentId(owner.email);
    const p   = await ensurePortfolio(sId);
    portfolioId = p.id;
  });

  it("CC-01 : prof commente un portfolio → 201 PENDING", async () => {
    const res = await request(app)
      .post("/api/comments")
      .set("Cookie", profCookies)
      .send({ portfolioId, contenu: "Excellent portfolio, très bien structuré." });

    expect(res.status).toBe(201);
    expect(res.body.comment.statut).toBe("PENDING");
    expect(res.body.comment.portfolioId).toBe(portfolioId);
  });

  it("CC-02 : étudiant commente un portfolio → 201 PENDING", async () => {
    const other = await createAndLoginStudent();
    const res = await request(app)
      .post("/api/comments")
      .set("Cookie", other.cookies)
      .send({ portfolioId, contenu: "Portfolio très impressionnant !" });

    expect(res.status).toBe(201);
    expect(res.body.comment.statut).toBe("PENDING");
  });

  it("CC-03 : contenu manquant → 400", async () => {
    const res = await request(app)
      .post("/api/comments")
      .set("Cookie", profCookies)
      .send({ portfolioId });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty("contenu");
  });

  it("CC-04 : contenu trop court (< 5 chars) → 400", async () => {
    const res = await request(app)
      .post("/api/comments")
      .set("Cookie", profCookies)
      .send({ portfolioId, contenu: "Hi" });

    expect(res.status).toBe(400);
  });

  it("CC-05 : portfolioId manquant → 400", async () => {
    const res = await request(app)
      .post("/api/comments")
      .set("Cookie", profCookies)
      .send({ contenu: "Bon portfolio mais sans ID." });

    expect(res.status).toBe(400);
  });

  it("CC-06 : portfolioId inexistant → 404", async () => {
    const res = await request(app)
      .post("/api/comments")
      .set("Cookie", profCookies)
      .send({ portfolioId: 999999, contenu: "Commentaire orphelin." });

    expect(res.status).toBe(404);
  });

  it("CC-07 : sans token → 401", async () => {
    const res = await request(app)
      .post("/api/comments")
      .send({ portfolioId, contenu: "Test sans auth." });

    expect(res.status).toBe(401);
  });
});