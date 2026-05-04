import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma.js";
import { Prisma } from '@prisma/client';              // ← ajout pour typer tx
import type { RegisterInput } from "./auth.validation.js";

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Service gérant uniquement la création d'utilisateur et de son profil associé
 */
export const registerUser = async (data: RegisterInput) => {
  const { email, password, role } = data;

  // Hash en premier pour garantir un temps de réponse constant
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw new Error("Inscription impossible");
  }

  // Transaction atomique pour assurer la cohérence entre User et son profil (Student/Pro)
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {   // ← typage ajouté
    return await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        // Création automatique du profil selon le rôle choisi
        ...(role === "STUDENT" && {
          student: { create: {} },
        }),
        ...(role === "PRO" && {
          professionnel: { create: {} },
        }),
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  });
};