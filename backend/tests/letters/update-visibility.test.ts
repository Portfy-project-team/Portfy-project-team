import request from "supertest";
import app from "../../src/index";
import {
  createAndLoginStudent, createAndLoginProf,
  getStudentId, loginAs,
} from "../helpers/auth.helper";
import { prisma } from "../../src/utils/prisma";

describe("PUT /api/letters/:id/visibility", () => {

  let studentCookies: string[] = [];
  let lettreId: number;

  beforeAll(async () => {
    const prof = await createAndLoginProf();
    const s    = await createAndLoginStudent();
    studentCookies = s.cookies;
    const studentId = await getStudentId(s.email);
    const profUser  = await prisma.user.findFirst({
      where: { email: { startsWith: "prof" } }, include: { prof: true },
    });

    const lettre = await prisma.lettreRecommandation.create({
      data: { contenu: "Lettre test", visibilite: "PRIVATE", profId: profUser!.prof!.id },
    });
    await prisma.lettreStudent.create({ data: { lettreId: lettre.id, studentId } });
    lettreId = lettre.id;
  });

  it("UV-01 : student updates visibility to PUBLIC", async () => {
    const res = await request(app)
      .put(`/api/letters/${lettreId}/visibility`)
      .set("Cookie", studentCookies)
      .send({ visibilite: "PUBLIC" });

    expect(res.status).toBe(200);
    expect(res.body.letter.visibilite).toBe("PUBLIC");
  });

  it("UV-02 : student updates visibility to DOWNLOADABLE", async () => {
    const res = await request(app)
      .put(`/api/letters/${lettreId}/visibility`)
      .set("Cookie", studentCookies)
      .send({ visibilite: "DOWNLOADABLE" });

    expect(res.status).toBe(200);
    expect(res.body.letter.visibilite).toBe("DOWNLOADABLE");
  });

  it("UV-03 : invalid visibilite returns 400", async () => {
    const res = await request(app)
      .put(`/api/letters/${lettreId}/visibility`)
      .set("Cookie", studentCookies)
      .send({ visibilite: "INVALID" });

    expect(res.status).toBe(400);
  });

  it("UV-04 : no token returns 401", async () => {
    const res = await request(app)
      .put(`/api/letters/${lettreId}/visibility`)
      .send({ visibilite: "PUBLIC" });

    expect(res.status).toBe(401);
  });

  it("UV-05 : invalid id returns 400", async () => {
    const res = await request(app)
      .put("/api/letters/abc/visibility")
      .set("Cookie", studentCookies)
      .send({ visibilite: "PUBLIC" });

    expect(res.status).toBe(400);
  });
});