import { z } from "zod";

export const registerSchema = z.object({
  email: z.email("Invalid email format"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  role: z.enum([
    "STUDENT",
    "PROF",
    "PRO",
  ]),
});

export const loginSchema = z.object({
  email: z.email("invalid email format"),
  password: z.string().min(1,"password is required"),
});