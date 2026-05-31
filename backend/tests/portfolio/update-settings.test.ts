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

describe("PUT /api/portfolio/settings", () => {

  let cookies: string[] = [];

  beforeAll(async () => {
    const student = await createAndLoginStudent();
    cookies = student.cookies;
  });

  it("PS-01 : update objective", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", cookies)
      .send({ objective: "Mon objectif professionnel" });

    expect(res.status).toBe(200);
    expect(res.body.portfolio.objective).toBe("Mon objectif professionnel");
  });

  it("PS-02 : update visibilite to PRIVATE", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", cookies)
      .send({ visibilite: "PRIVATE" });

    expect(res.status).toBe(200);
    expect(res.body.portfolio.visibilite).toBe("PRIVATE");
  });

  it("PS-03 : update visibilite to LINK_ONLY", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", cookies)
      .send({ visibilite: "LINK_ONLY" });

    expect(res.status).toBe(200);
    expect(res.body.portfolio.visibilite).toBe("LINK_ONLY");
  });

  it("PS-04 : update visibilite to PUBLIC", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", cookies)
      .send({ visibilite: "PUBLIC" });

    expect(res.status).toBe(200);
    expect(res.body.portfolio.visibilite).toBe("PUBLIC");
  });

  it("PS-05 : invalid visibilite returns 400", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", cookies)
      .send({ visibilite: "INVALID_VALUE" });

    expect(res.status).toBe(400);
  });

  it("PS-06 : no token returns 401", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .send({ visibilite: "PUBLIC" });

    expect(res.status).toBe(401);
  });

  it("PS-07 : update both objective and visibilite", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", cookies)
      .send({ objective: "Objectif combiné", visibilite: "PUBLIC" });

    expect(res.status).toBe(200);
    expect(res.body.portfolio.objective).toBe("Objectif combiné");
    expect(res.body.portfolio.visibilite).toBe("PUBLIC");
  });

  it("PS-08 : PROF cannot update portfolio settings", async () => {
    const prof = await createAndLoginProf();
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", prof.cookies)
      .send({ visibilite: "PUBLIC" });

    expect(res.status).toBe(403);
  });

  it("PS-09 : scoreCredibilite is a number between 0 and 100", async () => {
    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", cookies)
      .send({ visibilite: "PUBLIC" });

    expect(res.status).toBe(200);
    expect(typeof res.body.portfolio.scoreCredibilite).toBe("number");
    expect(res.body.portfolio.scoreCredibilite).toBeGreaterThanOrEqual(0);
    expect(res.body.portfolio.scoreCredibilite).toBeLessThanOrEqual(100);
  });

  it("PS-10 : scoreCredibilite increases when student has validated content", async () => {
    // Créer un student avec du contenu validé pour vérifier que le score augmente
    const s = await createAndLoginStudent();
    const sCookies = s.cookies;
    const studentId = await getStudentId(s.email);
    const portfolio = await ensurePortfolio(studentId);
    const prof = await createAndLoginProf();
    const profId = await getProfId(prof.email);

    // Score initial — portfolio vide
    const resBefore = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", sCookies)
      .send({ visibilite: "PUBLIC" });

    const scoreBefore = resBefore.body.portfolio.scoreCredibilite;

    // Ajouter un projet VALIDATED
    await prisma.projet.create({
      data: {
        titre:          "Projet score test",
        portfolioId:    portfolio.id,
        statusV:        "VALIDATED",
        dateSoumission: new Date(),
      },
    });

    // Ajouter un stage VALIDATED
    await prisma.stage.create({
      data: {
        entreprise: "Stage score",
        dateDebut:  new Date("2024-01-01"),
        dateFin:    new Date("2024-06-01"),
        studentId,
        statutV:    "VALIDATED",
      },
    });

    // Ajouter une lettre PUBLIC
    const lettre = await prisma.lettreRecommandation.create({
      data: { contenu: "Lettre score test", visibilite: "PUBLIC", profId },
    });
    await prisma.lettreStudent.create({
      data: { lettreId: lettre.id, studentId },
    });

    // Recalculer via updateSettings
    const resAfter = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", sCookies)
      .send({ visibilite: "PUBLIC" });

    const scoreAfter = resAfter.body.portfolio.scoreCredibilite;

    // Le score doit avoir augmenté
    expect(scoreAfter).toBeGreaterThan(scoreBefore);
  });

  it("PS-11 : scoreCredibilite is 0 for empty portfolio", async () => {
    const s = await createAndLoginStudent();

    const res = await request(app)
      .put("/api/portfolio/settings")
      .set("Cookie", s.cookies)
      .send({ visibilite: "PUBLIC" });

    expect(res.status).toBe(200);
    // Portfolio vide → score = 0
    expect(res.body.portfolio.scoreCredibilite).toBe(0);
  });
});

// // // // tests/portfolio/update-settings.test.ts
// // // import request from "supertest";
// // // import app from "../../src/index";
// // // import { prisma } from "../../src/utils/prisma";
 
// // // describe("PUT /api/portfolio/settings", () => {
 
// // //   let studentCookies: string[] = [];
 
// // //   beforeAll(async () => {
// // //     const email = `settingsportfolio${Date.now()}@test.com`;
 
// // //     await request(app).post("/api/auth/register").send({
// // //       email,
// // //       password: "SecurePassword123!!!",
// // //       role:     "STUDENT",
// // //       name:     "Settings",
// // //       prenom:   "Test",
// // //     });
// // //     await prisma.user.update({
// // //       where: { email },
// // //       data:  { isEmailVerified: true, status: "ACTIVE" },
// // //     });
 
// // //     const login = await request(app).post("/api/auth/login").send({
// // //       email,
// // //       password: "SecurePassword123!!!",
// // //     });
// // //     studentCookies = Array.isArray(login.headers["set-cookie"])
// // //       ? login.headers["set-cookie"]
// // //       : [];
// // //   });
 
// // //   it("PS-01 : update objective", async () => {
// // //     const res = await request(app)
// // //       .put("/api/portfolio/settings")
// // //       .set("Cookie", studentCookies)
// // //       .send({ objective: "Devenir développeur fullstack" });
 
// // //     expect(res.status).toBe(200);
// // //     expect(res.body.portfolio.objective).toBe("Devenir développeur fullstack");
// // //   });
 
// // //   it("PS-02 : update visibilite to PRIVATE", async () => {
// // //     const res = await request(app)
// // //       .put("/api/portfolio/settings")
// // //       .set("Cookie", studentCookies)
// // //       .send({ visibilite: "PRIVATE" });
 
// // //     expect(res.status).toBe(200);
// // //     expect(res.body.portfolio.visibilite).toBe("PRIVATE");
// // //   });
 
// // //   it("PS-03 : update visibilite to LINK_ONLY", async () => {
// // //     const res = await request(app)
// // //       .put("/api/portfolio/settings")
// // //       .set("Cookie", studentCookies)
// // //       .send({ visibilite: "LINK_ONLY" });
 
// // //     expect(res.status).toBe(200);
// // //     expect(res.body.portfolio.visibilite).toBe("LINK_ONLY");
// // //   });
 
// // //   it("PS-04 : update visibilite to PUBLIC", async () => {
// // //     const res = await request(app)
// // //       .put("/api/portfolio/settings")
// // //       .set("Cookie", studentCookies)
// // //       .send({ visibilite: "PUBLIC" });
 
// // //     expect(res.status).toBe(200);
// // //     expect(res.body.portfolio.visibilite).toBe("PUBLIC");
// // //   });
 
// // //   it("PS-05 : invalid visibilite value returns 400 or 500", async () => {
// // //     const res = await request(app)
// // //       .put("/api/portfolio/settings")
// // //       .set("Cookie", studentCookies)
// // //       .send({ visibilite: "INVALID_VALUE" });
 
// // //     expect([400, 500]).toContain(res.status);
// // //   });
 
// // //   it("PS-06 : no token returns 401", async () => {
// // //     const res = await request(app)
// // //       .put("/api/portfolio/settings")
// // //       .send({ visibilite: "PUBLIC" });
 
// // //     expect(res.status).toBe(401);
// // //   });
 
// // //   it("PS-07 : update both objective and visibilite", async () => {
// // //     const res = await request(app)
// // //       .put("/api/portfolio/settings")
// // //       .set("Cookie", studentCookies)
// // //       .send({ objective: "Mon objectif mis à jour", visibilite: "PUBLIC" });
 
// // //     expect(res.status).toBe(200);
// // //     expect(res.body.portfolio.objective).toBe("Mon objectif mis à jour");
// // //     expect(res.body.portfolio.visibilite).toBe("PUBLIC");
// // //   });
// // // });
// // // // import request from "supertest";
// // // // import app from "../../src/index";
// // // // import { prisma } from "../../src/utils/prisma";

// // // // describe("PUT /api/portfolio/settings", () => {

// // // //   let studentCookies: string[] = [];

// // // //   beforeAll(async () => {
// // // //     const email = `settingsportfolio${Date.now()}@test.com`;

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

// // // //   it("PS-01 : update objective", async () => {
// // // //     const res = await request(app)
// // // //       .put("/api/portfolio/settings")
// // // //       .set("Cookie", studentCookies)
// // // //       .send({
// // // //         objective: "Devenir développeur fullstack",
// // // //       });

// // // //     expect(res.status).toBe(200);
// // // //     expect(res.body.portfolio.objective).toBe("Devenir développeur fullstack");
// // // //   });

// // // //   it("PS-02 : update visibilite to PRIVATE", async () => {
// // // //     const res = await request(app)
// // // //       .put("/api/portfolio/settings")
// // // //       .set("Cookie", studentCookies)
// // // //       .send({
// // // //         visibilite: "PRIVATE",
// // // //       });

// // // //     expect(res.status).toBe(200);
// // // //     expect(res.body.portfolio.visibilite).toBe("PRIVATE");
// // // //   });

// // // //   it("PS-03 : update visibilite to LINK_ONLY", async () => {
// // // //     const res = await request(app)
// // // //       .put("/api/portfolio/settings")
// // // //       .set("Cookie", studentCookies)
// // // //       .send({
// // // //         visibilite: "LINK_ONLY",
// // // //       });

// // // //     expect(res.status).toBe(200);
// // // //     expect(res.body.portfolio.visibilite).toBe("LINK_ONLY");
// // // //   });

// // // //   it("PS-04 : update visibilite to PUBLIC", async () => {
// // // //     const res = await request(app)
// // // //       .put("/api/portfolio/settings")
// // // //       .set("Cookie", studentCookies)
// // // //       .send({
// // // //         visibilite: "PUBLIC",
// // // //       });

// // // //     expect(res.status).toBe(200);
// // // //     expect(res.body.portfolio.visibilite).toBe("PUBLIC");
// // // //   });
// // // // it("PS-05 : invalid visibilite value", async () => {
// // // //   const res = await request(app)
// // // //     .put("/api/portfolio/settings")
// // // //     .set("Cookie", studentCookies)
// // // //     .send({
// // // //       visibilite: "INVALID_VALUE",
// // // //     });

// // // //   expect([400, 500]).toContain(res.status);
// // // // });
// // // // //   it("PS-05 : invalid visibilite value", async () => {
// // // // //     const res = await request(app)
// // // // //       .put("/api/portfolio/settings")
// // // // //       .set("Cookie", studentCookies)
// // // // //       .send({
// // // // //         visibilite: "INVALID_VALUE",
// // // // //       });

// // // // //     expect(res.status).toBe(400);
// // // // //   });

// // // //   it("PS-06 : no token", async () => {
// // // //     const res = await request(app)
// // // //       .put("/api/portfolio/settings")
// // // //       .send({
// // // //         visibilite: "PUBLIC",
// // // //       });

// // // //     expect(res.status).toBe(401);
// // // //   });

// // // //   it("PS-07 : update both objective and visibilite", async () => {
// // // //     const res = await request(app)
// // // //       .put("/api/portfolio/settings")
// // // //       .set("Cookie", studentCookies)
// // // //       .send({
// // // //         objective: "Mon objectif mis à jour",
// // // //         visibilite: "PUBLIC",
// // // //       });

// // // //     expect(res.status).toBe(200);
// // // //     expect(res.body.portfolio.objective).toBe("Mon objectif mis à jour");
// // // //     expect(res.body.portfolio.visibilite).toBe("PUBLIC");
// // // //   });

// // // // });
// // import request from "supertest";
// // import app from "../../src/index";
// // import { createAndLoginStudent } from "../helpers/auth.helper";

// // describe("PUT /api/portfolio/settings", () => {

// //   let cookies: string[] = [];

// //   beforeAll(async () => {
// //     const student = await createAndLoginStudent();
// //     cookies = student.cookies;
// //   });

// //   it("PS-01 : update objective", async () => {
// //     const res = await request(app)
// //       .put("/api/portfolio/settings")
// //       .set("Cookie", cookies)
// //       .send({ objective: "Mon objectif professionnel" });

// //     expect(res.status).toBe(200);
// //     expect(res.body.portfolio.objective).toBe("Mon objectif professionnel");
// //   });

// //   it("PS-02 : update visibilite to PRIVATE", async () => {
// //     const res = await request(app)
// //       .put("/api/portfolio/settings")
// //       .set("Cookie", cookies)
// //       .send({ visibilite: "PRIVATE" });

// //     expect(res.status).toBe(200);
// //     expect(res.body.portfolio.visibilite).toBe("PRIVATE");
// //   });

// //   it("PS-03 : update visibilite to LINK_ONLY", async () => {
// //     const res = await request(app)
// //       .put("/api/portfolio/settings")
// //       .set("Cookie", cookies)
// //       .send({ visibilite: "LINK_ONLY" });

// //     expect(res.status).toBe(200);
// //     expect(res.body.portfolio.visibilite).toBe("LINK_ONLY");
// //   });

// //   it("PS-04 : update visibilite to PUBLIC", async () => {
// //     const res = await request(app)
// //       .put("/api/portfolio/settings")
// //       .set("Cookie", cookies)
// //       .send({ visibilite: "PUBLIC" });

// //     expect(res.status).toBe(200);
// //     expect(res.body.portfolio.visibilite).toBe("PUBLIC");
// //   });

// //   it("PS-05 : invalid visibilite returns 500 (zod throws via next)", async () => {
// //     const res = await request(app)
// //       .put("/api/portfolio/settings")
// //       .set("Cookie", cookies)
// //       .send({ visibilite: "INVALID_VALUE" });

// //     expect([400, 500]).toContain(res.status);
// //   });

// //   it("PS-06 : no token returns 401", async () => {
// //     const res = await request(app)
// //       .put("/api/portfolio/settings")
// //       .send({ visibilite: "PUBLIC" });

// //     expect(res.status).toBe(401);
// //   });

// //   it("PS-07 : update both objective and visibilite", async () => {
// //     const res = await request(app)
// //       .put("/api/portfolio/settings")
// //       .set("Cookie", cookies)
// //       .send({ objective: "Objectif combiné", visibilite: "PUBLIC" });

// //     expect(res.status).toBe(200);
// //     expect(res.body.portfolio.objective).toBe("Objectif combiné");
// //     expect(res.body.portfolio.visibilite).toBe("PUBLIC");
// //   });
// // });
// import request from "supertest";
// import app from "../../src/index";
// import { createAndLoginStudent } from "../helpers/auth.helper";

// describe("PUT /api/portfolio/settings", () => {

//   let cookies: string[] = [];

//   beforeAll(async () => {
//     const student = await createAndLoginStudent();
//     cookies = student.cookies;
//   });

//   it("PS-01 : update objective", async () => {
//     const res = await request(app)
//       .put("/api/portfolio/settings")
//       .set("Cookie", cookies)
//       .send({ objective: "Mon objectif professionnel" });

//     expect(res.status).toBe(200);
//     expect(res.body.portfolio.objective).toBe("Mon objectif professionnel");
//   });

//   it("PS-02 : update visibilite to PRIVATE", async () => {
//     const res = await request(app)
//       .put("/api/portfolio/settings")
//       .set("Cookie", cookies)
//       .send({ visibilite: "PRIVATE" });

//     expect(res.status).toBe(200);
//     expect(res.body.portfolio.visibilite).toBe("PRIVATE");
//   });

//   it("PS-03 : update visibilite to LINK_ONLY", async () => {
//     const res = await request(app)
//       .put("/api/portfolio/settings")
//       .set("Cookie", cookies)
//       .send({ visibilite: "LINK_ONLY" });

//     expect(res.status).toBe(200);
//     expect(res.body.portfolio.visibilite).toBe("LINK_ONLY");
//   });

//   it("PS-04 : update visibilite to PUBLIC", async () => {
//     const res = await request(app)
//       .put("/api/portfolio/settings")
//       .set("Cookie", cookies)
//       .send({ visibilite: "PUBLIC" });

//     expect(res.status).toBe(200);
//     expect(res.body.portfolio.visibilite).toBe("PUBLIC");
//   });

//   it("PS-05 : invalid visibilite returns 400", async () => {
//     const res = await request(app)
//       .put("/api/portfolio/settings")
//       .set("Cookie", cookies)
//       .send({ visibilite: "INVALID_VALUE" });

//     // safeParse dans le controller → 400 proprement
//     expect(res.status).toBe(400);
//   });

//   it("PS-06 : no token returns 401", async () => {
//     const res = await request(app)
//       .put("/api/portfolio/settings")
//       .send({ visibilite: "PUBLIC" });

//     expect(res.status).toBe(401);
//   });

//   it("PS-07 : update both objective and visibilite", async () => {
//     const res = await request(app)
//       .put("/api/portfolio/settings")
//       .set("Cookie", cookies)
//       .send({ objective: "Objectif combiné", visibilite: "PUBLIC" });

//     expect(res.status).toBe(200);
//     expect(res.body.portfolio.objective).toBe("Objectif combiné");
//     expect(res.body.portfolio.visibilite).toBe("PUBLIC");
//   });

//   it("PS-08 : PROF cannot update portfolio settings", async () => {
//     const { createAndLoginProf } = await import("../helpers/auth.helper");
//     const prof = await createAndLoginProf();

//     const res = await request(app)
//       .put("/api/portfolio/settings")
//       .set("Cookie", prof.cookies)
//       .send({ visibilite: "PUBLIC" });

//     expect(res.status).toBe(403);
//   });
// });