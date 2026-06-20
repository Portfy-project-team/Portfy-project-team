import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent, createAndLoginProf, getProfId } from "../helpers/auth.helper";

describe("POST /api/stages", () => {

  let studentCookies: string[] = [];
  let encadrantId: number;

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    studentCookies = s.cookies;

    const prof = await createAndLoginProf();
    encadrantId = await getProfId(prof.email);
  });

  it("CS-01 : create stage with valid data", async () => {
    const res = await request(app)
      .post("/api/stages")
      .set("Cookie", studentCookies)
      .send({
        entreprise:  "Google",
        dateDebut:   "2024-01-01",
        dateFin:     "2024-06-01",
        encadrantId,
        mission:     "Développement web",
        technologies: ["React", "Node.js"],
      });

    expect(res.status).toBe(201);
    expect(res.body.entreprise).toBe("Google");
    expect(res.body.statutV).toBe("PENDING");
  });

  it("CS-02 : missing entreprise returns 400", async () => {
    const res = await request(app)
      .post("/api/stages")
      .set("Cookie", studentCookies)
      .send({ dateDebut: "2024-01-01", dateFin: "2024-06-01", encadrantId });

    expect(res.status).toBe(400);
  });

  it("CS-03 : dateFin before dateDebut returns 400", async () => {
    const res = await request(app)
      .post("/api/stages")
      .set("Cookie", studentCookies)
      .send({
        entreprise: "Test",
        dateDebut:  "2024-06-01",
        dateFin:    "2024-01-01",
        encadrantId,
      });

    expect(res.status).toBe(400);
  });

  it("CS-04 : invalid encadrantId returns 404", async () => {
    const res = await request(app)
      .post("/api/stages")
      .set("Cookie", studentCookies)
      .send({
        entreprise:  "Test",
        dateDebut:   "2024-01-01",
        dateFin:     "2024-06-01",
        encadrantId: 999999,
      });

    expect(res.status).toBe(404);
  });

  it("CS-05 : no token returns 401", async () => {
    const res = await request(app)
      .post("/api/stages")
      .send({ entreprise: "Test", dateDebut: "2024-01-01", dateFin: "2024-06-01", encadrantId });

    expect(res.status).toBe(401);
  });
});