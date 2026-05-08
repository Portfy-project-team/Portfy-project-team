import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma.js";

type RegisterData = {
  email: string;
  password: string;
};

export const registerUser = async ({
  email,
  password,
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

  // Detect role from email
  let role: "STUDENT" | "PROF" | "PRO";

  if (email.endsWith("@etu.uae.ac.ma")) {

    role = "STUDENT";

  } else if (
    email.endsWith("@uae.ac.ma") &&
    !email.endsWith("@etu.uae.ac.ma")
  ) {

    role = "PROF";

  } else {

    role = "PRO";

  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,

      // Create related profile automatically
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