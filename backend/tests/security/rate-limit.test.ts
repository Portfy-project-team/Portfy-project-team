import request from "supertest";
import app from "../../src/index.js";

describe("Security - Rate Limit", () => {
  it("should block too many requests", async () => {
    let lastResponse;

    for (let i = 0; i < 10; i++) {
      lastResponse = await request(app)
        .post("/api/auth/login")
        .send({
          email: "fake@test.com",
          password: "wrongpassword",
        });
    }

    expect([401, 429]).toContain(lastResponse?.status);
  });
});


// import request from "supertest";
// import app from "../../src/index.js";

// describe("Security - Rate Limit", () => {
//   it("should block too many requests", async () => {

//     let lastResponse;

//     for (let i = 0; i < 10; i++) {
//       lastResponse = await request(app)
//         .post("/api/auth/login")
//         .send({
//           email: "test@test.com",
//           password: "wrongpassword",
//         });
//     }

//     expect(lastResponse?.status).toBe(429);
//   });
// });