import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent, createAndLoginAdmin } from "../helpers/auth.helper";

describe("PUT /api/activities/:id/validate et reject", () => {

  let adminCookies:   string[] = [];
  let studentCookies: string[] = [];
  let activityIdForValidate: number;
  let activityIdForReject:   number;

  beforeAll(async () => {
    const admin   = await createAndLoginAdmin();
    adminCookies  = admin.cookies;

    const student = await createAndLoginStudent();
    studentCookies = student.cookies;

    const r1 = await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({ nom: "Activité à valider", type: "Sport" });
    activityIdForValidate = r1.body.activity.id;

    const r2 = await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({ nom: "Activité à rejeter", type: "Art" });
    activityIdForReject = r2.body.activity.id;
  });

  it("VRA-01 : admin valide une activité PENDING → 200 VALIDATED", async () => {
    const res = await request(app)
      .put(`/api/activities/${activityIdForValidate}/validate`)
      .set("Cookie", adminCookies);

    expect(res.status).toBe(200);
    expect(res.body.activity.statutV).toBe("VALIDATED");
  });

  it("VRA-02 : admin rejette une activité PENDING → 200 REJECTED", async () => {
    const res = await request(app)
      .put(`/api/activities/${activityIdForReject}/reject`)
      .set("Cookie", adminCookies);

    expect(res.status).toBe(200);
    expect(res.body.activity.statutV).toBe("REJECTED");
  });

  it("VRA-03 : valider une activité déjà VALIDATED → 400", async () => {
    const res = await request(app)
      .put(`/api/activities/${activityIdForValidate}/validate`)
      .set("Cookie", adminCookies);

    expect(res.status).toBe(400);
  });

  it("VRA-04 : étudiant ne peut pas valider → 403", async () => {
    const s = await createAndLoginStudent();
    const r = await request(app)
      .post("/api/activities")
      .set("Cookie", s.cookies)
      .send({ nom: "Nouvelle activité" });

    const res = await request(app)
      .put(`/api/activities/${r.body.activity.id}/validate`)
      .set("Cookie", s.cookies);

    expect(res.status).toBe(403);
  });

  it("VRA-05 : ID invalide → 400", async () => {
    const res = await request(app)
      .put("/api/activities/abc/validate")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(400);
  });

  it("VRA-06 : activité inexistante → 404", async () => {
    const res = await request(app)
      .put("/api/activities/999999/validate")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(404);
  });

  it("VRA-07 : sans token → 401", async () => {
    const res = await request(app)
      .put(`/api/activities/${activityIdForValidate}/validate`);

    expect(res.status).toBe(401);
  });
});