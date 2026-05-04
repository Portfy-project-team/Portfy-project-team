import { z } from "zod";

export const registerSchema = z
  .object({
    email: z
      .string({ required_error: "L'email est requis" })
      .trim()
      .toLowerCase()
      .email("Format email invalide")
      .max(254, "Email trop long"),

    password: z
      .string({ required_error: "Le mot de passe est requis" })
      .min(12, "Le mot de passe doit contenir au moins 12 caractères")
      .max(72, "Le mot de passe ne peut pas dépasser 72 caractères")
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
        "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial"
      ),

    role: z.enum(["STUDENT", "PRO"], {
      errorMap: () => ({
        message: "Rôle invalide. Valeurs acceptées : STUDENT, PRO",
      }),
    }),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;