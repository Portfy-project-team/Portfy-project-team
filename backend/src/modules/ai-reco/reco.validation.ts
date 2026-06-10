import { z } from 'zod'

const extraSchema = z.object({
  // Master / Doctorat
  university:          z.string().optional(),
  program:             z.string().optional(),
  researchMotivation:  z.string().optional(),

  // Double Diplomation
  partnerSchool:       z.string().optional(),
  country:             z.string().optional(),
  partnerContext:      z.string().optional(),

  // Stage
  company:             z.string().optional(),
  duration:            z.string().optional(),
  mission:             z.string().optional(),

  // Emploi
  position:            z.string().optional(),
  proSkills:           z.string().optional(),

  // Programme International
  programName:         z.string().optional(),
  region:              z.string().optional(),
  programObjective:    z.string().optional(),
}).default({})

export const generateLetterSchema = z.object({
  // Professeur
  profName:      z.string().min(2, 'Le nom du professeur est requis'),
  profEmail:     z.string().email('Email professionnel invalide'),
  department:    z.string().optional(),
  institution:   z.string().min(2, "L'institution est requise"),

  // Étudiant
  studentName:   z.string().min(2, "Le nom de l'étudiant est requis"),
  level:         z.string().optional(),

  // Objectif
  candidatureType: z.enum([
    'Master / Doctorat',
    'Double Diplomation',
    'Stage',
    'Emploi',
    'Programme International',
  ]),
  language: z.enum(['Français', 'Anglais', 'Arabe', 'Espagnol']).default('Français'),

  // Appréciation
  technicalQualities: z.string().min(5, 'Les qualités techniques sont requises'),
  softSkills:         z.string().optional(),
  mention: z.enum(['Très Bien', 'Bien', 'Assez Bien', 'Passable']).optional(),

  // Extra
  extra: extraSchema,
})

export type GenerateLetterInput = z.infer<typeof generateLetterSchema>