import request from "supertest";
import app from "../../src/index";

describe("Auth Middleware", () => {

  it("MW-01 : access protected route with token", async () => {
    const email = `mw${Date.now()}@test.com`;

    await request(app).post("/api/auth/register").send({
      email,
      password: "Secure123!!!",
      role: "STUDENT",
    });

    const login = await request(app).post("/api/auth/login").send({
      email,
      password: "Secure123!!!",
    });

    const cookies = login.headers["set-cookie"];

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
  });

  it("MW-02 : no token", async () => {
    const res = await request(app)
      .post("/api/auth/logout");

    expect(res.status).toBe(401);
  });

});
// describe("placeholder", () => {
//   it("should pass", () => {
//     expect(true).toBe(true);
//   });
// });  
