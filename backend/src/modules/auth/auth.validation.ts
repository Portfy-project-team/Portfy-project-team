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

    // PROF et ADMIN exclus de l'inscription publique
    // PROF est cree uniquement par un Admin via route protegee
    role: z.enum(["STUDENT", "PRO"], {
      errorMap: () => ({
        message: "Role invalide. Valeurs acceptees : STUDENT, PRO",
      }),
    }),
  })
  .strict(); // Rejette tout champ non declare (anti-mass assignment)

export const loginSchema = z
  .object({
    email: z
      .string({ required_error: "L'email est requis" })
      .trim()
      .toLowerCase()
      .email("Format email invalide")
      .max(254),
    password: z
      .string({ required_error: "Le mot de passe est requis" })
      .min(1, "Le mot de passe est requis")
      .max(72),
  })
  .strict();

// refreshToken vient du cookie httpOnly — pas du body
// Ce schema sert uniquement si on lit depuis req.cookies
export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token requis"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput    = z.infer<typeof loginSchema>;
