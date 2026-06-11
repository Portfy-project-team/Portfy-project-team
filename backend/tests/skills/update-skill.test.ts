import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("PUT /api/skills/me/:skillId", () => {

  let studentCookies: string[] = [];
  let skillId: number;

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    studentCookies = s.cookies;

    const res = await request(app)
      .post("/api/skills/me")
      .set("Cookie", studentCookies)
      .send({ nom: `Docker${Date.now()}`, niveau: "DEBUTANT" });

    skillId = res.body.skill.skillId;
  });

  it("US-01 : modifier le niveau → 200", async () => {
    const res = await request(app)
      .put(`/api/skills/me/${skillId}`)
      .set("Cookie", studentCookies)
      .send({ niveau: "AVANCE" });

    expect(res.status).toBe(200);
    expect(res.body.skill.niveau).toBe("AVANCE");
  });

  it("US-02 : niveau invalide → 400", async () => {
    const res = await request(app)
      .put(`/api/skills/me/${skillId}`)
      .set("Cookie", studentCookies)
      .send({ niveau: "NINJA" });

    expect(res.status).toBe(400);
  });

  it("US-03 : compétence inexistante → 404", async () => {
    const res = await request(app)
      .put("/api/skills/me/999999")
      .set("Cookie", studentCookies)
      .send({ niveau: "EXPERT" });

    expect(res.status).toBe(404);
  });

  it("US-04 : ID invalide → 400", async () => {
    const res = await request(app)
      .put("/api/skills/me/abc")
      .set("Cookie", studentCookies)
      .send({ niveau: "EXPERT" });

    expect(res.status).toBe(400);
  });

  it("US-05 : sans token → 401", async () => {
    const res = await request(app)
      .put(`/api/skills/me/${skillId}`)
      .send({ niveau: "EXPERT" });

    expect(res.status).toBe(401);
  });
});