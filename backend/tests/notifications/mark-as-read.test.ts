import request from "supertest";
import app from "../../src/index";
import { createAndLoginStudent, getStudentId } from "../helpers/auth.helper";
import { prisma } from "../../src/utils/prisma";

describe("PUT /api/notifications/:id/read and read-all", () => {

  let cookies: string[] = [];
  let notifId: number;

  beforeAll(async () => {
    const s = await createAndLoginStudent();
    cookies = s.cookies;
    const studentId = await getStudentId(s.email);

    // Créer une notification directement en DB
    const notif = await prisma.notification.create({
      data: {
        studentId,
        message: "Test notification",
        type:    "PROJECT_SUBMITTED",
        isRead:  false,
      },
    });
    notifId = notif.id;
  });

  it("MR-01 : mark notification as read", async () => {
    const res = await request(app)
      .put(`/api/notifications/${notifId}/read`)
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
    expect(res.body.notification.isRead).toBe(true);
  });

  it("MR-02 : invalid id returns 400", async () => {
    const res = await request(app)
      .put("/api/notifications/abc/read")
      .set("Cookie", cookies);

    expect(res.status).toBe(400);
  });

  it("MR-03 : not found returns 500", async () => {
    const res = await request(app)
      .put("/api/notifications/999999/read")
      .set("Cookie", cookies);

    expect([404, 500]).toContain(res.status);
  });

  it("MR-04 : mark all as read", async () => {
    const res = await request(app)
      .put("/api/notifications/read-all")
      .set("Cookie", cookies);

    expect(res.status).toBe(200);
  });

  it("MR-05 : no token returns 401", async () => {
    const res = await request(app).put(`/api/notifications/${notifId}/read`);
    expect(res.status).toBe(401);
  });
});