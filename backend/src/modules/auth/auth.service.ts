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