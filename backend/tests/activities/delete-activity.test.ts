import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("DELETE /api/activities/:id", () => {

  let studentCookies: string[] = [];
  let activityId: number;

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    studentCookies = s.cookies;

    const res = await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({ nom: "Activité à supprimer", type: "Bénévolat" });

    activityId = res.body.activity.id;
  });

  it("DA-01 : supprimer une activité PENDING → 200", async () => {
    const res = await request(app)
      .delete(`/api/activities/${activityId}`)
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
  });

  it("DA-02 : activité déjà supprimée → 403 ou 404", async () => {
    const res = await request(app)
      .delete(`/api/activities/${activityId}`)
      .set("Cookie", studentCookies);

    expect([403, 404]).toContain(res.status);
  });

  it("DA-03 : ID invalide → 400", async () => {
    const res = await request(app)
      .delete("/api/activities/abc")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(400);
  });

  it("DA-04 : autre étudiant ne peut pas supprimer → 403", async () => {
    // Créer une nouvelle activité
    const newRes = await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({ nom: "Activité protégée" });

    const newId = newRes.body.activity.id;

    const other = await createAndLoginStudent();
    const res = await request(app)
      .delete(`/api/activities/${newId}`)
      .set("Cookie", other.cookies);

    expect(res.status).toBe(403);
  });

  it("DA-05 : sans token → 401", async () => {
    const res = await request(app).delete(`/api/activities/${activityId}`);
    expect(res.status).toBe(401);
  });
});