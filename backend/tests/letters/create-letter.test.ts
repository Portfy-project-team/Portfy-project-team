import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent, createAndLoginProf, getStudentId } from "../helpers/auth.helper";

describe("POST /api/letters", () => {

  let profCookies: string[] = [];
  let studentId: number;

  beforeAll(async () => {
    const prof = await createAndLoginProf();
    profCookies = prof.cookies;

    const s = await createAndLoginStudent();
    studentId = await getStudentId(s.email);
  });

  it("CL-01 : prof creates letter for student", async () => {
    const res = await request(app)
      .post("/api/letters")
      .set("Cookie", profCookies)
      .send({
        studentId,
        contenu: "Étudiant très sérieux et compétent.",
        type:    "Recommandation académique",
      });

    expect(res.status).toBe(201);
    expect(res.body.letter.visibilite).toBe("PRIVATE");
  });

  it("CL-02 : contenu too short returns 400", async () => {
    const res = await request(app)
      .post("/api/letters")
      .set("Cookie", profCookies)
      .send({ studentId, contenu: "Court" });

    expect(res.status).toBe(400);
  });

  it("CL-03 : invalid studentId returns 404", async () => {
    const res = await request(app)
      .post("/api/letters")
      .set("Cookie", profCookies)
      .send({ studentId: 999999, contenu: "Contenu valide de la lettre." });

    expect(res.status).toBe(404);
  });

  it("CL-04 : student cannot create letter", async () => {
    const s = await createAndLoginStudent();
    const res = await request(app)
      .post("/api/letters")
      .set("Cookie", s.cookies)
      .send({ studentId, contenu: "Contenu valide de la lettre." });

    expect(res.status).toBe(403);
  });

  it("CL-05 : no token returns 401", async () => {
    const res = await request(app)
      .post("/api/letters")
      .send({ studentId, contenu: "Contenu valide de la lettre." });

    expect(res.status).toBe(401);
  });
});