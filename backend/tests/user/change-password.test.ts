import request from "supertest";
import app from "../../src/index";
import { prisma } from "../../src/utils/prisma";

describe("PATCH /api/user/change-password", () => {

  let cookies: string[] = [];

  beforeAll(async () => {

    const email = `changepass${Date.now()}@test.com`;

    await request(app)
      .post("/api/auth/register")
      .send({
        email,
        password: "OldPassword123!",
        role: "STUDENT",
      });

    await prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
      },
    });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email,
        password: "OldPassword123!",
      });

    cookies = Array.isArray(login.headers["set-cookie"])
      ? login.headers["set-cookie"]
      : [];
  });

  it("CP-01 : change password success", async () => {

    const res = await request(app)
      .patch("/api/user/change-password")
      .set("Cookie", cookies)
      .send({
        currentPassword: "OldPassword123!",
        newPassword: "NewPassword123!",
      });

    expect(res.status).toBe(200);
  });

  it("CP-02 : wrong current password", async () => {

    const res = await request(app)
      .patch("/api/user/change-password")
      .set("Cookie", cookies)
      .send({
        currentPassword: "WrongPassword",
        newPassword: "NewPassword123!",
      });

    expect([400, 500]).toContain(res.status);
  });

});
