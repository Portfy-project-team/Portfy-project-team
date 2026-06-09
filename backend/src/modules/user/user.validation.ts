import { z } from "zod";

// CORRECTION 1 : avatarUrl retiré des schémas de mise à jour de profil
// L'avatar ne doit pas être modifiable via PUT /me/profile
// Il a sa propre route dédiée POST /avatar avec le middleware multer
// Laisser avatarUrl dans ces schémas permet à un utilisateur de pointer
// son avatar vers n'importe quelle URL externe sans passer par l'upload

// CORRECTION 2 : .strict() sur tous les schémas — anti-mass assignment

// CORRECTION 3 : limites max() sur tous les champs texte

// CORRECTION 4 : changePasswordSchema — newPassword aligné avec la politique
// du projet (min 12 + complexité) au lieu de min 8 sans règle

export const updateStudentSchema = z.object({
  nom:           z.string().trim().max(80).optional(),
  prenom:        z.string().trim().max(80).optional(),
  filiere:       z.string().trim().max(150).optional(),
  bio:           z.string().trim().max(500).optional(),
  formationType: z.string().trim().max(100).optional(),
  niveau:        z.string().trim().max(100).optional(),
  anneeEntree:   z.coerce.number().int().optional(),
  diplomePrevu:  z.coerce.number().int().optional(),
  disponibilite: z.string().trim().max(150).optional(),
  linkedin:      z.string().url().optional().or(z.literal("")),
  etablissement: z.string().trim().max(150).optional(),
  skillsTexte:   z.string().trim().max(1000).optional(),
  // avatarUrl retiré — géré exclusivement via POST /avatar
  skills: z
    .array(
      z.object({
        skillId: z.number().int().positive(),
        niveau:  z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE", "EXPERT"]).optional(),
      })
    )
    .max(20)
    .optional(),
}).strict();

export const updateProfSchema = z.object({
  nom:           z.string().trim().max(80).optional(),
  prenom:        z.string().trim().max(80).optional(),
  departement:   z.string().trim().max(150).optional(),
  specialite:    z.string().trim().max(150).optional(),
  bio:           z.string().trim().max(500).optional(),
  linkedin:      z.string().url().optional().or(z.literal("")),
  etablissement: z.string().trim().max(150).optional(),
  // avatarUrl retiré
}).strict();

export const updateProfessionnelSchema = z.object({
  nom:                   z.string().trim().max(80).optional(),
  prenom:                z.string().trim().max(80).optional(),
  entreprise:            z.string().trim().max(150).optional(),
  poste:                 z.string().trim().max(150).optional(),
  secteur:               z.string().trim().max(150).optional(),
  localisation:          z.string().trim().max(150).optional(),
  descriptionEntreprise: z.string().trim().max(1000).optional(),
  siteEntreprise:        z.string().url().optional().or(z.literal("")),
  // avatarUrl retiré
}).strict();

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Le mot de passe actuel est requis")
    .max(72),
  newPassword: z
    .string()
    .min(12, "Le mot de passe doit contenir au moins 12 caractères")
    .max(72)
    .regex(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
      "Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial"
    ),
}).strict();

export type ChangePasswordInput       = z.infer<typeof changePasswordSchema>;
export type UpdateStudentInput        = z.infer<typeof updateStudentSchema>;
export type UpdateProfInput           = z.infer<typeof updateProfSchema>;
export type UpdateProfessionnelInput  = z.infer<typeof updateProfessionnelSchema>;