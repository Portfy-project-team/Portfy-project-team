import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent, createAndLoginProf, getProfId } from "../helpers/auth.helper";

describe("PATCH /api/stages/:id/submit", () => {

  let studentCookies: string[] = [];
  let stageId: number;

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    studentCookies = s.cookies;
    const prof = await createAndLoginProf();
    const encadrantId = await getProfId(prof.email);

    const res = await request(app).post("/api/stages").set("Cookie", studentCookies).send({
      entreprise: "Submit Test", dateDebut: "2024-01-01", dateFin: "2024-06-01", encadrantId,
    });
    stageId = res.body.id;
  });

  it("SS-01 : submit stage changes status to SUBMITTED", async () => {
    const res = await request(app)
      .patch(`/api/stages/${stageId}/submit`)
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
    expect(res.body.statutV).toBe("SUBMITTED");
  });

  it("SS-02 : submit already submitted stage returns 400", async () => {
    const res = await request(app)
      .patch(`/api/stages/${stageId}/submit`)
      .set("Cookie", studentCookies);

    expect(res.status).toBe(400);
  });

  it("SS-03 : no token returns 401", async () => {
    const res = await request(app).patch(`/api/stages/${stageId}/submit`);
    expect(res.status).toBe(401);
  });
});