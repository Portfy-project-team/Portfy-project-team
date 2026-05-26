import request from "supertest";
import app from "../../src/index.js";

describe("Security - Invalid JWT", () => {
  it("should reject invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", "Bearer fake-token");

    expect([401, 403]).toContain(res.status);
  });
});


// import request from "supertest";
// import app from "../../src/index.js";

// describe("Security - Invalid JWT", () => {
//   it("should reject invalid token", async () => {
//     const res = await request(app)
//       .get("/api/auth/me")
//       .set("Authorization", "Bearer fake-token");

//     expect(res.status).toBe(401);
//   });
// });
