import request from "supertest";
import app from "../../src/index";
import {
  createAndLoginStudent,
  createAndLoginProf,
  getStudentId,
  ensurePortfolio,
} from "../helpers/auth.helper";

describe("POST /api/recommendations", () => {

  let profCookies: string[] = [];
  let portfolioId: number;

  beforeAll(async () => {
    const prof = await createAndLoginProf();
    profCookies = prof.cookies;

    const owner = await createAndLoginStudent();
    const sId   = await getStudentId(owner.email);
    const p     = await ensurePortfolio(sId);
    portfolioId = p.id;
  });

  it("CR-01 : prof recommande un portfolio → 201 PENDING", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .set("Cookie", profCookies)
      .send({
        portfolioId,
        message: "Je recommande chaleureusement cet étudiant pour son sérieux.",
      });

    expect(res.status).toBe(201);
    expect(res.body.recommendation.statut).toBe("PENDING");
    expect(res.body.recommendation.portfolioId).toBe(portfolioId);
  });

  it("CR-02 : étudiant recommande un portfolio → 201 PENDING", async () => {
    const other = await createAndLoginStudent();
    const res = await request(app)
      .post("/api/recommendations")
      .set("Cookie", other.cookies)
      .send({
        portfolioId,
        message: "Excellent profil, je recommande vivement cet étudiant.",
      });

    expect(res.status).toBe(201);
    expect(res.body.recommendation.statut).toBe("PENDING");
  });

  it("CR-03 : message manquant → 400", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .set("Cookie", profCookies)
      .send({ portfolioId });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty("message");
  });

  it("CR-04 : message trop court (< 10 chars) → 400", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .set("Cookie", profCookies)
      .send({ portfolioId, message: "Bien." });

    expect(res.status).toBe(400);
  });

  it("CR-05 : portfolioId inexistant → 404", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .set("Cookie", profCookies)
      .send({ portfolioId: 999999, message: "Recommandation sans portfolio valide." });

    expect(res.status).toBe(404);
  });

  it("CR-06 : sans token → 401", async () => {
    const res = await request(app)
      .post("/api/recommendations")
      .send({ portfolioId, message: "Test sans authentification." });

    expect(res.status).toBe(401);
  });
});