<<<<<<< HEAD

import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";

=======
>>>>>>> 90ae145350d2bd1c6f4c3029f591473bfc107e39
import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma.js";
import { Prisma } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";

const BCRYPT_SALT_ROUNDS = 12;

<<<<<<< HEAD
export const registerUser = async ({
  email,
  password,
  role,


}: RegisterData) => {
  // Check existing user
=======
// Hash factice pour maintenir un temps de reponse constant (anti-timing attack)
// Utilise dans loginUser si l'email n'existe pas — bcrypt.compare tourne quand meme
const DUMMY_HASH =
  "$2a$12$LQv3c1yqBWVHxkd0LQ1Ns.sGKJnbHzGj0WkSTrMBxU7q5F3e1A/S2";

// ── Register ─────────────────────────────────────────────────────
export const registerUser = async (data: RegisterInput) => {
  const { email, password, role } = data;

  // Hash EN PREMIER — temps de reponse constant que l'email existe ou non
  // Sans ca : reponse immediate (~1ms) si email existe, ~400ms si non
  // → un attaquant detecte les emails enregistres par le temps de reponse
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

>>>>>>> 90ae145350d2bd1c6f4c3029f591473bfc107e39
  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    // Message generique — ne pas dire "Email deja utilise"
    const error: any = new Error("Inscription impossible");
    error.statusCode = 409;
    throw error;
  }

  // Transaction atomique : User + profil crees ensemble ou pas du tout
  // Sans transaction : si le profil echoue apres le User, BDD incoherente
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    return await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        ...(role === "STUDENT" && { student:      { create: {} } }),
        ...(role === "PRO"     && { professionnel: { create: {} } }),
        // PROF absent intentionnellement — cree uniquement par un Admin
      },
      // select explicite — password jamais retourne
      select: {
        id:        true,
        email:     true,
        role:      true,
        createdAt: true,
      },
    });
  });
};

// ── Login ─────────────────────────────────────────────────────────
export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id:       true,
      email:    true,
      role:     true,
      password: true, // necessaire uniquement ici pour bcrypt.compare
    },
  });

<<<<<<< HEAD
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };

};
=======
  // Comparer meme si user inexistant — temps de reponse constant
  const isValid = await bcrypt.compare(
    password,
    user?.password ?? DUMMY_HASH
  );
>>>>>>> 90ae145350d2bd1c6f4c3029f591473bfc107e39

  if (!user || !isValid) {
    const error: any = new Error("Identifiants incorrects");
    error.statusCode = 401;
    throw error;
  }

  // Verification specifique PRO : compte doit etre valide par un Admin
  if (user.role === "PRO") {
    const pro = await prisma.professionnel.findUnique({
      where:  { userId: user.id },
      select: { statusV: true },
    });
    if (pro?.statusV === "PENDING") {
      const error: any = new Error(
        "Compte en attente de validation par un administrateur"
      );
      error.statusCode = 403;
      throw error;
    }
  }

  // Access token — payload minimal, courte duree (15m via .env)
  const accessToken = generateAccessToken({
    userId: user.id,
    role:   user.role,
  });

  // Refresh token — longue duree (7j via .env), stocke en BDD
  const refreshToken = generateRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      token:     refreshToken,
      userId:    user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Retourner uniquement les infos utilisateur — tokens via cookies dans le controller
  return {
    user: { id: user.id, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

// ── Refresh ───────────────────────────────────────────────────────
export const refreshTokenService = async (refreshToken: string) => {
  const tokenInDb = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!tokenInDb) {
    const error: any = new Error("Token invalide");
    error.statusCode = 401;
    throw error;
  }

  if (tokenInDb.expiresAt < new Date()) {
    // Supprimer le token expire de la BDD
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    const error: any = new Error("Session expiree. Reconnectez-vous.");
    error.statusCode = 401;
    throw error;
  }

  // Verifier la signature — leve une exception si falsifie
  const payload = verifyRefreshToken(refreshToken);

  const newAccessToken = generateAccessToken({ userId: payload.userId });

<<<<<<< HEAD
  return { accessToken };

=======
  return { accessToken: newAccessToken };
};

// ── Logout ────────────────────────────────────────────────────────
export const logoutUser = async (refreshToken: string) => {
  // Supprimer le refresh token de la BDD — invalide la session cote serveur
  // Meme si le token n'existe pas, on continue (deconnexion idempotente)
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 90ae145350d2bd1c6f4c3029f591473bfc107e39
=======

  // Logger LOGOUT — userId optionnel car verifyToken peut echouer avant logout
  if (userId) {
    await prisma.loginLog.create({
      data: {
        userId,
        ip:        meta?.ip ?? null,
        userAgent: meta?.userAgent ?? null,
        status:    "LOGOUT",
      },
    });
  }
>>>>>>> de514520bddac02492a1af86f64db9d01a7b3d06
=======
>>>>>>> parent of de51452 (Merge pull request #21 /feature/auth_register)
};