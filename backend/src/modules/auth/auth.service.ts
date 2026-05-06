import {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
  TokenPayload,
  verifyRefreshToken,
} from "../../shared/utils/jwt.js";
import bcrypt from "bcryptjs";
import prisma from "../../shared/utils/prisma.js";

type RegisterData = {
  email: string;
  password: string;
  role: "STUDENT" | "PROF" | "PRO";
};

export const registerUser = async ({ email, password, role }: RegisterData) => {
  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // if (existingUser) {
  //   throw new Error("User already exists");
  // }
  if (existingUser) {
    const error: any = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      status: "active",
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
  // if (!user) throw new Error("Invalid credentials");
  if (!user) {
    const error: any = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  // 2. Check password
  const isValid = await bcrypt.compare(password, user.password);
  // if (!isValid) throw new Error("Invalid credentials");
  if (!isValid) {
    const error: any = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  // 3. Access token (15min)
  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  // 4. Refresh token (7d)
  const refreshToken = generateRefreshToken({
    userId: user.id,
    role: user.role,
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

  // if (!tokenInDb) throw new Error("Invalid refresh token");
  if (!tokenInDb) {
    const error: any = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  // 2. Check token not expired
  if (tokenInDb.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
    // throw new Error("Refresh token expired");
    const error: any = new Error("Refresh token expired");
    error.statusCode = 401;
    throw error;
  }

  // 3. Verify signature
  const payload = verifyRefreshToken(refreshToken);

  // 4. Generate new access token
  const accessToken = generateAccessToken({
    userId: payload.userId,
    role: payload.role,
  });

  return { accessToken };
};

export const logoutUser = async (refreshToken: string) => {
  const tokenInDb = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  // if (!tokenInDb) throw new Error("Invalid refresh token");
  if (!tokenInDb) {
    const error: any = new Error("Invalid refresh token");
    error.statusCode = 401;
    throw error;
  }

  await prisma.refreshToken.delete({
    where: { token: refreshToken },
  });

  return { message: "Logged out successfully" };
};


