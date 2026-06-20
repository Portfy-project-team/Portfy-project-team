import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("DELETE /api/skills/me/:skillId", () => {

  let studentCookies: string[] = [];
  let skillId: number;

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    studentCookies = s.cookies;

    const res = await request(app)
      .post("/api/skills/me")
      .set("Cookie", studentCookies)
      .send({ nom: `Git${Date.now()}`, niveau: "AVANCE" });

    skillId = res.body.skill.skillId;
  });

  it("DS-01 : supprimer une compétence → 200", async () => {
    const res = await request(app)
      .delete(`/api/skills/me/${skillId}`)
      .set("Cookie", studentCookies);

    expect(res.status).toBe(200);
  });

  it("DS-02 : compétence déjà supprimée → 404", async () => {
    const res = await request(app)
      .delete(`/api/skills/me/${skillId}`)
      .set("Cookie", studentCookies);

    expect(res.status).toBe(404);
  });

  it("DS-03 : ID invalide → 400", async () => {
    const res = await request(app)
      .delete("/api/skills/me/abc")
      .set("Cookie", studentCookies);

    expect(res.status).toBe(400);
  });

  it("DS-04 : sans token → 401", async () => {
    const res = await request(app).delete(`/api/skills/me/${skillId}`);
    expect(res.status).toBe(401);
  });
});