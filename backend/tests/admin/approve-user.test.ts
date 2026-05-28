import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("POST /api/admin/accept-invite/:id", () => {

  let adminCookies: string[] = [];
  let pendingUserId: number;

  beforeAll(async () => {

    // create admin
    const adminEmail = `approveadmin${Date.now()}@test.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        email: adminEmail,
        password: "SecurePassword123!!!",
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
        password: "SecurePassword123!!!",
      });

    // adminCookies = login.headers["set-cookie"];
       adminCookies = Array.isArray(login.headers["set-cookie"])
      ? login.headers["set-cookie"]
      : [];

    // create pending user
    const user = await prisma.user.create({
      data: {
        email: `pending${Date.now()}@test.com`,
        password: "hashedpassword",
        role: "STUDENT",
        status: "PENDING",
      },
    });

    pendingUserId = user.id;
  });

  it("AP-01 : approve pending user", async () => {

    const res = await request(app)
      .post(`/api/admin/accept-invite/${pendingUserId}`)
      .set("Cookie", adminCookies);

    expect(res.status).toBe(200);
    expect(res.body.user.status).toBe("ACTIVE");
  });

  it("AP-02 : already active user", async () => {

    const res = await request(app)
      .post(`/api/admin/accept-invite/${pendingUserId}`)
      .set("Cookie", adminCookies);

    expect(res.status).toBe(409);
  });

  it("AP-03 : invalid id", async () => {

    const res = await request(app)
      .post("/api/admin/accept-invite/abc")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(400);
  });

  it("AP-04 : user not found", async () => {

    const res = await request(app)
      .post("/api/admin/accept-invite/999999")
      .set("Cookie", adminCookies);

    expect(res.status).toBe(404);
  });

  it("AP-05 : no token", async () => {

    const res = await request(app)
      .post(`/api/admin/accept-invite/${pendingUserId}`);

    expect(res.status).toBe(401);
  });

});
