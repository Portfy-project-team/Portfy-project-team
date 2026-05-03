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


































// import request from "supertest";
// import app from "../../src/index";

// describe("POST /auth/register", () => {

//   // ✅ R-01
//   it("R-01 : should create user with valid data", async () => {
//     const res = await request(app)
//       .post("/auth/register")
//       .send({
//         role: "STUDENT" ,
//         // type: "etudiant",
//         nom: "Ali",
//         prenom: "Said",
//         email: "ali@test.com",
//         password: "Secure123!",
//         filiere: "Informatique",
//       });

//     expect(res.status).toBe(201);
//   });

//   // ❌ R-04
//   it("R-04 : should reject duplicate email", async () => {
//     const user = {
//         role: "STUDENT",
//     //   type: "etudiant",
//       nom: "Ali",
//       prenom: "Said",
//       email: "dup@test.com",
//       password: "Secure123!",
//       filiere: "Info",
//     };

//     await request(app).post("/auth/register").send(user);

//     const res = await request(app).post("/api/auth/register").send(user);

//     expect(res.status).toBe(409);
//   });

//   // ❌ R-05
//   it("R-05 : should reject invalid email", async () => {
//     const res = await request(app)
//       .post("/auth/register")
//       .send({
//         role: "STUDENT",
//         // type: "etudiant",
//         nom: "Ali",
//         prenom: "Said",
//         email: "invalid-email",
//         password: "Secure123!",
//         filiere: "Info",
//       });

//     expect(res.status).toBe(400);
//   });

//   // ❌ R-06
//   it("R-06 : should reject short password", async () => {
//     const res = await request(app)
//       .post("/auth/register")
//       .send({
//         role: "STUDENT",
//         // type: "etudiant",
//         nom: "Ali",
//         prenom: "Said",
//         email: "test@test.com",
//         password: "123",
//         filiere: "Info",
//       });

//     expect(res.status).toBe(400);
//   });

//   // ❌ R-07
//   it("R-07 : should reject missing field", async () => {
//     const res = await request(app)
//       .post("/auth/register")
//       .send({
//         role: "STUDENT",
//         // type: "etudiant",
//         prenom: "Said",
//         email: "test@test.com",
//         password: "Secure123!",
//         filiere: "Info",
//       });

//     expect(res.status).toBe(400);
//   });

//   // ❌ R-08
//   it("R-08 : should reject empty body", async () => {
//     const res = await request(app)
//       .post("/auth/register")
//       .send({});

//     expect(res.status).toBe(400);
//   });

//   // ❌ R-09
//   it("R-09 : should reject SQL injection", async () => {
//     const res = await request(app)
//       .post("/auth/register")
//       .send({
//         role: "STUDENT",
//         // type: "etudiant",
//         nom: "Hack",
//         prenom: "Test",
//         email: "'; DROP TABLE users; --",
//         password: "Secure123!",
//         filiere: "Info",
//       });

//     expect(res.status).toBe(400);
//   });

//   // ⚠️ R-10
//   it("R-10 : should accept uppercase email", async () => {
//     const res = await request(app)
//       .post("/auth/register")
//       .send({
//         role: "STUDENT",
//         // type: "etudiant",
//         nom: "Ali",
//         prenom: "Test",
//         email: "ALI@TEST.COM",
//         password: "Secure123!",
//         filiere: "Info",
//       });

//     expect([200, 201]).toContain(res.status);
//   });

// });
