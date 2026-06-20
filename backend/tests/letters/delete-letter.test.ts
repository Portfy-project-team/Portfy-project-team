// import request from "supertest";
// import app from "../../src/index";
// import { createAndLoginProf, createAndLoginStudent, getStudentId } from "../helpers/auth.helper";
// import { prisma } from "../../src/utils/prisma";

// describe("DELETE /api/letters/:id", () => {

//   let profCookies: string[] = [];
//   let lettreId: number;

//   beforeAll(async () => {
//     const prof = await createAndLoginProf();
//     profCookies = prof.cookies;
//     const s = await createAndLoginStudent();
//     const studentId = await getStudentId(s.email);

//     const profUser = await prisma.user.findFirst({
//       where: { email: { startsWith: "prof" } }, include: { prof: true },
//     });

//     const lettre = await prisma.lettreRecommandation.create({
//       data: { contenu: "À supprimer", visibilite: "PRIVATE", profId: profUser!.prof!.id },
//     });
//     await prisma.lettreStudent.create({ data: { lettreId: lettre.id, studentId } });
//     lettreId = lettre.id;
//   });

//   it("DL-01 : prof deletes their letter", async () => {
//     const res = await request(app)
//       .delete(`/api/letters/${lettreId}`)
//       .set("Cookie", profCookies);

//     expect(res.status).toBe(200);
//   });

//   it("DL-02 : already deleted returns 404", async () => {
//     const res = await request(app)
//       .delete(`/api/letters/${lettreId}`)
//       .set("Cookie", profCookies);

//     expect(res.status).toBe(404);
//   });

//   it("DL-03 : invalid id returns 400", async () => {
//     const res = await request(app)
//       .delete("/api/letters/abc")
//       .set("Cookie", profCookies);

//     expect(res.status).toBe(400);
//   });

//   it("DL-04 : no token returns 401", async () => {
//     const res = await request(app).delete(`/api/letters/${lettreId}`);
//     expect(res.status).toBe(401);
//   });
// });
import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";
import {
  createAndLoginProf,
  createAndLoginStudent,
  getStudentId,
  getProfId,
} from "../helpers/auth.helper";

describe("DELETE /api/letters/:id", () => {

  let profCookies: string[] = [];
  let lettreId: number;

  beforeAll(async () => {
    // Créer le prof et récupérer son vrai profId
    const prof = await createAndLoginProf();
    profCookies = prof.cookies;
    const profId = await getProfId(prof.email);   // ← ID exact du prof créé

    const s = await createAndLoginStudent();
    const studentId = await getStudentId(s.email);

    // Créer la lettre avec le profId exact
    const lettre = await prisma.lettreRecommandation.create({
      data: {
        contenu:    "Lettre à supprimer par le bon prof",
        visibilite: "PRIVATE",
        profId,                                    // ← Utilise le bon profId
      },
    });
    await prisma.lettreStudent.create({
      data: { lettreId: lettre.id, studentId },
    });
    lettreId = lettre.id;
  });

  it("DL-01 : prof deletes their own letter", async () => {
    const res = await request(app)
      .delete(`/api/letters/${lettreId}`)
      .set("Cookie", profCookies);

    expect(res.status).toBe(200);
  });

  it("DL-02 : already deleted returns 404", async () => {
    const res = await request(app)
      .delete(`/api/letters/${lettreId}`)
      .set("Cookie", profCookies);

    expect(res.status).toBe(404);
  });

  it("DL-03 : invalid id returns 400", async () => {
    const res = await request(app)
      .delete("/api/letters/abc")
      .set("Cookie", profCookies);

    expect(res.status).toBe(400);
  });

  it("DL-04 : no token returns 401", async () => {
    const res = await request(app)
      .delete(`/api/letters/${lettreId}`);

    expect(res.status).toBe(401);
  });

  it("DL-05 : wrong prof cannot delete another prof letter", async () => {
    // Créer une nouvelle lettre appartenant à un autre prof
    const otherProf = await createAndLoginProf();
    const otherProfId = await getProfId(otherProf.email);

    const autreLettre = await prisma.lettreRecommandation.create({
      data: { contenu: "Lettre d'un autre prof", visibilite: "PRIVATE", profId: otherProfId },
    });

    // Le premier prof tente de supprimer la lettre de l'autre prof
    const res = await request(app)
      .delete(`/api/letters/${autreLettre.id}`)
      .set("Cookie", profCookies);

    expect(res.status).toBe(403);
  });
});