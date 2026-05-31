// import request from "supertest";
// import app from "../../src/index";

// const validStudent = {
//   name:     "Jean",
//   prenom:   "Dupont",
//   role:     "STUDENT",
//   password: "SecurePassword123!!!",
// };

// describe("POST /api/auth/register", () => {

//   it("R-01 : should create user with valid data", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({ ...validStudent, email: `test${Date.now()}@test.com` });

//     expect(res.status).toBe(201);
//   });

//   it("R-04 : should reject duplicate email", async () => {
//     const email = `dup${Date.now()}@test.com`;
//     const user  = { ...validStudent, email };

//     await request(app).post("/api/auth/register").send(user);
//     const res = await request(app).post("/api/auth/register").send(user);

//     expect(res.status).toBe(409);
//   });

//   it("R-05 : invalid email returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({ ...validStudent, email: "invalid-email" });

//     expect(res.status).toBe(400);
//   });

//   it("R-06 : short password returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({ ...validStudent, email: "test@test.com", password: "123" });

//     expect(res.status).toBe(400);
//   });

//   it("R-07 : missing password returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({ name: "Jean", prenom: "Dupont", role: "STUDENT", email: "test@test.com" });

//     expect(res.status).toBe(400);
//   });

//   it("R-08 : empty body returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({});

//     expect(res.status).toBe(400);
//   });

//   it("R-09 : SQL injection in email returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({ ...validStudent, email: "'; DROP TABLE users; --" });

//     expect(res.status).toBe(400);
//   });

//   it("R-10 : uppercase email normalised and accepted", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({ ...validStudent, email: `ALI${Date.now()}@TEST.COM` });

//     expect(res.status).toBe(201);
//   });

//   it("R-11 : PROF role accepted with valid data", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({
//         ...validStudent,
//         email: `prof${Date.now()}@test.com`,
//         role:  "PROF",
//       });

//     expect(res.status).toBe(201);
//   });

//   it("R-12 : PRO role accepted with valid data", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({
//         ...validStudent,
//         email: `pro${Date.now()}@test.com`,
//         role:  "PRO",
//       });

//     expect(res.status).toBe(201);
//   });

//   it("R-13 : missing name returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({
//         prenom:   "Dupont",
//         email:    `noname${Date.now()}@test.com`,
//         password: "SecurePassword123!!!",
//         role:     "STUDENT",
//       });

//     expect(res.status).toBe(400);
//   });

//   it("R-14 : missing prenom returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({
//         name:     "Jean",
//         email:    `noprenom${Date.now()}@test.com`,
//         password: "SecurePassword123!!!",
//         role:     "STUDENT",
//       });

//     expect(res.status).toBe(400);
//   });

//   it("R-15 : invalid role returns 400", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({
//         ...validStudent,
//         email: `badrole${Date.now()}@test.com`,
//         role:  "SUPERUSER",
//       });

//     expect(res.status).toBe(400);
//   });
// });

// // // tests/auth/register.test.ts
// // // Le registerSchema exige maintenant name et prenom en plus de email/password/role
// // import request from "supertest";
// // import app from "../../src/index";
 
// // // Payload valide de base
// // const validStudent = {
// //   name:     "Jean",
// //   prenom:   "Dupont",
// //   role:     "STUDENT",
// //   password: "SecurePassword123!!!",
// // };
 
// // describe("POST /api/auth/register", () => {
 
// //   it("R-01 : should create user with valid data", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({ ...validStudent, email: `test${Date.now()}@test.com` });
 
// //     expect(res.status).toBe(201);
// //   });
 
// //   it("R-04 : should reject duplicate email", async () => {
// //     const email = `dup${Date.now()}@test.com`;
// //     const user  = { ...validStudent, email };
 
// //     await request(app).post("/api/auth/register").send(user);
// //     const res = await request(app).post("/api/auth/register").send(user);
 
// //     expect(res.status).toBe(409);
// //   });
 
// //   it("R-05 : invalid email returns 400", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({ ...validStudent, email: "invalid-email" });
 
// //     expect(res.status).toBe(400);
// //   });
 
// //   it("R-06 : short password returns 400", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({ ...validStudent, email: "test@test.com", password: "123" });
 
// //     expect(res.status).toBe(400);
// //   });
 
// //   it("R-07 : missing password returns 400", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({ name: "Jean", prenom: "Dupont", role: "STUDENT", email: "test@test.com" });
 
// //     expect(res.status).toBe(400);
// //   });
 
// //   it("R-08 : empty body returns 400", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({});
 
// //     expect(res.status).toBe(400);
// //   });
 
// //   it("R-09 : SQL injection in email returns 400", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({ ...validStudent, email: "'; DROP TABLE users; --" });
 
// //     expect(res.status).toBe(400);
// //   });
 
// //   it("R-10 : uppercase email normalised and accepted", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({ ...validStudent, email: `ALI${Date.now()}@TEST.COM` });
 
// //     expect(res.status).toBe(201);
// //   });
 
// //   it("R-11 : PROF role accepted with valid data", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         ...validStudent,
// //         email: `prof${Date.now()}@test.com`,
// //         role:  "PROF",
// //       });
 
// //     expect(res.status).toBe(201);
// //   });
 
// //   it("R-12 : PRO role accepted with valid data", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         ...validStudent,
// //         email: `pro${Date.now()}@test.com`,
// //         role:  "PRO",
// //       });
 
// //     expect(res.status).toBe(201);
// //   });
 
// //   it("R-13 : missing name returns 400", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         prenom:   "Dupont",
// //         email:    `noname${Date.now()}@test.com`,
// //         password: "SecurePassword123!!!",
// //         role:     "STUDENT",
// //       });
 
// //     expect(res.status).toBe(400);
// //   });
// // });
// // import request from "supertest";
// // import app from "../../src/index";
// // // import { cleanDatabase } from '../helpers/db.helper';

// // describe("POST /api/auth/register", () => {

// //   it("R-01 : should create user with valid data", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         role: "STUDENT",
// //         email: `test${Date.now()}@test.com`,
// //         password: "SecurePassword123!!!",
// //       });

// //     expect(res.status).toBe(201);
// //   });

// //   it("R-04 : should reject duplicate email", async () => {
// //     const email = `dup${Date.now()}@test.com`;

// //     const user = {
// //       role: "STUDENT",
// //       email,
// //       password: "SecurePassword123!!!",
// //     };

// //     await request(app).post("/api/auth/register").send(user);

// //     const res = await request(app).post("/api/auth/register").send(user);

// //     expect(res.status).toBe(409);
// //   });

// //   it("R-05 : invalid email", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         role: "STUDENT",
// //         email: "invalid-email",
// //         password: "SecurePassword123!!!",
// //       });

// //     expect(res.status).toBe(400);
// //   });

// //   it("R-06 : short password", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         role: "STUDENT",
// //         email: "test@test.com",
// //         password: "123",
// //       });

// //     expect(res.status).toBe(400);
// //   });

// //   it("R-07 : missing field", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         role: "STUDENT",
// //         email: "test@test.com",
// //       });

// //     expect(res.status).toBe(400);
// //   });

// //   it("R-08 : empty body", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({});

// //     expect(res.status).toBe(400);
// //   });

// //   it("R-09 : SQL injection", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         role: "STUDENT",
// //         email: "'; DROP TABLE users; --",
// //         password: "SecurePassword123!!!",
// //       });

// //     expect(res.status).toBe(400);
// //   });

// //   it("R-10 : uppercase email", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         role: "STUDENT",
// //         email: `ALI${Date.now()}@TEST.COM`,
// //         password: "SecurePassword123!!!",
// //       });

// //     expect(res.status).toBe(201);
// //   });

// // });








// // import request from "supertest";
// // import app from "../../src/index";

// // describe("POST /api/auth/register", () => {

// //   it("R-01 : should create user with valid data", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         role: "STUDENT",
// //         email: `test${Date.now()}@test.com`,
// //         // email: "ali1@test.com",
// //         password: "Secure123!",
// //       });

// //     expect(res.status).toBe(201);
// //   });

// //   it("R-04 : should reject duplicate email", async () => {
// //      const email = `dup${Date.now()}@test.com`;
// //     const user = {
// //       role: "STUDENT",
// //       email,
// //       password: "Secure123!",
// //     };

// //     await request(app).post("/api/auth/register").send(user);

// //     const res = await request(app).post("/api/auth/register").send(user);

// //     expect(res.status).toBe(409);
// //   });

// //   it("R-05 : invalid email", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         role: "STUDENT",
// //         email: "invalid-email",
// //         password: "Secure123!",
// //       });

// //     expect(res.status).toBe(400);
// //   });

// //   it("R-06 : short password", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         role: "STUDENT",
// //         email: "test@test.com",
// //         password: "123",
// //       });

// //     expect(res.status).toBe(400);
// //   });

// //   it("R-07 : missing field", async () => {
// //   const res = await request(app)
// //     .post("/api/auth/register")
// //     .send({
// //       role: "STUDENT",
// //       email: "test@test.com",
// //       // password missing
// //     });

// //   expect(res.status).toBe(400);
// // }); 

// //   it("R-08 : empty body", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({});

// //     expect(res.status).toBe(400);
// //   });

// //   it("R-09 : SQL injection", async () => {
// //   const res = await request(app)
// //     .post("/api/auth/register")
// //     .send({
// //       role: "STUDENT",
// //       email: "'; DROP TABLE users; --",
// //       password: "Secure123!",
// //     });

// //   expect(res.status).toBe(400);
// // }); 

// //   it("R-10 : uppercase email", async () => {
// //     const res = await request(app)
// //       .post("/api/auth/register")
// //       .send({
// //         role: "STUDENT",
// //         email: `ali${Date.now()}@test.com`,
// //         //email: "ALI2@TEST.COM",
// //         password: "Secure123!",
// //       });

// //     expect(res.status).toBe(201);
// //   });

// // });
import request from "supertest";
import app from "../../src/index";

const validStudent = {
  name:     "Jean",
  prenom:   "Dupont",
  role:     "STUDENT",
  password: "SecurePassword123!!!",
};

describe("POST /api/auth/register", () => {

  it("R-01 : valid STUDENT data returns 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validStudent, email: `r01${Date.now()}@test.com` });

    expect(res.status).toBe(201);
  });

  it("R-04 : duplicate email returns 409", async () => {
    const email = `dup${Date.now()}@test.com`;
    await request(app).post("/api/auth/register").send({ ...validStudent, email });
    const res = await request(app).post("/api/auth/register").send({ ...validStudent, email });

    expect(res.status).toBe(409);
  });

  it("R-05 : invalid email returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validStudent, email: "invalid-email" });

    expect(res.status).toBe(400);
  });

  it("R-06 : short password returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validStudent, email: `r06${Date.now()}@test.com`, password: "123" });

    expect(res.status).toBe(400);
  });

  it("R-07 : missing password returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Jean", prenom: "Dupont", role: "STUDENT", email: `r07${Date.now()}@test.com` });

    expect(res.status).toBe(400);
  });

  it("R-08 : empty body returns 400", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.status).toBe(400);
  });

  it("R-09 : SQL injection in email returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validStudent, email: "'; DROP TABLE users; --" });

    expect(res.status).toBe(400);
  });

  it("R-10 : uppercase email is normalised and accepted", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validStudent, email: `R10${Date.now()}@TEST.COM` });

    expect(res.status).toBe(201);
  });

  it("R-11 : PROF role returns 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validStudent, email: `prof${Date.now()}@test.com`, role: "PROF" });

    expect(res.status).toBe(201);
  });

  it("R-12 : PRO role returns 201", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validStudent, email: `pro${Date.now()}@test.com`, role: "PRO" });

    expect(res.status).toBe(201);
  });

  it("R-13 : missing name returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ prenom: "Dupont", email: `r13${Date.now()}@test.com`, password: "SecurePassword123!!!", role: "STUDENT" });

    expect(res.status).toBe(400);
  });

  it("R-14 : missing prenom returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "Jean", email: `r14${Date.now()}@test.com`, password: "SecurePassword123!!!", role: "STUDENT" });

    expect(res.status).toBe(400);
  });

  it("R-15 : invalid role returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ ...validStudent, email: `r15${Date.now()}@test.com`, role: "SUPERUSER" });

    expect(res.status).toBe(400);
  });
});