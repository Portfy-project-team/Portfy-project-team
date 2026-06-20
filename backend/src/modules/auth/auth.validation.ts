import { z } from "zod";

export const registerSchema = z
  .object({
    name:   z.string({ required_error: "Le nom est requis" }).trim().min(1, "Nom obligatoire"),
    prenom: z.string({ required_error: "Le prénom est requis" }).trim().min(1, "Prénom obligatoire"),
    email: z
      .string({ required_error: "L'email est requis" })
      .trim()
      .toLowerCase()
      .email("Format email invalide")
      .max(254, "Email trop long"),
    password: z
      .string({ required_error: "Le mot de passe est requis" })
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(72, "Le mot de passe ne peut pas dépasser 72 caractères")
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
        "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial"
      ),
    role: z.enum(["STUDENT", "PRO", "PROF"], {
      errorMap: () => ({
        message: "Role invalide. Valeurs acceptees : STUDENT, PRO, PROF",
      }),
    }),
    linkedin: z.string().trim().optional(),
    // ── STUDENT ──────────────────────────────────────────────────────
  formationType: z.string().trim().optional(),
  etablissement: z.string().trim().optional(),
  filiere:       z.string().trim().optional(),
  niveau:        z.string().trim().optional(),
  anneeEntree:   z.coerce.number().int().optional(),   // FormData envoie string → coerce
  diplomePrevu:  z.coerce.number().int().optional(),   // idem
  bio:           z.string().trim().optional(),
  skills:        z.array(z.string()).optional(),        // déjà parsé dans le controller
  disponibilite: z.string().trim().optional(),
  // ── PROF ─────────────────────────────────────────────────────────
  departement: z.string().trim().optional(),
  specialite:  z.string().trim().optional(),
  bioProf:     z.string().trim().optional(),

  // ── PRO ──────────────────────────────────────────────────────────
  entreprise:            z.string().trim().optional(),
  poste:                 z.string().trim().optional(),
  secteur:               z.string().trim().optional(),
  localisation:          z.string().trim().optional(),
  descriptionEntreprise: z.string().trim().optional(),
  siteEntreprise:        z.string().trim().optional(),
  })

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

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token requis"),
});

export const forgotPasswordSchema = z
  .object({
    email: z
      .string({ required_error: "L'email est requis" })
      .trim()
      .toLowerCase()
      .email("Format email invalide")
      .max(254),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z
      .string({ required_error: "Token requis" })
      .min(64, "Token invalide")
      .max(64, "Token invalide"),
    password: z
      .string({ required_error: "Le mot de passe est requis" })
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(72, "Le mot de passe ne peut pas dépasser 72 caractères")
      .regex(
        /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
        "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial"
      ),
  })
  .strict();

export type RegisterInput       = z.infer<typeof registerSchema>;
export type LoginInput          = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput  = z.infer<typeof resetPasswordSchema>;