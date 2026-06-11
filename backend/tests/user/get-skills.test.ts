// // import request from "supertest";
// // import app from "../../src/index";
// // import { prisma } from "../../src/utils/prisma";

// // describe("GET /api/user/skills", () => {

// //   beforeAll(async () => {

// //     await prisma.skill.create({
// //       data: {
// //         nom: `NodeJS-${Date.now()}`,
// //       },
// //     });

// //   });

// //   it("GS-01 : get all skills", async () => {

// //     const res = await request(app)
// //       .get("/api/user/skills");

// //     expect(res.status).toBe(200);
// //     expect(Array.isArray(res.body)).toBe(true);
// //   });

// // });
// import request from "supertest";
// import app from "../../src/index";

// describe("GET /api/user/skills", () => {

//   it("GS-01 : liste des compétences → 200", async () => {
//     const res = await request(app).get("/api/user/skills");
//     expect(res.status).toBe(200);
//     // Accepter tableau direct ou objet wrappé
//     const data = Array.isArray(res.body) ? res.body : (res.body.skills ?? res.body.data ?? []);
//     expect(Array.isArray(data)).toBe(true);
//   });

//   it("GS-02 : route publique — sans token → pas 401", async () => {
//     const res = await request(app).get("/api/user/skills");
//     expect(res.status).not.toBe(401);
//   });
// });
import request from "supertest";
import app from "../../src/index";

describe("GET /api/user/skills", () => {

  it("GS-01 : liste des compétences → 200 avec tableau", async () => {
    const res = await request(app).get("/api/user/skills");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("skills");
    expect(Array.isArray(res.body.skills)).toBe(true);
  });

  it("GS-02 : route publique — pas de token requis", async () => {
    const res = await request(app).get("/api/user/skills");
    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });
});
