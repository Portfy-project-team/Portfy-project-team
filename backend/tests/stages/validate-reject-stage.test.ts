import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent, createAndLoginProf, getProfId } from "../helpers/auth.helper";

describe("PATCH /api/stages/:id/validate and reject", () => {

  let profCookies: string[] = [];
  let studentCookies: string[] = [];
  let stageIdForValidate: number;
  let stageIdForReject: number;
  let encadrantId: number;

  beforeAll(async () => {
    const prof = await createAndLoginProf();
    profCookies = prof.cookies;
    encadrantId = await getProfId(prof.email);

    const s = await createAndLoginStudent();
    studentCookies = s.cookies;

    // Stage pour validation
    const r1 = await request(app).post("/api/stages").set("Cookie", studentCookies).send({
      entreprise: "Validate Corp", dateDebut: "2024-01-01", dateFin: "2024-06-01", encadrantId,
    });
    stageIdForValidate = r1.body.id;
    await request(app).patch(`/api/stages/${stageIdForValidate}/submit`).set("Cookie", studentCookies);

    // Stage pour rejet
    const r2 = await request(app).post("/api/stages").set("Cookie", studentCookies).send({
      entreprise: "Reject Corp", dateDebut: "2024-07-01", dateFin: "2024-12-01", encadrantId,
    });
    stageIdForReject = r2.body.id;
    await request(app).patch(`/api/stages/${stageIdForReject}/submit`).set("Cookie", studentCookies);
  });

  it("VS-01 : prof validate stage", async () => {
    const res = await request(app)
      .patch(`/api/stages/${stageIdForValidate}/validate`)
      .set("Cookie", profCookies);

    expect(res.status).toBe(200);
    expect(res.body.stage.statutV).toBe("VALIDATED");
  });

  it("VS-02 : prof reject stage with reason", async () => {
    const res = await request(app)
      .patch(`/api/stages/${stageIdForReject}/reject`)
      .set("Cookie", profCookies)
      .send({ raison: "Documentation insuffisante" });

    expect(res.status).toBe(200);
    expect(res.body.stage.statutV).toBe("REJECTED");
  });

  it("VS-03 : reject without reason returns 400", async () => {
    const res = await request(app)
      .patch(`/api/stages/${stageIdForReject}/reject`)
      .set("Cookie", profCookies)
      .send({});

    expect(res.status).toBe(400);
  });

  it("VS-04 : student cannot validate stage", async () => {
    const res = await request(app)
      .patch(`/api/stages/${stageIdForValidate}/validate`)
      .set("Cookie", studentCookies);

    expect(res.status).toBe(403);
  });

  it("VS-05 : no token returns 401", async () => {
    const res = await request(app).patch(`/api/stages/${stageIdForValidate}/validate`);
    expect(res.status).toBe(401);
  });
});