import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("GET /api/notifications", () => {

  let cookies: string[] = [];

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    cookies = s.cookies;
  });

  it("GN-01 : authenticated user gets notifications array", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("notifications");
    expect(Array.isArray(res.body.notifications)).toBe(true);
  });

  it("GN-02 : no token returns 401", async () => {
    const res = await request(app).get("/api/notifications");
    expect(res.status).toBe(401);
  });
});