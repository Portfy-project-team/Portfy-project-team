// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export const cleanDatabase = async () => {
//   // Supprimer dans l'ordre pour respecter les FK
//   await prisma.loginLog.deleteMany();
//   await prisma.passwordResetToken.deleteMany();
//   await prisma.refreshToken.deleteMany();
//   await prisma.professionnel.deleteMany();
//   await prisma.prof.deleteMany();
//   await prisma.student.deleteMany();
//   await prisma.admin.deleteMany();
// };

// afterEach(async () => {
//   await cleanDatabase();
// });

// afterAll(async () => {
//   await prisma.$disconnect();
// });
export const resetDB = async () => {
  // later: prisma clean
};
