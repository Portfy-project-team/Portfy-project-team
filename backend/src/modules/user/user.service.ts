import prisma from "../../shared/utils/prisma.js";
import {
  ChangePasswordInput,
  UpdateProfessionnelInput,
  UpdateProfInput,
  UpdateStudentInput,
} from "./user.validation.js";
import bcrypt from "bcryptjs";

export const UserService = {
  async getFullProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
         student:{
             include: { 
                skills: { include: { skill: true }
             } 
            }}, 
        prof:true,
        professionnel:true
      },
    });
  },

  async upsertStudentProfile(userId: number, data: UpdateStudentInput) {
      const { skills, ...studentData } = data;

 return prisma.$transaction(async (tx) => {

    // 1. إنشاء أو تحديث الطالب
    const student = await tx.student.upsert({
      where: { userId },
      create: {
        userId,
        ...studentData,
      },
      update: studentData,
    });

    // 2. التعامل مع skills
    if (skills) {

      // حذف العلاقات القديمة
      await tx.studentSkill.deleteMany({
        where: { studentId: student.id },
      });

      // إضافة العلاقات الجديدة
      if (skills.length > 0) {
        await tx.studentSkill.createMany({
          data: skills.map((skill) => ({
            studentId: student.id,
            skillId: skill.skillId,
            niveau: skill.niveau ?? "DEBUTANT",
          })),
        });
      }
    }

    // 3. إرجاع الملف الكامل
    return tx.student.findUnique({
      where: { id: student.id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });
  });
  },
  async upsertProfessorProfile(userId: number, data: UpdateProfInput) {
    return prisma.prof.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  },
  async upsertCompanyProfile(userId: number, data: UpdateProfessionnelInput) {
    return prisma.professionnel.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  },
  async changePassword(userId: number, data: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("user not found");
    }
    const isValid = await bcrypt.compare(data.currentPassword, user.password);
    if (!isValid) {
      throw new Error("current password is incorrect");
    }
    const hashed = await bcrypt.hash(data.newPassword, 12);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { password: hashed },
      }),
  prisma.refreshToken.deleteMany({
  where: { userId },
})
    ]);
  },
};
