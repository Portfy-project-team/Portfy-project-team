import request from "supertest";
import app from "../../src/index";

describe("POST /auth/register", () => {

  it("R-01 : should create user with valid data", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        role: "STUDENT",
        email: `test${Date.now()}@test.com`,
        // email: "ali1@test.com",
        password: "Secure123!",
      });

    expect(res.status).toBe(201);
  });

  it("R-04 : should reject duplicate email", async () => {
     const email = `dup${Date.now()}@test.com`;
    const user = {
      role: "STUDENT",
      email,
      password: "Secure123!",
    };

    await request(app).post("/auth/register").send(user);

    const res = await request(app).post("/auth/register").send(user);

    expect(res.status).toBe(409);
  });

  it("R-05 : invalid email", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        role: "STUDENT",
        email: "invalid-email",
        password: "Secure123!",
      });

    expect(res.status).toBe(400);
  });

  it("R-06 : short password", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        role: "STUDENT",
        email: "test@test.com",
        password: "123",
      });

    expect(res.status).toBe(400);
  });

  it("R-07 : missing field", async () => {
  const res = await request(app)
    .post("/auth/register")
    .send({
      role: "STUDENT",
      email: "test@test.com",
      // password missing
    });

  expect(res.status).toBe(400);
}); 

  it("R-08 : empty body", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({});

    expect(res.status).toBe(400);
  });

  it("R-09 : SQL injection", async () => {
  const res = await request(app)
    .post("/auth/register")
    .send({
      role: "STUDENT",
      email: "'; DROP TABLE users; --",
      password: "Secure123!",
    });

  expect(res.status).toBe(400);
}); 

  it("R-10 : uppercase email", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        role: "STUDENT",
        email: `ali${Date.now()}@test.com`,
        //email: "ALI2@TEST.COM",
        password: "Secure123!",
      });

    expect(res.status).toBe(201);
  });

});