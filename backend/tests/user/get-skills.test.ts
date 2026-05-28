import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("GET /api/user/skills", () => {

  beforeAll(async () => {

    await prisma.skill.create({
      data: {
        nom: `NodeJS-${Date.now()}`,
      },
    });

  });

  it("GS-01 : get all skills", async () => {

    const res = await request(app)
      .get("/api/user/skills");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
