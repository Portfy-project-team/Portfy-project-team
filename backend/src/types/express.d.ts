import { Role } from "@prisma/client";
// Extension du type Request Express — ajoute req.user dans toute la chaine
declare global {
  namespace Express {
    interface Request {
      user: {
        id:    number; // Int dans le schema Prisma (@id @default(autoincrement()))
        role:  Role;   // enum Prisma : STUDENT | PROF | PRO | ADMIN
      };
    }
  }
}
export {};