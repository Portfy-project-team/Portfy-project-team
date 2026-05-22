import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("PATCH /api/admin/users/:id/status", () => {

  let adminCookies: string[] = [];
  let userId: number;

  beforeAll(async () => {

    const adminEmail = `adminstatus${Date.now()}@test.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        email: adminEmail,
        password: "Secure123!!!",
        role: "STUDENT",
      });

    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: "ADMIN",
        isEmailVerified: true,
      },
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: adminEmail,
        password: "Secure123!!!",
      });

    // adminCookies = login.headers["set-cookie"];
     adminCookies = Array.isArray(login.headers["set-cookie"])
      ? login.headers["set-cookie"]
      : [];

    const user = await prisma.user.create({
      data: {
        email: `statususer${Date.now()}@test.com`,
        password: "hashed",
        role: "STUDENT",
        status: "PENDING",
      },
    });

    userId = user.id;
  });

  it("US-01 : update user status", async () => {

    const res = await request(app)
      .patch(`/api/admin/users/${userId}/status`)
      .set("Cookie", adminCookies)
      .send({
        status: "ACTIVE",
      });

    expect(res.status).toBe(200);
    expect(res.body.user.status).toBe("ACTIVE");
  });

  it("US-02 : same status", async () => {

    const res = await request(app)
      .patch(`/api/admin/users/${userId}/status`)
      .set("Cookie", adminCookies)
      .send({
        status: "ACTIVE",
      });

    expect(res.status).toBe(409);
  });

  it("US-03 : invalid id", async () => {

    const res = await request(app)
      .patch("/api/admin/users/abc/status")
      .set("Cookie", adminCookies)
      .send({
        status: "BLOCKED",
      });

    expect(res.status).toBe(400);
  });

  it("US-04 : no token", async () => {

    const res = await request(app)
      .patch(`/api/admin/users/${userId}/status`)
      .send({
        status: "BLOCKED",
      });

    expect(res.status).toBe(401);
  });

});