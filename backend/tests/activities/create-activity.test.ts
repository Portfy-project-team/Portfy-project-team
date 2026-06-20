import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent, createAndLoginAdmin } from "../helpers/auth.helper";

describe("POST /api/activities", () => {

  let studentCookies: string[] = [];

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    studentCookies = s.cookies;
  });

  it("CA-01 : étudiant crée une activité valide → 201", async () => {
    const res = await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({
        nom:         "Hackathon National 2024",
        description: "Participation au hackathon organisé par l'ENSA",
        type:        "Compétition",
      });

    expect(res.status).toBe(201);
    expect(res.body.activity.nom).toBe("Hackathon National 2024");
    expect(res.body.activity.statutV).toBe("PENDING");
  });

  it("CA-02 : nom manquant → 400", async () => {
    const res = await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({ description: "Sans nom" });

    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty("nom");
  });

  it("CA-03 : nom trop court (< 3 chars) → 400", async () => {
    const res = await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({ nom: "AB" });

    expect(res.status).toBe(400);
  });

  it("CA-04 : URL attestation invalide → 400", async () => {
    const res = await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({ nom: "Activité test", attestationUrl: "pas-une-url" });

    expect(res.status).toBe(400);
  });

  it("CA-05 : URL attestation valide → 201", async () => {
    const res = await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({
        nom:            "Club Informatique",
        type:           "Club",
        attestationUrl: "https://example.com/attestation.pdf",
      });

    expect(res.status).toBe(201);
    expect(res.body.activity.attestationUrl).toBe("https://example.com/attestation.pdf");
  });

  it("CA-06 : sans token → 401", async () => {
    const res = await request(app)
      .post("/api/activities")
      .send({ nom: "Test" });

    expect(res.status).toBe(401);
  });

  it("CA-07 : ADMIN ne peut pas créer une activité (route STUDENT) → 403", async () => {
    const admin = await createAndLoginAdmin();
    const res = await request(app)
      .post("/api/activities")
      .set("Cookie", admin.cookies)
      .send({ nom: "Test admin" });

    expect(res.status).toBe(403);
  });

  it("CA-08 : champ inconnu rejeté (strict) → 400", async () => {
    const res = await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({ nom: "Test", champInconnu: "valeur" });

    expect(res.status).toBe(400);
  });
});