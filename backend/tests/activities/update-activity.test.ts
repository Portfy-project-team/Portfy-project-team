import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("PUT /api/activities/:id", () => {

  let studentCookies: string[] = [];
  let activityId: number;

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    studentCookies = s.cookies;

    const res = await request(app)
      .post("/api/activities")
      .set("Cookie", studentCookies)
      .send({ nom: "Activité à modifier", type: "Culture" });

    activityId = res.body.activity.id;
  });

  it("UA-01 : modifier le nom d'une activité → 200", async () => {
    const res = await request(app)
      .put(`/api/activities/${activityId}`)
      .set("Cookie", studentCookies)
      .send({ nom: "Nom modifié" });

    expect(res.status).toBe(200);
    expect(res.body.activity.nom).toBe("Nom modifié");
  });

  it("UA-02 : modifier la description → 200", async () => {
    const res = await request(app)
      .put(`/api/activities/${activityId}`)
      .set("Cookie", studentCookies)
      .send({ description: "Nouvelle description de l'activité" });

    expect(res.status).toBe(200);
    expect(res.body.activity.description).toBe("Nouvelle description de l'activité");
  });

  it("UA-03 : ID invalide (string) → 400", async () => {
    const res = await request(app)
      .put("/api/activities/abc")
      .set("Cookie", studentCookies)
      .send({ nom: "Test" });

    expect(res.status).toBe(400);
  });

  it("UA-04 : activité inexistante → 403 ou 404", async () => {
    const res = await request(app)
      .put("/api/activities/999999")
      .set("Cookie", studentCookies)
      .send({ nom: "Test" });

    expect([403, 404]).toContain(res.status);
  });

  it("UA-05 : autre étudiant ne peut pas modifier → 403", async () => {
    const other = await createAndLoginStudent();
    const res = await request(app)
      .put(`/api/activities/${activityId}`)
      .set("Cookie", other.cookies)
      .send({ nom: "Tentative" });

    expect(res.status).toBe(403);
  });

  it("UA-06 : sans token → 401", async () => {
    const res = await request(app)
      .put(`/api/activities/${activityId}`)
      .send({ nom: "Test" });

    expect(res.status).toBe(401);
  });
});