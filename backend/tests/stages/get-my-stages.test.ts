import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent, createAndLoginProf, getProfId } from "../helpers/auth.helper";

describe("GET /api/stages/me", () => {

  let cookies: string[] = [];

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    cookies = s.cookies;
    const prof = await createAndLoginProf();
    const encadrantId = await getProfId(prof.email);

    await request(app).post("/api/stages").set("Cookie", cookies).send({
      entreprise: "Stage Test", dateDebut: "2024-01-01", dateFin: "2024-06-01", encadrantId,
    });
  });

  it("GMS-01 : get my stages returns array", async () => {
    const res = await request(app).get("/api/stages/me").set("Cookie", cookies);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GMS-02 : no token returns 401", async () => {
    const res = await request(app).get("/api/stages/me");
    expect(res.status).toBe(401);
  });
});