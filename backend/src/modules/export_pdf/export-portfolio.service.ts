import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const fetchAuthenticatedStudentProfile = async (userId: number) => {
  const profile = await prisma.student.findUnique({
    where: { userId },
    include: {
      user: {
        select: { avatarUrl: true },
      },
      portfolio: {
        include: {
          projets: {
            where:   { statusV: 'VALIDATED' },
            orderBy: { dateSoumission: 'desc' },
            include: { skills: { include: { skill: true } } },
          },
        },
      },
      Stage: {
        where:   { statutV: 'VALIDATED' },
        orderBy: { dateDebut: 'desc' },
      },
      skills: {
        include: { skill: true },
      },
      StudentFormation: {
        include: { Formation: true },
        orderBy: { formationId: 'desc' },
      },
    },
  });

  if (!profile) throw new Error('PROFILE_NOT_FOUND');

  return {
    ...profile,
    avatarUrl: profile.avatarUrl || profile.user?.avatarUrl || null,
  };
};