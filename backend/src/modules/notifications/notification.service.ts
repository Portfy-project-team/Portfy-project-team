import { prisma } from "../../utils/prisma.js";

export const GetMyNotifications = async (userId: number, role: string) => {
  if (role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new Error("Profil étudiant introuvable");
    return prisma.notification.findMany({
      where: { studentId: student.id },
      orderBy: { dateC: "desc" },
    });
  }
  if (role === "PROF") {
    const prof = await prisma.prof.findUnique({ where: { userId } });
    if (!prof) throw new Error("Profil professeur introuvable");
    return prisma.notification.findMany({
      where: { profId: prof.id },
      orderBy: { dateC: "desc" },
    });
  }
  if (role === "PRO") {
    const pro = await prisma.professionnel.findUnique({ where: { userId } });
    if (!pro) throw new Error("Profil professionnel introuvable");
    return prisma.notification.findMany({
      where: { proId: pro.id },
      orderBy: { dateC: "desc" },
    });
  }
  if (role === "ADMIN") {
    const admin = await prisma.admin.findUnique({ where: { userId } });
    if (!admin) throw new Error("Profil admin introuvable");
    return prisma.notification.findMany({
      where: { adminId: admin.id },
      orderBy: { dateC: "desc" },
    });
  }
  throw new Error("FORBIDDEN");
};

export const MarkAsRead = async (
  notificationId: number,
  userId: number,
  role: string
) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });
  if (!notification) throw new Error("Notification introuvable");

  if (role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student || notification.studentId !== student.id)
      throw new Error("FORBIDDEN");
  } else if (role === "PROF") {
    const prof = await prisma.prof.findUnique({ where: { userId } });
    if (!prof || notification.profId !== prof.id)
      throw new Error("FORBIDDEN");
  } else if (role === "PRO") {
    const pro = await prisma.professionnel.findUnique({ where: { userId } });
    if (!pro || notification.proId !== pro.id)
      throw new Error("FORBIDDEN");
  } else if (role === "ADMIN") {
    const admin = await prisma.admin.findUnique({ where: { userId } });
    if (!admin || notification.adminId !== admin.id)
      throw new Error("FORBIDDEN");
  } else {
    throw new Error("FORBIDDEN");
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

export const MarkAllAsRead = async (userId: number, role: string) => {
  if (role === "STUDENT") {
    const student = await prisma.student.findUnique({ where: { userId } });
    if (!student) throw new Error("Profil étudiant introuvable");
    return prisma.notification.updateMany({
      where: { studentId: student.id, isRead: false },
      data: { isRead: true },
    });
  }
  if (role === "PROF") {
    const prof = await prisma.prof.findUnique({ where: { userId } });
    if (!prof) throw new Error("Profil professeur introuvable");
    return prisma.notification.updateMany({
      where: { profId: prof.id, isRead: false },
      data: { isRead: true },
    });
  }
  if (role === "PRO") {
    const pro = await prisma.professionnel.findUnique({ where: { userId } });
    if (!pro) throw new Error("Profil professionnel introuvable");
    return prisma.notification.updateMany({
      where: { proId: pro.id, isRead: false },
      data: { isRead: true },
    });
  }
  if (role === "ADMIN") {
    const admin = await prisma.admin.findUnique({ where: { userId } });
    if (!admin) throw new Error("Profil admin introuvable");
    return prisma.notification.updateMany({
      where: { adminId: admin.id, isRead: false },
      data: { isRead: true },
    });
  }
  throw new Error("FORBIDDEN");
};