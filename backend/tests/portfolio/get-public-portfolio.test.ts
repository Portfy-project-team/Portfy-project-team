// // // // tests/portfolio/get-public-portfolio.test.ts
// // // import request from "supertest";
// // // import app from "../../src/index";
// // // import { prisma } from "../../src/utils/prisma";
 
// // // describe("GET /api/portfolio/public/:studentId", () => {
 
// // //   let studentId: number;
// // //   let portfolioId: number;
// // //   let studentCookies: string[] = [];
// // //   let profUserId: number;
 
// // //   beforeAll(async () => {
// // //     const email = `publicportfolio${Date.now()}@test.com`;
 
// // //     await request(app).post("/api/auth/register").send({
// // //       email,
// // //       password: "SecurePassword123!!!",
// // //       role:     "STUDENT",
// // //       name:     "Public",
// // //       prenom:   "Student",
// // //     });
// // //     await prisma.user.update({
// // //       where: { email },
// // //       data: { isEmailVerified: true, status: "ACTIVE" },
// // //     });
 
// // //     const login = await request(app).post("/api/auth/login").send({
// // //       email,
// // //       password: "SecurePassword123!!!",
// // //     });
// // //     studentCookies = Array.isArray(login.headers["set-cookie"])
// // //       ? login.headers["set-cookie"]
// // //       : [];
 
// // //     const user = await prisma.user.findUnique({
// // //       where:   { email },
// // //       include: { student: true },
// // //     });
// // //     studentId = user!.student!.id;
 
// // //     // Créer un portfolio PUBLIC
// // //     const portfolio = await prisma.portfolio.upsert({
// // //       where:  { studentId },
// // //       create: { studentId, visibilite: "PUBLIC" },
// // //       update: { visibilite: "PUBLIC" },
// // //     });
// // //     portfolioId = portfolio.id;
 
// // //     // Créer un prof pour les lettres
// // //     const profEmail = `pubportfolioprof${Date.now()}@test.com`;
// // //     await request(app).post("/api/auth/register").send({
// // //       email: profEmail,
// // //       password: "SecurePassword123!!!",
// // //       role: "STUDENT",
// // //       name: "Prof",
// // //       prenom: "Test",
// // //     });
// // //     const profUser = await prisma.user.update({
// // //       where: { email: profEmail },
// // //       data:  { role: "PROF", isEmailVerified: true },
// // //     });
// // //     profUserId = profUser.id;
 
// // //     await prisma.prof.upsert({
// // //       where:  { userId: profUserId },
// // //       create: { userId: profUserId, nom: "Prof", prenom: "Test" },
// // //       update: {},
// // //     });
// // //   });
 
// // //   it("PP-01 : get public portfolio returns 200 with correct structure", async () => {
// // //     const res = await request(app)
// // //       .get(`/api/portfolio/public/${studentId}`);
 
// // //     expect(res.status).toBe(200);
// // //     expect(res.body).toHaveProperty("portfolio");
 
// // //     const p = res.body.portfolio;
// // //     // Structure attendue
// // //     expect(p).toHaveProperty("skills");
// // //     expect(p).toHaveProperty("stages");
// // //     expect(p).toHaveProperty("lettres");
// // //     expect(p).toHaveProperty("portfolio");
 
// // //     // Données sensibles JAMAIS présentes
// // //     expect(p.password).toBeUndefined();
// // //     expect(p.emailVerificationToken).toBeUndefined();
// // //     expect(p.emailVerificationExpires).toBeUndefined();
// // //     expect(p.isEmailVerified).toBeUndefined();
// // //     expect(p.userId).toBeUndefined();
// // //     expect(p.skillsTexte).toBeUndefined();
// // //     expect(p.passwordResetTokens).toBeUndefined();
// // //     expect(p.refreshTokens).toBeUndefined();
// // //     expect(p.loginLogs).toBeUndefined();
// // //   });
 
// // //   it("PP-02 : invalid student id returns 400", async () => {
// // //     const res = await request(app).get("/api/portfolio/public/abc");
// // //     expect(res.status).toBe(400);
// // //   });
 
// // //   it("PP-03 : student not found returns 404", async () => {
// // //     const res = await request(app).get("/api/portfolio/public/999999");
// // //     expect(res.status).toBe(404);
// // //   });
 
// // //   it("PP-04 : PRIVATE portfolio returns 403", async () => {
// // //     await prisma.portfolio.update({
// // //       where: { studentId },
// // //       data:  { visibilite: "PRIVATE" },
// // //     });
// // //     const res = await request(app).get(`/api/portfolio/public/${studentId}`);
// // //     expect(res.status).toBe(403);
 
// // //     // Remettre PUBLIC pour les tests suivants
// // //     await prisma.portfolio.update({
// // //       where: { studentId },
// // //       data:  { visibilite: "PUBLIC" },
// // //     });
// // //   });
 
// // //   it("PP-05 : PENDING project NOT visible in public portfolio", async () => {
// // //     await prisma.projet.create({
// // //       data: { titre: "Projet PENDING", statusV: "PENDING", portfolioId },
// // //     });
 
// // //     const res = await request(app).get(`/api/portfolio/public/${studentId}`);
// // //     expect(res.status).toBe(200);
 
// // //     const projets = res.body.portfolio?.portfolio?.projets ?? [];
// // //     const hasPending = projets.some((p: any) => p.statusV === "PENDING");
// // //     expect(hasPending).toBe(false);
// // //   });
 
// // //   it("PP-06 : VALIDATED project IS visible in public portfolio", async () => {
// // //     await prisma.projet.create({
// // //       data: { titre: "Projet VALIDATED", statusV: "VALIDATED", portfolioId },
// // //     });
 
// // //     const res = await request(app).get(`/api/portfolio/public/${studentId}`);
// // //     expect(res.status).toBe(200);
 
// // //     const projets = res.body.portfolio?.portfolio?.projets ?? [];
// // //     const hasValidated = projets.some((p: any) => p.statusV === "VALIDATED");
// // //     expect(hasValidated).toBe(true);
// // //   });
 
// // //   it("PP-07 : PENDING stage NOT visible in public portfolio", async () => {
// // //     await prisma.stage.create({
// // //       data: {
// // //         entreprise: "Entreprise Test",
// // //         mission:    "Mission test",
// // //         dateDebut:  new Date("2025-01-01"),
// // //         dateFin:    new Date("2025-06-01"),
// // //         statutV:    "PENDING",
// // //         studentId,
// // //       },
// // //     });
 
// // //     const res = await request(app).get(`/api/portfolio/public/${studentId}`);
// // //     expect(res.status).toBe(200);
 
// // //     const stages = res.body.portfolio?.stages ?? [];
// // //     const hasPending = stages.some((s: any) => s.statutV === "PENDING");
// // //     expect(hasPending).toBe(false);
// // //   });
 
// // //   it("PP-08 : PRIVATE letter NOT visible in public portfolio", async () => {
// // //     // Créer une lettre PRIVATE
// // //     const prof = await prisma.prof.findUnique({ where: { userId: profUserId } });
// // //     const lettre = await prisma.lettreRecommandation.create({
// // //       data: {
// // //         contenu:    "Lettre privée",
// // //         visibilite: "PRIVATE",
// // //         profId:     prof!.id,
// // //         LettreStudent: { create: { studentId } },
// // //       },
// // //     });
 
// // //     const res = await request(app).get(`/api/portfolio/public/${studentId}`);
// // //     expect(res.status).toBe(200);
 
// // //     const lettres = res.body.portfolio?.lettres ?? [];
// // //     const hasPrivate = lettres.some((l: any) => l.visibilite === "PRIVATE");
// // //     expect(hasPrivate).toBe(false);
 
// // //     await prisma.lettreStudent.deleteMany({ where: { lettreId: lettre.id } });
// // //     await prisma.lettreRecommandation.delete({ where: { id: lettre.id } });
// // //   });
 
// // //   it("PP-09 : PUBLIC letter IS visible in public portfolio", async () => {
// // //     const prof = await prisma.prof.findUnique({ where: { userId: profUserId } });
// // //     const lettre = await prisma.lettreRecommandation.create({
// // //       data: {
// // //         contenu:    "Lettre publique de recommandation",
// // //         visibilite: "PUBLIC",
// // //         profId:     prof!.id,
// // //         LettreStudent: { create: { studentId } },
// // //       },
// // //     });
 
// // //     const res = await request(app).get(`/api/portfolio/public/${studentId}`);
// // //     expect(res.status).toBe(200);
 
// // //     const lettres = res.body.portfolio?.lettres ?? [];
// // //     const hasPublic = lettres.some((l: any) => l.visibilite === "PUBLIC");
// // //     expect(hasPublic).toBe(true);
 
// // //     // Lettre ne doit pas exposer de données sensibles
// // //     if (lettres.length > 0) {
// // //       expect(lettres[0].Prof?.password).toBeUndefined();
// // //     }
 
// // //     await prisma.lettreStudent.deleteMany({ where: { lettreId: lettre.id } });
// // //     await prisma.lettreRecommandation.delete({ where: { id: lettre.id } });
// // //   });
 
// // //   it("PP-10 : LINK_ONLY portfolio should be accessible", async () => {
// // //     await prisma.portfolio.update({
// // //       where: { studentId },
// // //       data:  { visibilite: "LINK_ONLY" },
// // //     });
 
// // //     const res = await request(app).get(`/api/portfolio/public/${studentId}`);
// // //     expect(res.status).toBe(200);
 
// // //     await prisma.portfolio.update({
// // //       where: { studentId },
// // //       data:  { visibilite: "PUBLIC" },
// // //     });
// // //   });
// // // });
// // // // import request from "supertest";
// // // // import app from "../../src/index";
// // // // import { prisma } from "../../src/utils/prisma";

// // // // describe("GET /api/portfolio/public/:studentId", () => {

// // // //   let studentId: number;
// // // //   let studentCookies: string[] = [];

// // // //   beforeAll(async () => {
// // // //     const email = `publicportfolio${Date.now()}@test.com`;

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

// // // //     const user = await prisma.user.findUnique({
// // // //       where: { email },
// // // //       include: { student: true },
// // // //     });

// // // //     studentId = user!.student!.id;

// // // //     // Créer portfolio PUBLIC
// // // //     await prisma.portfolio.upsert({
// // // //       where: { studentId },
// // // //       create: { studentId, visibilite: "PUBLIC" },
// // // //       update: { visibilite: "PUBLIC" },
// // // //     });
// // // //   });

// // // //   it("PP-01 : get public portfolio", async () => {
// // // //     const res = await request(app)
// // // //       .get(`/api/portfolio/public/${studentId}`);

// // // //     expect(res.status).toBe(200);
// // // //     expect(res.body).toHaveProperty("portfolio");
// // // //   });

// // // //   it("PP-02 : invalid student id", async () => {
// // // //     const res = await request(app)
// // // //       .get("/api/portfolio/public/abc");

// // // //     expect(res.status).toBe(400);
// // // //   });

// // // //   it("PP-03 : student not found", async () => {
// // // //     const res = await request(app)
// // // //       .get("/api/portfolio/public/999999");

// // // //     expect(res.status).toBe(404);
// // // //   });

// // // //   it("PP-04 : private portfolio returns 403", async () => {
// // // //     // Mettre le portfolio en PRIVATE
// // // //     await prisma.portfolio.update({
// // // //       where: { studentId },
// // // //       data: { visibilite: "PRIVATE" },
// // // //     });

// // // //     const res = await request(app)
// // // //       .get(`/api/portfolio/public/${studentId}`);

// // // //     expect(res.status).toBe(403);
// // // //   });

// // // //   it("PP-05 : pending project not visible in public portfolio", async () => {
// // // //     // Remettre PUBLIC
// // // //     await prisma.portfolio.update({
// // // //       where: { studentId },
// // // //       data: { visibilite: "PUBLIC" },
// // // //     });

// // // //     const portfolio = await prisma.portfolio.findUnique({
// // // //       where: { studentId },
// // // //     });

// // // //     // Créer projet PENDING
// // // //     await prisma.projet.create({
// // // //       data: {
// // // //         titre: "Projet PENDING",
// // // //         statusV: "PENDING",
// // // //         portfolioId: portfolio!.id,
// // // //       },
// // // //     });

// // // //     const res = await request(app)
// // // //       .get(`/api/portfolio/public/${studentId}`);

// // // //     expect(res.status).toBe(200);

// // // //     const projets = res.body.portfolio?.portfolio?.projets ?? [];
// // // //     const hasPending = projets.some((p: any) => p.statusV === "PENDING");
// // // //     expect(hasPending).toBe(false);
// // // //   });

// // // //   it("PP-06 : validated project visible in public portfolio", async () => {
// // // //     const portfolio = await prisma.portfolio.findUnique({
// // // //       where: { studentId },
// // // //     });

// // // //     // Créer projet VALIDATED
// // // //     await prisma.projet.create({
// // // //       data: {
// // // //         titre: "Projet VALIDATED",
// // // //         statusV: "VALIDATED",
// // // //         portfolioId: portfolio!.id,
// // // //       },
// // // //     });

// // // //     const res = await request(app)
// // // //       .get(`/api/portfolio/public/${studentId}`);

// // // //     expect(res.status).toBe(200);

// // // //     const projets = res.body.portfolio?.portfolio?.projets ?? [];
// // // //     const hasValidated = projets.some((p: any) => p.statusV === "VALIDATED");
// // // //     expect(hasValidated).toBe(true);
// // // //   });

// // // //   it("PP-07 : pending stage not visible in public portfolio", async () => {
// // // //     const user = await prisma.user.findFirst({
// // // //       where: { student: { id: studentId } },
// // // //       include: { student: true },
// // // //     });

// // // //     // Créer stage PENDING
// // // //     await prisma.stage.create({
// // // //       data: {
// // // //         entreprise: "Entreprise Test",
// // // //         mission: "Mission test",
// // // //         statutV: "PENDING",
// // // //         studentId,
// // // //       },
// // // //     });

// // // //     const res = await request(app)
// // // //       .get(`/api/portfolio/public/${studentId}`);

// // // //     expect(res.status).toBe(200);

// // // //     const stages = res.body.portfolio?.Stage ?? [];
// // // //     const hasPending = stages.some((s: any) => s.statutV === "PENDING");
// // // //     expect(hasPending).toBe(false);
// // // //   });

// // // // });
// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";
// // import {
// //   createAndLoginStudent,
// //   createAndLoginProf,
// //   getStudentId,
// //   getProfId,
// //   ensurePortfolio,
// // } from "../helpers/auth.helper";

// // describe("GET /api/portfolio/public/:studentId", () => {

// //   let studentId: number;
// //   let portfolioId: number;
// //   let profId: number;

// //   beforeAll(async () => {
// //     // Créer étudiant avec portfolio public
// //     const student = await createAndLoginStudent();
// //     studentId = await getStudentId(student.email);

// //     const portfolio = await ensurePortfolio(studentId);
// //     portfolioId = portfolio.id;

// //     // S'assurer que le portfolio est PUBLIC
// //     await prisma.portfolio.update({
// //       where: { id: portfolioId },
// //       data:  { visibilite: "PUBLIC" },
// //     });

// //     // Créer un prof pour les lettres
// //     const prof = await createAndLoginProf();
// //     profId = await getProfId(prof.email);

// //     // Ajouter un projet VALIDATED
// //     await prisma.projet.create({
// //       data: {
// //         titre:       "Projet validé",
// //         description: "Description",
// //         portfolioId,
// //         statusV:     "VALIDATED",
// //         dateSoumission: new Date(),
// //       },
// //     });

// //     // Ajouter un projet PENDING (ne doit PAS apparaître)
// //     await prisma.projet.create({
// //       data: {
// //         titre:       "Projet en attente",
// //         portfolioId,
// //         statusV:     "PENDING",
// //       },
// //     });

// //     // Ajouter un stage VALIDATED
// //     await prisma.stage.create({
// //       data: {
// //         entreprise: "Entreprise Test",
// //         dateDebut:  new Date("2024-01-01"),
// //         dateFin:    new Date("2024-06-01"),
// //         studentId,
// //         statutV:    "VALIDATED",
// //       },
// //     });

// //     // Ajouter un stage PENDING (ne doit PAS apparaître)
// //     await prisma.stage.create({
// //       data: {
// //         entreprise: "Entreprise Pending",
// //         dateDebut:  new Date("2024-07-01"),
// //         dateFin:    new Date("2024-12-01"),
// //         studentId,
// //         statutV:    "PENDING",
// //       },
// //     });

// //     // Ajouter une lettre PUBLIC
// //     const lettrePublique = await prisma.lettreRecommandation.create({
// //       data: {
// //         contenu:    "Excellent étudiant",
// //         visibilite: "PUBLIC",
// //         profId,
// //       },
// //     });
// //     await prisma.lettreStudent.create({
// //       data: { lettreId: lettrePublique.id, studentId },
// //     });

// //     // Ajouter une lettre PRIVATE (ne doit PAS apparaître)
// //     const lettrePrivee = await prisma.lettreRecommandation.create({
// //       data: {
// //         contenu:    "Lettre privée",
// //         visibilite: "PRIVATE",
// //         profId,
// //       },
// //     });
// //     await prisma.lettreStudent.create({
// //       data: { lettreId: lettrePrivee.id, studentId },
// //     });
// //   });

// //   it("PP-01 : public portfolio is accessible without auth", async () => {
// //     const res = await request(app)
// //       .get(`/api/portfolio/public/${studentId}`);

// //     expect(res.status).toBe(200);
// //     expect(res.body).toHaveProperty("portfolio");
// //   });

// //   it("PP-02 : only VALIDATED projects appear", async () => {
// //     const res = await request(app)
// //       .get(`/api/portfolio/public/${studentId}`);

// //     const projets = res.body.portfolio?.portfolio?.projets ?? [];
// //     const statuts = projets.map((p: any) => p.statusV);

// //     expect(statuts.every((s: string) => s === "VALIDATED")).toBe(true);
// //     expect(statuts).not.toContain("PENDING");
// //     expect(statuts).not.toContain("REJECTED");
// //   });

// //   it("PP-03 : only VALIDATED stages appear", async () => {
// //     const res = await request(app)
// //       .get(`/api/portfolio/public/${studentId}`);

// //     const stages = res.body.portfolio?.stages ?? [];
// //     stages.forEach((s: any) => {
// //       // statutV ne doit pas être exposé, mais l'entreprise PENDING ne doit pas être là
// //       expect(s.entreprise).not.toBe("Entreprise Pending");
// //     });
// //   });

// //   it("PP-04 : only PUBLIC or DOWNLOADABLE letters appear", async () => {
// //     const res = await request(app)
// //       .get(`/api/portfolio/public/${studentId}`);

// //     const lettres = res.body.portfolio?.lettres ?? [];
// //     lettres.forEach((l: any) => {
// //       expect(["PUBLIC", "DOWNLOADABLE"]).toContain(l.visibilite);
// //     });
// //     // La lettre privée ne doit pas être là
// //     const contenus = lettres.map((l: any) => l.contenu);
// //     expect(contenus).not.toContain("Lettre privée");
// //   });

// //   it("PP-05 : no sensitive fields exposed", async () => {
// //     const res = await request(app)
// //       .get(`/api/portfolio/public/${studentId}`);

// //     const body = JSON.stringify(res.body);

// //     expect(body).not.toContain('"password"');
// //     expect(body).not.toContain('"emailVerificationToken"');
// //     expect(body).not.toContain('"emailVerificationExpires"');
// //     expect(body).not.toContain('"isEmailVerified"');
// //     expect(body).not.toContain('"passwordResetTokens"');
// //     expect(body).not.toContain('"refreshTokens"');
// //     expect(body).not.toContain('"loginLogs"');
// //     expect(body).not.toContain('"skillsTexte"');
// //     expect(body).not.toContain('"rapportUrl"');
// //     expect(body).not.toContain('"rejectionReason"');
// //   });

// //   it("PP-06 : userId is not exposed", async () => {
// //     const res = await request(app)
// //       .get(`/api/portfolio/public/${studentId}`);

// //     // userId ne doit pas apparaître dans la réponse publique
// //     expect(res.body.portfolio?.userId).toBeUndefined();
// //   });

// //   it("PP-07 : unknown studentId returns 404", async () => {
// //     const res = await request(app)
// //       .get("/api/portfolio/public/999999");

// //     expect(res.status).toBe(404);
// //   });

// //   it("PP-08 : invalid studentId returns 400", async () => {
// //     const res = await request(app)
// //       .get("/api/portfolio/public/abc");

// //     expect(res.status).toBe(400);
// //   });

// //   it("PP-09 : PRIVATE portfolio returns 403", async () => {
// //     // Créer un student avec portfolio PRIVATE
// //     const s = await createAndLoginStudent();
// //     const sId = await getStudentId(s.email);
// //     await ensurePortfolio(sId);
// //     await prisma.portfolio.update({
// //       where: { studentId: sId },
// //       data:  { visibilite: "PRIVATE" },
// //     });

// //     const res = await request(app)
// //       .get(`/api/portfolio/public/${sId}`);

// //     expect(res.status).toBe(403);
// //   });

// //   it("PP-10 : stage rapportUrl and rejectionReason not exposed", async () => {
// //     const res = await request(app)
// //       .get(`/api/portfolio/public/${studentId}`);

// //     const stages = res.body.portfolio?.stages ?? [];
// //     stages.forEach((s: any) => {
// //       expect(s.rapportUrl).toBeUndefined();
// //       expect(s.rejectionReason).toBeUndefined();
// //       expect(s.studentId).toBeUndefined();
// //       expect(s.encadrantId).toBeUndefined();
// //     });
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
import { prisma } from "../../src/utils/prisma";
import {
  createAndLoginStudent,
  createAndLoginProf,
  getStudentId,
  getProfId,
  ensurePortfolio,
} from "../helpers/auth.helper";

describe("GET /api/portfolio/public/:studentId", () => {

  let studentId: number;
  let portfolioId: number;
  let profId: number;

  beforeAll(async () => {
    const student = await createAndLoginStudent();
    studentId = await getStudentId(student.email);

    const portfolio = await ensurePortfolio(studentId);
    portfolioId = portfolio.id;

    await prisma.portfolio.update({
      where: { id: portfolioId },
      data:  { visibilite: "PUBLIC" },
    });

    const prof = await createAndLoginProf();
    profId = await getProfId(prof.email);

    // Projet VALIDATED — doit apparaître
    await prisma.projet.create({
      data: {
        titre:          "Projet validé",
        description:    "Description test",
        portfolioId,
        statusV:        "VALIDATED",
        dateSoumission: new Date(),
      },
    });

    // Projet PENDING — ne doit PAS apparaître
    await prisma.projet.create({
      data: { titre: "Projet en attente", portfolioId, statusV: "PENDING" },
    });

    // Stage VALIDATED — doit apparaître
    await prisma.stage.create({
      data: {
        entreprise: "Entreprise Validée",
        dateDebut:  new Date("2024-01-01"),
        dateFin:    new Date("2024-06-01"),
        studentId,
        statutV:    "VALIDATED",
      },
    });

    // Stage PENDING — ne doit PAS apparaître
    await prisma.stage.create({
      data: {
        entreprise: "Entreprise Pending",
        dateDebut:  new Date("2025-01-01"),
        dateFin:    new Date("2025-06-01"),
        studentId,
        statutV:    "PENDING",
      },
    });

    // Lettre PUBLIC — doit apparaître
    const lettrePublique = await prisma.lettreRecommandation.create({
      data: { contenu: "Excellent étudiant sérieux", visibilite: "PUBLIC", profId },
    });
    await prisma.lettreStudent.create({
      data: { lettreId: lettrePublique.id, studentId },
    });

    // Lettre PRIVATE — ne doit PAS apparaître
    const lettrePrivee = await prisma.lettreRecommandation.create({
      data: { contenu: "Lettre strictement privée", visibilite: "PRIVATE", profId },
    });
    await prisma.lettreStudent.create({
      data: { lettreId: lettrePrivee.id, studentId },
    });
  });

  it("PP-01 : public portfolio accessible without auth returns 200", async () => {
    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("portfolio");
  });

  it("PP-02 : only VALIDATED projects appear", async () => {
    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(200);
    const projets = res.body.portfolio?.portfolio?.projets ?? [];
    expect(Array.isArray(projets)).toBe(true);

    projets.forEach((p: any) => {
      expect(p.statusV).toBe("VALIDATED");
    });

    const titres = projets.map((p: any) => p.titre);
    expect(titres).not.toContain("Projet en attente");
    expect(titres).toContain("Projet validé");
  });

  it("PP-03 : only VALIDATED stages appear", async () => {
    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(200);
    const stages = res.body.portfolio?.stages ?? [];
    expect(Array.isArray(stages)).toBe(true);

    const entreprises = stages.map((s: any) => s.entreprise);
    expect(entreprises).not.toContain("Entreprise Pending");
    expect(entreprises).toContain("Entreprise Validée");
  });

  it("PP-04 : only PUBLIC or DOWNLOADABLE letters appear", async () => {
    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(200);
    const lettres = res.body.portfolio?.lettres ?? [];
    expect(Array.isArray(lettres)).toBe(true);

    lettres.forEach((l: any) => {
      expect(["PUBLIC", "DOWNLOADABLE"]).toContain(l.visibilite);
    });

    const contenus = lettres.map((l: any) => l.contenu);
    expect(contenus).not.toContain("Lettre strictement privée");
    expect(contenus).toContain("Excellent étudiant sérieux");
  });

  it("PP-05 : no sensitive fields exposed", async () => {
    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(200);
    const body = JSON.stringify(res.body);

    expect(body).not.toContain('"password"');
    expect(body).not.toContain('"emailVerificationToken"');
    expect(body).not.toContain('"emailVerificationExpires"');
    expect(body).not.toContain('"isEmailVerified"');
    expect(body).not.toContain('"passwordResetTokens"');
    expect(body).not.toContain('"refreshTokens"');
    expect(body).not.toContain('"loginLogs"');
    expect(body).not.toContain('"skillsTexte"');
  });

  it("PP-06 : userId not exposed in public portfolio", async () => {
    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(200);
    expect(res.body.portfolio?.userId).toBeUndefined();
  });

  it("PP-07 : unknown studentId returns 404", async () => {
    const res = await request(app)
      .get("/api/portfolio/public/999999");

    expect(res.status).toBe(404);
  });

  it("PP-08 : invalid studentId (string) returns 400", async () => {
    const res = await request(app)
      .get("/api/portfolio/public/abc");

    expect(res.status).toBe(400);
  });

  it("PP-09 : PRIVATE portfolio returns 403", async () => {
    // Créer un nouveau student avec portfolio PRIVATE
    const s2 = await createAndLoginStudent();
    const sId2 = await getStudentId(s2.email);
    await ensurePortfolio(sId2);
    await prisma.portfolio.update({
      where: { studentId: sId2 },
      data:  { visibilite: "PRIVATE" },
    });

    const res = await request(app)
      .get(`/api/portfolio/public/${sId2}`);

    expect(res.status).toBe(403);
  });

  it("PP-10 : stage sensitive fields not exposed", async () => {
    const res = await request(app)
      .get(`/api/portfolio/public/${studentId}`);

    expect(res.status).toBe(200);
    const stages = res.body.portfolio?.stages ?? [];

    stages.forEach((s: any) => {
      expect(s.rapportUrl).toBeUndefined();
      expect(s.rejectionReason).toBeUndefined();
      expect(s.studentId).toBeUndefined();
      expect(s.encadrantId).toBeUndefined();
      expect(s.statutV).toBeUndefined();
    });
  });

  it("PP-11 : LINK_ONLY portfolio is accessible", async () => {
    // Créer un student avec portfolio LINK_ONLY
    const s3 = await createAndLoginStudent();
    const sId3 = await getStudentId(s3.email);
    await ensurePortfolio(sId3);
    await prisma.portfolio.update({
      where: { studentId: sId3 },
      data:  { visibilite: "LINK_ONLY" },
    });

    const res = await request(app)
      .get(`/api/portfolio/public/${sId3}`);

    expect(res.status).toBe(200);
  });
});