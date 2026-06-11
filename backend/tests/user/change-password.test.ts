// // // // import request from "supertest";
// // // // import app from "../../src/index";
// // // // import { prisma } from "../../src/utils/prisma";

// // // // describe("PATCH /api/user/change-password", () => {

// // // //   let cookies: string[] = [];

// // // //   beforeAll(async () => {

// // // //     const email = `changepass${Date.now()}@test.com`;

// // // //     await request(app)
// // // //       .post("/api/auth/register")
// // // //       .send({
// // // //         email,
// // // //         password: "OldPassword123!",
// // // //         role: "STUDENT",
// // // //       });

// // // //     await prisma.user.update({
// // // //       where: { email },
// // // //       data: {
// // // //         isEmailVerified: true,
// // // //       },
// // // //     });

// // // //     const login = await request(app)
// // // //       .post("/api/auth/login")
// // // //       .send({
// // // //         email,
// // // //         password: "OldPassword123!",
// // // //       });

// // // //     cookies = Array.isArray(login.headers["set-cookie"])
// // // //       ? login.headers["set-cookie"]
// // // //       : [];
// // // //   });

// // // //   it("CP-01 : change password success", async () => {

// // // //     const res = await request(app)
// // // //       .patch("/api/user/change-password")
// // // //       .set("Cookie", cookies)
// // // //       .send({
// // // //         currentPassword: "OldPassword123!",
// // // //         newPassword: "NewPassword123!",
// // // //       });

// // // //     expect(res.status).toBe(200);
// // // //   });

// // // //   it("CP-02 : wrong current password", async () => {

// // // //     const res = await request(app)
// // // //       .patch("/api/user/change-password")
// // // //       .set("Cookie", cookies)
// // // //       .send({
// // // //         currentPassword: "WrongPassword",
// // // //         newPassword: "NewPassword123!",
// // // //       });

// // // //     expect([400, 500]).toContain(res.status);
// // // //   });

// // // // });
// // // import request from "supertest";
// // // import app from "../../src/index";
// // // import { createAndLoginStudent } from "../helpers/auth.helper";

// // // describe("PATCH /api/user/change-password", () => {

// // //   let cookies: string[] = [];

// // //   beforeAll(async () => {
// // //     const s = await createAndLoginStudent();
// // //     cookies = s.cookies;
// // //   });

// // //   it("CP-01 : change password success", async () => {
// // //     const res = await request(app)
// // //       .patch("/api/user/change-password")
// // //       .set("Cookie", cookies)
// // //       .send({
// // //         currentPassword: "SecurePassword123!!!",
// // //         newPassword:     "NewSecurePass456!!!",
// // //       });

// // //     expect(res.status).toBe(200);
// // //   });

// // //   it("CP-02 : wrong current password returns 500", async () => {
// // //     const res = await request(app)
// // //       .patch("/api/user/change-password")
// // //       .set("Cookie", cookies)
// // //       .send({
// // //         currentPassword: "WrongPassword!!!",
// // //         newPassword:     "NewSecurePass456!!!",
// // //       });

// // //     expect([400, 500]).toContain(res.status);
// // //   });

// // //   it("CP-03 : missing fields returns 400", async () => {
// // //     const res = await request(app)
// // //       .patch("/api/user/change-password")
// // //       .set("Cookie", cookies)
// // //       .send({});

// // //     expect(res.status).toBe(400);
// // //   });

// // //   it("CP-04 : no token returns 401", async () => {
// // //     const res = await request(app)
// // //       .patch("/api/user/change-password")
// // //       .send({ currentPassword: "SecurePassword123!!!", newPassword: "NewPass456!!!" });

// // //     expect(res.status).toBe(401);
// // //   });
// // // });
// // import request from "supertest";
// // import app from "../../src/index";
// // import { createAndLoginStudent } from "../helpers/auth.helper";

// // describe("PATCH /api/user/change-password", () => {

// //   let cookies: string[] = [];

// //   beforeAll(async () => {
// //     const s = await createAndLoginStudent();
// //     cookies = s.cookies;
// //   });

// //   it("CP-01 : change password success", async () => {
// //     const res = await request(app)
// //       .patch("/api/user/change-password")
// //       .set("Cookie", cookies)
// //       .send({
// //         currentPassword: "SecurePassword123!!!",
// //         newPassword:     "NewSecurePass456!!!",
// //       });

// //     expect(res.status).toBe(200);
// //   });

// //   it("CP-02 : wrong current password returns error", async () => {
// //     const res = await request(app)
// //       .patch("/api/user/change-password")
// //       .set("Cookie", cookies)
// //       .send({
// //         currentPassword: "WrongPassword!!!",
// //         newPassword:     "NewSecurePass456!!!",
// //       });

// //     // Le service throw une erreur non-structurée → next(err) → 500
// //     expect([400, 500]).toContain(res.status);
// //   });

// //   it("CP-03 : missing fields returns 400", async () => {
// //     const res = await request(app)
// //       .patch("/api/user/change-password")
// //       .set("Cookie", cookies)
// //       .send({});

// //     // Maintenant le controller utilise safeParse → 400 proprement
// //     expect(res.status).toBe(400);
// //   });

// //   it("CP-04 : missing newPassword only returns 400", async () => {
// //     const res = await request(app)
// //       .patch("/api/user/change-password")
// //       .set("Cookie", cookies)
// //       .send({ currentPassword: "SecurePassword123!!!" });

// //     expect(res.status).toBe(400);
// //   });

// //   it("CP-05 : no token returns 401", async () => {
// //     const res = await request(app)
// //       .patch("/api/user/change-password")
// //       .send({
// //         currentPassword: "SecurePassword123!!!",
// //         newPassword:     "NewSecurePass456!!!",
// //       });

// //     expect(res.status).toBe(401);
// //   });
// // // });
// import request from "supertest";
// import app from "../../src/index";
// import { createAndLoginStudent } from "../helpers/auth.helper";

// describe("PATCH /api/user/change-password", () => {

//   let cookies: string[] = [];

//   beforeAll(async () => {
//     const s = await createAndLoginStudent();
//     cookies = s.cookies;
//   });

//   it("CP-01 : changer le mot de passe → 200", async () => {
//     const res = await request(app)
//       .patch("/api/user/change-password")
//       .set("Cookie", cookies)
//       .send({
//         currentPassword: "SecurePassword123!!!",
//         newPassword:     "NewSecure456!!!",
//       });

//     expect(res.status).toBe(200);
//   });

//   it("CP-02 : mauvais mot de passe actuel → erreur", async () => {
//     const res = await request(app)
//       .patch("/api/user/change-password")
//       .set("Cookie", cookies)
//       .send({
//         currentPassword: "MauvaisMotDePasse!",
//         newPassword:     "NewSecure456!!!",
//       });

//     expect([400, 401, 500]).toContain(res.status);
//   });

//   it("CP-03 : champs manquants → 400", async () => {
//     const res = await request(app)
//       .patch("/api/user/change-password")
//       .set("Cookie", cookies)
//       .send({});
//     expect(res.status).toBe(400);
//   });

//   it("CP-04 : nouveau mot de passe trop court → 400", async () => {
//     const res = await request(app)
//       .patch("/api/user/change-password")
//       .set("Cookie", cookies)
//       .send({ currentPassword: "SecurePassword123!!!", newPassword: "abc" });
//     expect(res.status).toBe(400);
//   });

//   it("CP-05 : sans token → 401", async () => {
//     const res = await request(app)
//       .patch("/api/user/change-password")
//       .send({ currentPassword: "SecurePassword123!!!", newPassword: "NewSecure456!!!" });
//     expect(res.status).toBe(401);
//   });
// // });
import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent } from "../helpers/auth.helper";

describe("PATCH /api/user/change-password", () => {

  let cookies: string[] = [];

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    cookies = s.cookies;
  });

  it("CP-01 : changer le mot de passe avec données valides → 200", async () => {
    const res = await request(app)
      .patch("/api/user/change-password")
      .set("Cookie", cookies)
      .send({
        currentPassword: "SecurePassword123!!!",
        newPassword:     "NewSecure456!!!",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("succès");
  });

  it("CP-02 : mauvais mot de passe actuel → 401", async () => {
    const res = await request(app)
      .patch("/api/user/change-password")
      .set("Cookie", cookies)
      .send({
        currentPassword: "MauvaisMotDePasse!!!",
        newPassword:     "NewSecure456!!!",
      });

    expect([401, 400]).toContain(res.status);
  });

  it("CP-03 : champs manquants → 400", async () => {
    const res = await request(app)
      .patch("/api/user/change-password")
      .set("Cookie", cookies)
      .send({});

    expect(res.status).toBe(400);
  });

  it("CP-04 : nouveau mot de passe trop court (< 8) → 400", async () => {
    const res = await request(app)
      .patch("/api/user/change-password")
      .set("Cookie", cookies)
      .send({
        currentPassword: "SecurePassword123!!!",
        newPassword:     "Ab1!",
      });

    expect(res.status).toBe(400);
  });

  it("CP-05 : sans token → 401", async () => {
    const res = await request(app)
      .patch("/api/user/change-password")
      .send({
        currentPassword: "SecurePassword123!!!",
        newPassword:     "NewSecure456!!!",
      });

    expect(res.status).toBe(401);
  });
});