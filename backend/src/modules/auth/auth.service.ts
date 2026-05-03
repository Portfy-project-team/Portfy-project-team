
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";

import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma.js";

type RegisterData = {
  email: string;
  password: string;
  role: "STUDENT" | "PROF" | "PRO";
};

export const registerUser = async ({
  email,
  password,
  role,


}: RegisterData) => {
  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,

      ...(role === "STUDENT" && {
        student: {
          create: {},
        },
      }),

      ...(role === "PROF" && {
        prof: {
          create: {},
        },
      }),

      ...(role === "PRO" && {
        professionnel: {
          create: {},
        },
      }),
    },
  });

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };

};

type LoginData = {
  email: string;
  password: string;
};

export const loginUser = async ({ email, password }: LoginData) => {

  // 1. Check user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  // 2. Check password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  // 3. Access token (15min)
  const accessToken = generateAccessToken({
  userId: user.id,
  role: user.role,
});


  // 4. Refresh token (7d)
  const refreshToken = generateRefreshToken({
  userId: user.id,
});

  // 5. Save refresh token in DB
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken, role: user.role };
};

export const refreshTokenService = async (refreshToken: string) => {

  // 1. Check token exists in DB
  const tokenInDb = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!tokenInDb) throw new Error("Invalid refresh token");

  // 2. Check token not expired
  if (tokenInDb.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    throw new Error("Refresh token expired");
  }

  // 3. Verify signature
  const payload = verifyRefreshToken(refreshToken);

  // 4. Generate new access token
  const accessToken = generateAccessToken({ userId: payload.userId });

  return { accessToken };

};