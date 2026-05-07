import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma.js";
import { Prisma } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";
import crypto from "crypto";
import { sendEmail, emailTemplates } from "../../utils/mailer.js";

const BCRYPT_SALT_ROUNDS = 12;

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

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    const error: any = new Error("Inscription impossible");
    error.statusCode = 409;
    throw error;
  }

  const newUser = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    return await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        ...(role === "STUDENT" && { student: { create: {} } }),
        ...(role === "PRO" && { professionnel: { create: {} } }),
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  });

  return newUser;
};



// ── Login ─────────────────────────────────────────────────────────
export const loginUser = async (
  data: LoginInput,
  meta?: { ip?: string; userAgent?: string }
) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      password: true,
      isEmailVerified: true,
    },
  });

  // Comparer meme si user inexistant — temps de reponse constant
   const isValid = await bcrypt.compare(
    password,
    user?.password ?? DUMMY_HASH
  );

  if (!user || !isValid) {
    // Logger FAILED seulement si l'user existe — userId obligatoire dans LoginLog
    // Si email inconnu : user = null → pas de userId → on ne peut pas logger
    if (user) {
      await prisma.loginLog.create({
        data: {
          userId: user.id,
          ip: meta?.ip ?? null,
          userAgent: meta?.userAgent ?? null,
          status: "FAILED",
        },
      });
    }

    const error: any = new Error("Identifiants incorrects");
    error.statusCode = 401;
    throw error;
  }

  //  email non vérifié
  if (!user.isEmailVerified) {
    const error: any = new Error(
      "Veuillez vérifier votre email avant de vous connecter"
    );
    error.statusCode = 403;
    throw error;
  }

  // Verification specifique PRO : compte doit etre valide par un Admin
  if (user.role === "PRO") {
    const pro = await prisma.professionnel.findUnique({
      where: { userId: user.id },
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
    role: user.role,
  });

  // Refresh token — longue duree (7j via .env), stocke en BDD
  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.loginLog.create({
    data: {
      userId: user.id,
      ip: meta?.ip ?? null,
      userAgent: meta?.userAgent ?? null,
      status: "SUCCESS",
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
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
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    const error: any = new Error("Session expirée");
    error.statusCode = 401;
    throw error;
  }

  const payload = verifyRefreshToken(refreshToken);

  return {
    accessToken: generateAccessToken({
      userId: payload.userId,
    }),
  };
};

// ── Logout ────────────────────────────────────────────────────────
export const logoutUser = async (
  refreshToken: string,
  userId?: number,
  meta?: { ip?: string; userAgent?: string }
) => {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });

  if (userId) {
    await prisma.loginLog.create({
      data: {
        userId,
        ip: meta?.ip ?? null,
        userAgent: meta?.userAgent ?? null,
        status: "LOGOUT",
      },
    });
  }
};

// ───────────────────────── EMAIL VERIFICATION ─────────────────────────
export const sendVerificationEmail = async (
  userId: number,
  email: string
) => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerificationToken: hashedToken,
      emailVerificationExpires: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ),
    },
  });

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

  const template = emailTemplates.verifyEmail(verifyLink);

  await sendEmail({
    to: email,
    subject: template.subject,
    html: template.html,
  });
};

// ───────────────────────── VERIFY EMAIL ─────────────────────────
export const verifyEmailService = async (rawToken: string) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { gt: new Date() },
    },
    select: { id: true },
  });

  if (!user) {
    throw new Error("Token invalide ou expiré");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });
};