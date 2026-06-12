import {z} from "zod";
//creation d'un champ URL optionnel 
const optionalUrl = z
  .string()
  .trim()
  .max(500, "URL trop longue")
  .optional()
  .nullable()
  .or(z.literal(""));

  //creation d'un texte optionnel 
const optionalText = (max= 1000)=>
  z.string().trim().max(max , "Texte trop long").optional().nullable().or(z.literal(""));

//creation d'un  projet
//z.object pour creer un objet avec ces champs 
export const createProjectSchema = z.object({
  titre: z
  .string({required_error : "Le titre est requis"})
  .trim()
  .min(3 , "Le titre doit contenir au moins 3 caracteres")
  .max(150, "Le titre est trop long"),

  description: optionalText(3000),
  technologie: optionalText(500),
  githubLink: optionalUrl,
  youtubeLink: optionalUrl,
  screenshots: optionalText(1000),
  resultats: optionalText(2000),

  type: z
    .enum([
      "MODULE",
      "INTEGRATION",
      "HACKATHON",
      "PERSONNEL",
      "STAGE"
    ])
    .optional()
    .nullable(),

  profId: z.preprocess((val) => (val === "" ? null : val), z.number().int().positive().optional().nullable()),
  github: optionalUrl,
  demo: optionalUrl,
})

// .partial() cette methode transforme tous les champs en optionnels 
//modifier un projet 
export const updateProjectSchema = createProjectSchema.partial();

//ici on cree un shema pour une decision/professeur comme apreciation , note , evaluation de projet 
export const projectDecisionSchema = z
  .object({
    noteProf: z
      .string()
      .trim() //supprime les espaces inutiles 
      .min(3, "L'appréciation doit contenir au moins 3 caractères")
      .max(2000, "L'appréciation est trop longue")
      .optional()
      .nullable(),

    score: z
      .number()
      .min(0, "Le score doit être positif")
      .max(20, "Le score ne peut pas dépasser 20")
      .optional()
      .nullable(),
  })

//typeof prends le type de cette variable 
//z.infer<> deduis automatiquement le type typescript 
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectDecisionInput = z.infer<typeof projectDecisionSchema>;

  
