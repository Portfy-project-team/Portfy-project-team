// // // // tests/portfolio/get-my-portfolio.test.ts
// // // import request from "supertest";
// // // import app from "../../src/index";
// // // import { prisma } from "../../src/utils/prisma";
 
// // // describe("GET /api/portfolio/me", () => {
 
// // //   let studentCookies: string[] = [];
// // //   let profCookies: string[] = [];
 
// // //   beforeAll(async () => {
// // //     // ── Étudiant ──
// // //     const email = `portfoliome${Date.now()}@test.com`;
// // //     await request(app).post("/api/auth/register").send({
// // //       email,
// // //       password: "SecurePassword123!!!",
// // //       role: "STUDENT",
// // //       name: "Test",
// // //       prenom: "Student",
// // //     });
// // //     await prisma.user.update({
// // //       where: { email },
// // //       data: { isEmailVerified: true, status: "ACTIVE" },
// // //     });
// // //     const studentLogin = await request(app).post("/api/auth/login").send({
// // //       email,
// // //       password: "SecurePassword123!!!",
// // //     });
// // //     studentCookies = Array.isArray(studentLogin.headers["set-cookie"])
// // //       ? studentLogin.headers["set-cookie"]
// // //       : [];
 
// // //     // ── PRO (pour tester l'accès refusé) ──
// // //     const proEmail = `proportfolio${Date.now()}@test.com`;
// // //     await request(app).post("/api/auth/register").send({
// // //       email: proEmail,
// // //       password: "SecurePassword123!!!",
// // //       role: "PRO",
// // //       name: "Test",
// // //       prenom: "Pro",
// // //     });
// // //     await prisma.user.update({
// // //       where: { email: proEmail },
// // //       data: {
// // //         isEmailVerified: true,
// // //         professionnel: { update: { statusV: "VALIDATED" } },
// // //       },
// // //     });
// // //     const proLogin = await request(app).post("/api/auth/login").send({
// // //       email: proEmail,
// // //       password: "SecurePassword123!!!",
// // //     });
// // //     profCookies = Array.isArray(proLogin.headers["set-cookie"])
// // //       ? proLogin.headers["set-cookie"]
// // //       : [];
// // //   });
 
// // //   it("PM-01 : get my portfolio as student", async () => {
// // //     const res = await request(app)
// // //       .get("/api/portfolio/me")
// // //       .set("Cookie", studentCookies);
 
// // //     expect(res.status).toBe(200);
// // //     expect(res.body).toHaveProperty("portfolio");
 
// // //     // Vérifier structure enrichie
// // //     const p = res.body.portfolio;
// // //     expect(p).toHaveProperty("skills");
// // //     expect(p).toHaveProperty("lettres");
// // //     expect(p).toHaveProperty("activites");
// // //     expect(p).toHaveProperty("Stage");
// // //     expect(p).toHaveProperty("portfolio");
 
// // //     // Vérifier absence de données sensibles
// // //     expect(p.user?.password).toBeUndefined();
// // //     expect(p.user?.emailVerificationToken).toBeUndefined();
// // //     expect(p.user?.isEmailVerified).toBeUndefined();
// // //   });
 
// // //   it("PM-02 : no token returns 401", async () => {
// // //     const res = await request(app).get("/api/portfolio/me");
// // //     expect(res.status).toBe(401);
// // //   });
 
// // //   it("PM-03 : non-student cannot access", async () => {
// // //     const res = await request(app)
// // //       .get("/api/portfolio/me")
// // //       .set("Cookie", profCookies);
// // //     expect(res.status).toBe(403);
// // //   });
// // // });
// // // // import request from "supertest";
// // // // import app from "../../src/index";
// // // // import { prisma } from "../../src/utils/prisma";

// // // // describe("GET /api/portfolio/me", () => {

// // // //   let studentCookies: string[] = [];

// // // //   beforeAll(async () => {
// // // //     const email = `portfoliome${Date.now()}@test.com`;

// // // //     await request(app).post("/api/auth/register").send({
// // // //       email,
// // // //       password: "SecurePassword123!!!",
// // // //       role: "STUDENT",
// // // //     });

// // // //     await prisma.user.update({
// // // //       where: { email },
// // // //       data: { isEmailVerified: true },
// // // //     });

// // // //     const login = await request(app).post("/api/auth/login").send({
// // // //       email,
// // // //       password: "SecurePassword123!!!",
// // // //     });

// // // //     studentCookies = Array.isArray(login.headers["set-cookie"])
// // // //       ? login.headers["set-cookie"]
// // // //       : [];
// // // //   });

// // // //   it("PM-01 : get my portfolio as student", async () => {
// // // //     const res = await request(app)
// // // //       .get("/api/portfolio/me")
// // // //       .set("Cookie", studentCookies);

// // // //     expect(res.status).toBe(200);
// // // //     expect(res.body).toHaveProperty("portfolio");
// // // //   });

// // // //   it("PM-02 : no token", async () => {
// // // //     const res = await request(app).get("/api/portfolio/me");

// // // //     expect(res.status).toBe(401);
// // // //   });

// // // //   it("PM-03 : non-student cannot access", async () => {
// // // //     const email = `proportfolio${Date.now()}@test.com`;

// // // //     await request(app).post("/api/auth/register").send({
// // // //       email,
// // // //       password: "SecurePassword123!!!",
// // // //       role: "PRO",
// // // //     });

// // // //     await prisma.user.update({
// // // //       where: { email },
// // // //       data: {
// // // //         isEmailVerified: true,
// // // //         professionnel: { update: { statusV: "VALIDATED" } },
// // // //       },
// // // //     });

// // // //     const login = await request(app).post("/api/auth/login").send({
// // // //       email,
// // // //       password: "SecurePassword123!!!",
// // // //     });

// // // //     const proCookies = Array.isArray(login.headers["set-cookie"])
// // // //       ? login.headers["set-cookie"]
// // // //       : [];

// // // //     const res = await request(app)
// // // //       .get("/api/portfolio/me")
// // // //       .set("Cookie", proCookies);

// // // //     expect(res.status).toBe(403);
// // // //   });

// // // // });
// // import request from "supertest";
// // import app from "../../src/index";
// // import { createAndLoginStudent } from "../helpers/auth.helper";

// // describe("GET /api/portfolio/me", () => {

// //   let cookies: string[] = [];

// //   beforeAll(async () => {
// //     const student = await createAndLoginStudent();
// //     cookies = student.cookies;
// //   });

// //   it("PM-01 : authenticated student gets their portfolio", async () => {
// //     const res = await request(app)
// //       .get("/api/portfolio/me")
// //       .set("Cookie", cookies);

// //     expect(res.status).toBe(200);
// //     expect(res.body).toHaveProperty("portfolio");
// //   });

// //   it("PM-02 : response contains expected fields", async () => {
// //     const res = await request(app)
// //       .get("/api/portfolio/me")
// //       .set("Cookie", cookies);

// //     expect(res.status).toBe(200);
// //     const p = res.body.portfolio;
// //     expect(p).toHaveProperty("id");
// //     expect(p).toHaveProperty("skills");
// //     expect(p).toHaveProperty("lettres");
// //     expect(p).toHaveProperty("activites");
// //   });

// //   it("PM-03 : no sensitive fields in response", async () => {
// //     const res = await request(app)
// //       .get("/api/portfolio/me")
// //       .set("Cookie", cookies);

// //     const body = JSON.stringify(res.body);
// //     expect(body).not.toContain('"password"');
// //     expect(body).not.toContain('"emailVerificationToken"');
// //     expect(body).not.toContain('"emailVerificationExpires"');
// //     expect(body).not.toContain('"passwordResetTokens"');
// //     expect(body).not.toContain('"refreshTokens"');
// //     expect(body).not.toContain('"loginLogs"');
// //   });

// //   it("PM-04 : no token returns 401", async () => {
// //     const res = await request(app).get("/api/portfolio/me");
// //     expect(res.status).toBe(401);
// //   });

// //   it("PM-05 : PROF cannot access student portfolio/me", async () => {
// //     const { createAndLoginProf } = await import("../helpers/auth.helper");
// //     const prof = await createAndLoginProf();

// //     const res = await request(app)
// //       .get("/api/portfolio/me")
// //       .set("Cookie", prof.cookies);

// //     expect(res.status).toBe(403);
// //   });
// // });
// import request from "supertest";
// import app from "../../src/index";
// import { prisma } from "../../src/utils/prisma";
// import {
//   createAndLoginStudent,
//   createAndLoginProf,
//   getStudentId,
//   getProfId,
//   ensurePortfolio,
// } from "../helpers/auth.helper";

// describe("GET /api/portfolio/public/:studentId", () => {

//   let studentId: number;
//   let portfolioId: number;
//   let profId: number;

//   beforeAll(async () => {
//     const student = await createAndLoginStudent();
//     studentId = await getStudentId(student.email);

//     const portfolio = await ensurePortfolio(studentId);
//     portfolioId = portfolio.id;

//     await prisma.portfolio.update({
//       where: { id: portfolioId },
//       data:  { visibilite: "PUBLIC" },
//     });

//     const prof = await createAndLoginProf();
//     profId = await getProfId(prof.email);

//     // Projet VALIDATED
//     await prisma.projet.create({
//       data: {
//         titre:          "Projet validé",
//         description:    "Description",
//         portfolioId,
//         statusV:        "VALIDATED",
//         dateSoumission: new Date(),
//       },
//     });

//     // Projet PENDING — ne doit PAS apparaître
//     await prisma.projet.create({
//       data: { titre: "Projet en attente", portfolioId, statusV: "PENDING" },
//     });

//     // Stage VALIDATED
//     await prisma.stage.create({
//       data: {
//         entreprise: "Entreprise Test",
//         dateDebut:  new Date("2024-01-01"),
//         dateFin:    new Date("2024-06-01"),
//         studentId,
//         statutV:    "VALIDATED",
//       },
//     });

//     // Stage PENDING — ne doit PAS apparaître
//     await prisma.stage.create({
//       data: {
//         entreprise: "Entreprise Pending",
//         dateDebut:  new Date("2025-01-01"),
//         dateFin:    new Date("2025-06-01"),
//         studentId,
//         statutV:    "PENDING",
//       },
//     });

//     // Lettre PUBLIC
//     const lettrePublique = await prisma.lettreRecommandation.create({
//       data: { contenu: "Excellent étudiant", visibilite: "PUBLIC", profId },
//     });
//     await prisma.lettreStudent.create({
//       data: { lettreId: lettrePublique.id, studentId },
//     });

//     // Lettre PRIVATE — ne doit PAS apparaître
//     const lettrePrivee = await prisma.lettreRecommandation.create({
//       data: { contenu: "Lettre privée confidentielle", visibilite: "PRIVATE", profId },
//     });
//     await prisma.lettreStudent.create({
//       data: { lettreId: lettrePrivee.id, studentId },
//     });
//   });

//   it("PP-01 : public portfolio is accessible without auth", async () => {
//     const res = await request(app)
//       .get(`/api/portfolio/public/${studentId}`);

//     expect(res.status).toBe(200);
//     expect(res.body).toHaveProperty("portfolio");
//   });

//   it("PP-02 : only VALIDATED projects appear", async () => {
//     const res = await request(app)
//       .get(`/api/portfolio/public/${studentId}`);

//     const projets = res.body.portfolio?.portfolio?.projets ?? [];
//     expect(Array.isArray(projets)).toBe(true);
//     projets.forEach((p: any) => {
//       expect(p.statusV).toBe("VALIDATED");
//     });
//     const titres = projets.map((p: any) => p.titre);
//     expect(titres).not.toContain("Projet en attente");
//   });

//   it("PP-03 : only VALIDATED stages appear", async () => {
//     const res = await request(app)
//       .get(`/api/portfolio/public/${studentId}`);

//     const stages = res.body.portfolio?.stages ?? [];
//     expect(Array.isArray(stages)).toBe(true);
//     const entreprises = stages.map((s: any) => s.entreprise);
//     expect(entreprises).not.toContain("Entreprise Pending");
//   });

//   it("PP-04 : only PUBLIC or DOWNLOADABLE letters appear", async () => {
//     const res = await request(app)
//       .get(`/api/portfolio/public/${studentId}`);

//     const lettres = res.body.portfolio?.lettres ?? [];
//     expect(Array.isArray(lettres)).toBe(true);
//     lettres.forEach((l: any) => {
//       expect(["PUBLIC", "DOWNLOADABLE"]).toContain(l.visibilite);
//     });
//     const contenus = lettres.map((l: any) => l.contenu);
//     expect(contenus).not.toContain("Lettre privée confidentielle");
//   });

//   it("PP-05 : no sensitive fields exposed", async () => {
//     const res = await request(app)
//       .get(`/api/portfolio/public/${studentId}`);

//     const body = JSON.stringify(res.body);
//     expect(body).not.toContain('"password"');
//     expect(body).not.toContain('"emailVerificationToken"');
//     expect(body).not.toContain('"emailVerificationExpires"');
//     expect(body).not.toContain('"isEmailVerified"');
//     expect(body).not.toContain('"passwordResetTokens"');
//     expect(body).not.toContain('"refreshTokens"');
//     expect(body).not.toContain('"loginLogs"');
//     expect(body).not.toContain('"skillsTexte"');
//     expect(body).not.toContain('"rapportUrl"');
//     expect(body).not.toContain('"rejectionReason"');
//   });

//   it("PP-06 : userId is not exposed in public portfolio", async () => {
//     const res = await request(app)
//       .get(`/api/portfolio/public/${studentId}`);

//     expect(res.body.portfolio?.userId).toBeUndefined();
//   });

//   it("PP-07 : unknown studentId returns 404", async () => {
//     const res = await request(app)
//       .get("/api/portfolio/public/999999");

//     expect(res.status).toBe(404);
//   });

//   it("PP-08 : invalid studentId returns 400", async () => {
//     const res = await request(app)
//       .get("/api/portfolio/public/abc");

//     expect(res.status).toBe(400);
//   });

//   it("PP-09 : PRIVATE portfolio returns 403", async () => {
//     const s = await createAndLoginStudent();
//     const sId = await getStudentId(s.email);
//     await ensurePortfolio(sId);
//     await prisma.portfolio.update({
//       where: { studentId: sId },
//       data:  { visibilite: "PRIVATE" },
//     });

//     const res = await request(app)
//       .get(`/api/portfolio/public/${sId}`);

//     expect(res.status).toBe(403);
//   });

//   it("PP-10 : stage sensitive fields not exposed", async () => {
//     const res = await request(app)
//       .get(`/api/portfolio/public/${studentId}`);

//     const stages = res.body.portfolio?.stages ?? [];
//     stages.forEach((s: any) => {
//       expect(s.rapportUrl).toBeUndefined();
//       expect(s.rejectionReason).toBeUndefined();
//       expect(s.studentId).toBeUndefined();
//       expect(s.encadrantId).toBeUndefined();
//     });
//   });
// });
import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent, createAndLoginProf } from "../helpers/auth.helper";

describe("GET /api/portfolio/me", () => {

  let cookies: string[] = [];

  beforeAll(async () => {
    const student = await createAndLoginStudent();
    cookies = student.cookies;
  });

  it("PM-01 : authenticated student gets their portfolio", async () => {
    const res = await request(app)
      .get("/api/portfolio/me")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("portfolio");
  });

  it("PM-02 : response contains expected fields", async () => {
    const res = await request(app)
      .get("/api/portfolio/me")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    const p = res.body.portfolio;
    expect(p).toHaveProperty("id");
    expect(p).toHaveProperty("skills");
    expect(p).toHaveProperty("lettres");
    expect(p).toHaveProperty("activites");
    expect(p).toHaveProperty("Stage");
  });

  it("PM-03 : no sensitive fields in response", async () => {
    const res = await request(app)
      .get("/api/portfolio/me")
      .set("Cookie", cookies);

    const body = JSON.stringify(res.body);
    expect(body).not.toContain('"password"');
    expect(body).not.toContain('"emailVerificationToken"');
    expect(body).not.toContain('"emailVerificationExpires"');
    expect(body).not.toContain('"passwordResetTokens"');
    expect(body).not.toContain('"refreshTokens"');
    expect(body).not.toContain('"loginLogs"');
  });

  it("PM-04 : no token returns 401", async () => {
    const res = await request(app).get("/api/portfolio/me");
    expect(res.status).toBe(401);
  });

  it("PM-05 : PROF cannot access /portfolio/me", async () => {
    const prof = await createAndLoginProf();
    const res = await request(app)
      .get("/api/portfolio/me")
      .set("Cookie", prof.cookies);

    expect(res.status).toBe(403);
  });
});