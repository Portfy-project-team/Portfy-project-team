import { prisma } from "../../utils/prisma.js";
import { UpdatePortfolioSettingsInput } from "./portfolio.validation.js";

export const PortfolioService = {

  // GET /api/portfolio/me
  async getMyPortfolio(userId: number) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        skills: { include: { skill: true } },
        StudentFormation: { include: { Formation: true } },
        Stage: true,
        portfolio: {
          include: {
            projets: true,
          },
        },
      },
    });
    return student;
  },

  // GET /api/portfolio/public/:studentId
  async getPublicPortfolio(studentId: number) {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        skills: { include: { skill: true } },
        StudentFormation: { include: { Formation: true } },
        Stage: {
          where: { statutV: "VALIDATED" },
        },
        portfolio: {
          include: {
            projets: {
              where: { statusV: "VALIDATED" },
            },
          },
        },
      },
    });

    if (!student) return null;

    if (!student.portfolio) return null;

    if (student.portfolio.visibilite === "PRIVATE") {
      return { restricted: true };
    }

    return student;
  },

  // PUT /api/portfolio/settings
  async updateSettings(userId: number, data: UpdatePortfolioSettingsInput) {
    const student = await prisma.student.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!student) throw new Error("Student not found");

    // Upsert portfolio si pas encore créé
    return prisma.portfolio.upsert({
      where: { studentId: student.id },
      create: {
        studentId: student.id,
        ...data,
      },
      update: data,
    });
  },
};