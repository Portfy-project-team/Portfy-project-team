import { prisma } from "../../utils/prisma.js";
import { UpdatePortfolioSettingsInput } from "./portfolio.validation.js";

const SAFE_USER_SELECT = {
  id:   true,
  role: true,
} as const;

const computeScoreCredibilite = async (studentId: number): Promise<number> => {
  const student = await prisma.student.findUnique({
    where:   { id: studentId },
    include: {
      portfolio: {
        include: {
          projets: { where: { statusV: "VALIDATED" } },
        },
      },
      Stage:        { where: { statutV: "VALIDATED" } },
      LettreStudent: {
        include: {
          LettreRecommandation: {
            select: { visibilite: true },
          },
        },
      },
      skills: true,
    },
  });

  if (!student) return 0;

  let score = 0;

  const nbProjets = student.portfolio?.projets.length ?? 0;
  score += Math.min(nbProjets * 20, 40);

  const nbStages = student.Stage.length;
  score += Math.min(nbStages * 25, 25);

  const nbLettresPubliques = student.LettreStudent
    .map((ls) => ls.LettreRecommandation)
    .filter((l) => l !== null && ["PUBLIC", "DOWNLOADABLE"].includes(l.visibilite))
    .length;
  score += Math.min(nbLettresPubliques * 10, 20);

  const nbSkills = student.skills.length;
  score += Math.min(nbSkills, 10);

  if (student.bio && student.bio.trim().length > 0) {
    score += 5;
  }

  return Math.min(score, 100);
};

export const PortfolioService = {

  // ── GET /api/portfolio/me ─────────────────────────────────────────
  async getMyPortfolio(userId: number) {
    const student = await prisma.student.findUnique({
      where:   { userId },
      include: {
        user:             { select: SAFE_USER_SELECT },
        skills:           { include: { skill: true } },
        StudentFormation: { include: { Formation: true } },
        StudentActivite:  { include: { ActiviteParascolaire: true } },
        Stage:            { orderBy: { dateDebut: "desc" } },
        LettreStudent: {
          include: {
            LettreRecommandation: {
              include: {
                Prof: {
                  select: {
                    id:          true,
                    nom:         true,
                    prenom:      true,
                    departement: true,
                    specialite:  true,
                  },
                },
              },
            },
          },
        },
        portfolio: {
          include: {
            projets: {
              include: { skills: { include: { skill: true } } },
              orderBy: { id: "desc" },
            },
            skills: { include: { skill: true } },
          },
        },
      },
    });

    if (!student) return null;

    const lettres = student.LettreStudent.map((ls) => ({
      id:         ls.LettreRecommandation.id,
      type:       ls.LettreRecommandation.type,
      contenu:    ls.LettreRecommandation.contenu,
      visibilite: ls.LettreRecommandation.visibilite,
      date:       ls.LettreRecommandation.date,
      prof:       ls.LettreRecommandation.Prof,
    }));

    const activites = student.StudentActivite
      .map((sa) => sa.ActiviteParascolaire)
      .filter((a): a is NonNullable<typeof a> =>
        a !== null && a.statutV === "VALIDATED"
      );

    const { LettreStudent, StudentActivite, ...rest } = student;

    return { ...rest, lettres, activites };
  },

  // ── GET /api/portfolio/public/:studentId ──────────────────────────
  async getPublicPortfolio(studentId: number) {
    const student = await prisma.student.findUnique({
      where:   { id: studentId },
      include: {
        skills:           { include: { skill: true } },
        StudentFormation: { include: { Formation: true } },
        Stage:            true,
        LettreStudent: {
          include: {
            LettreRecommandation: {
              include: {
                Prof: {
                  select: {
                    id:          true,
                    nom:         true,
                    prenom:      true,
                    departement: true,
                    specialite:  true,
                  },
                },
              },
            },
          },
        },
        portfolio: {
          include: {
            projets: {
              include: {
                skills: { include: { skill: true } },
                Prof:   { select: { id: true, nom: true, prenom: true } },
              },
              orderBy: { id: "desc" },
            },
            skills: { include: { skill: true } },
          },
        },
      },
    });

    if (!student)            return null;
    if (!student.portfolio)  return null;
    if (student.portfolio.visibilite === "PRIVATE") return { restricted: true };

    const projetsValides = student.portfolio.projets
      .filter((p) => p.statusV === "VALIDATED")
      .map((p) => ({
        id:             p.id,
        titre:          p.titre,
        description:    p.description,
        technologie:    p.technologie,
        githubLink:     p.githubLink,
        youtubeLink:    p.youtubeLink,
        resultats:      p.resultats,
        screenshots:    p.screenshots,
        noteProf:       p.noteProf,
        score:          p.score,
        dateSoumission: p.dateSoumission,
        type:           p.type,
        statusV:        p.statusV,
        skills:         p.skills,
        Prof:           p.Prof,
      }));

    const stagesValides = student.Stage
      .filter((s) => s.statutV === "VALIDATED")
      .map((s) => ({
        id:           s.id,
        entreprise:   s.entreprise,
        mission:      s.mission,
        technologies: s.technologies,
        dateDebut:    s.dateDebut,
        dateFin:      s.dateFin,
        duree:        s.duree,
        // Exclus : rapportUrl, rejectionReason, studentId, encadrantId, statutV
      }));

    const lettresPubliques = student.LettreStudent
      .map((ls) => ls.LettreRecommandation)
      .filter((l): l is NonNullable<typeof l> =>
        l !== null && ["PUBLIC", "DOWNLOADABLE"].includes(l.visibilite)
      )
      .map((l) => ({
        id:         l.id,
        type:       l.type,
        contenu:    l.contenu,
        visibilite: l.visibilite,
        date:       l.date,
        Prof:       l.Prof,
      }));

    const portfolioNettoye = {
      id:               student.portfolio.id,
      visibilite:       student.portfolio.visibilite,
      objective:        student.portfolio.objective,
      scoreCredibilite: student.portfolio.scoreCredibilite,
      skills:           student.portfolio.skills,
      projets:          projetsValides,
    };

    // CORRECTION : userId exclu de la réponse publique
    // La version oprecedente  retournait student.id (id Student, pas userId)
    // mais le spread ...rest dans getMyPortfolio pouvait exposer userId
    // Ici on construit la réponse champ par champ — aucune donnée sensible
    return {
      id:            student.id,
      nom:           student.nom,
      prenom:        student.prenom,
      filiere:       student.filiere,
      bio:           student.bio,
      skills:        student.skills,
      formations:    student.StudentFormation,
      stages:        stagesValides,
      lettres:       lettresPubliques,
      portfolio:     portfolioNettoye,
      // Exclus : userId, user relation, loginLogs, refreshTokens,
      //          passwordResetTokens, emailVerificationToken, googleId
    };
  },

  // ── PUT /api/portfolio/settings ───────────────────────────────────
  async updateSettings(userId: number, data: UpdatePortfolioSettingsInput) {
    const student = await prisma.student.findUnique({
      where:  { userId },
      select: { id: true },
    });

    if (!student) throw new Error("Student not found");

    const portfolio = await prisma.portfolio.upsert({
      where:  { studentId: student.id },
      create: { studentId: student.id, ...data },
      update: data,
    });

    const scoreCredibilite = await computeScoreCredibilite(student.id);

    return prisma.portfolio.update({
      where: { id: portfolio.id },
      data:  { scoreCredibilite },
      select: {
        id:               true,
        visibilite:       true,
        objective:        true,
        scoreCredibilite: true,
      },
    });
  },
};