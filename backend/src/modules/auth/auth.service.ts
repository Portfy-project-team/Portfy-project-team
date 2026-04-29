import bcrypt from "bcryptjs";
import {prisma} from "../../utils/prisma.js";
type RegisterData = {
  email: string;
  password: string;
  role: "STUDENT" | "PROF" | "PRO" | "ADMIN";
};

export const registerUser = async ({
  email,
  password,
  role,
}: RegisterData) => {

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role,
    },
  });

  // Return safe user data
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
};