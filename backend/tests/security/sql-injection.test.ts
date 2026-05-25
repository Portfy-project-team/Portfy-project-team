import request from "supertest";
import app from "../../src/index.js";

describe("Security - SQL Injection", () => {
  it("should reject SQL injection payload", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "' OR 1=1 --",
        password: "' OR 1=1 --",
      });

    expect([400, 401]).toContain(res.status);
  });
});
// import request from "supertest";
// import app from "../../src/index.js";

// describe("Security - SQL Injection", () => {
//   it("should reject SQL injection payload", async () => {
//     const res = await request(app)
//       .post("/api/auth/login")
//       .send({
//         email: "'; DROP TABLE users; --",
//         password: "test123",
//       });

//     expect(res.status).toBe(400);
//   });
// });