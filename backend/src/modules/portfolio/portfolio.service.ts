import { prisma } from "../../utils/prisma.js";
import { UpdatePortfolioSettingsInput } from "./portfolio.validation.js";

const SAFE_USER_SELECT = {
  id:   true,
  role: true,
} as const;

// ── Calcul du scoreCredibilite ────────────────────────────────────
// Appelé à chaque updateSettings pour refléter l'état actuel du portfolio
const computeScoreCredibilite = async (studentId: number): Promise<number> => {
  const student = await prisma.student.findUnique({
    where:   { id: studentId },
    include: {
      portfolio: {
        include: {
          projets: { where: { statusV: "VALIDATED" } },
        },
      },
      Stage: { where: { statutV: "VALIDATED" } },
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

  // Projets VALIDATED : +20 pts chacun, max 40
  const nbProjets = student.portfolio?.projets.length ?? 0;
  score += Math.min(nbProjets * 20, 40);

  // Stages VALIDATED : +25 pts chacun, max 25
  const nbStages = student.Stage.length;
  score += Math.min(nbStages * 25, 25);

  // Lettres PUBLIC ou DOWNLOADABLE : +10 pts chacune, max 20
  const nbLettresPubliques = student.LettreStudent
    .map((ls) => ls.LettreRecommandation)
    .filter((l) => l !== null && ["PUBLIC", "DOWNLOADABLE"].includes(l.visibilite))
    .length;
  score += Math.min(nbLettresPubliques * 10, 20);

  // Compétences : +1 pt chacune, max 10
  const nbSkills = student.skills.length;
  score += Math.min(nbSkills, 10);

  // Bio remplie : +5 pts
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

    if (!student) return null;
    if (!student.portfolio) return null;
    if (student.portfolio.visibilite === "PRIVATE") return { restricted: true };

    // Filtrage JS — robuste quelle que soit la version Prisma
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

    return {
      id:            student.id,
      nom:           student.nom,
      prenom:        student.prenom,
      filiere:       student.filiere,
      bio:           student.bio,
      linkedin:      student.linkedin,
      etablissement: student.etablissement,
      disponibilite: student.disponibilite,
      niveau:        student.niveau,
      formationType: student.formationType,
      anneeEntree:   student.anneeEntree,
      diplomePrevu:  student.diplomePrevu,
      skills:        student.skills,
      formations:    student.StudentFormation,
      stages:        stagesValides,
      lettres:       lettresPubliques,
      portfolio:     portfolioNettoye,
    };
  },

  // ── PUT /api/portfolio/settings ───────────────────────────────────
  // Met à jour les settings ET recalcule scoreCredibilite automatiquement
  async updateSettings(userId: number, data: UpdatePortfolioSettingsInput) {
    const student = await prisma.student.findUnique({
      where:  { userId },
      select: { id: true },
    });

    if (!student) throw new Error("Student not found");

    // 1. Upsert le portfolio avec les nouvelles données
    const portfolio = await prisma.portfolio.upsert({
      where:  { studentId: student.id },
      create: { studentId: student.id, ...data },
      update: data,
    });

    // 2. Calculer le nouveau scoreCredibilite basé sur l'état actuel
    const scoreCredibilite = await computeScoreCredibilite(student.id);

    // 3. Persister le score calculé
    return prisma.portfolio.update({
      where: { id: portfolio.id },
      data:  { scoreCredibilite },
    });
  },
};

// import { prisma } from "../../utils/prisma.js";
// import { UpdatePortfolioSettingsInput } from "./portfolio.validation.js";

// // Jamais retourné côté public
// const SAFE_USER_SELECT = {
//   id:   true,
//   role: true,
// } as const;

// export const PortfolioService = {

//   // ── GET /api/portfolio/me ─────────────────────────────────────────
//   async getMyPortfolio(userId: number) {
//     const student = await prisma.student.findUnique({
//       where:   { userId },
//       include: {
//         user:             { select: SAFE_USER_SELECT },
//         skills:           { include: { skill: true } },
//         StudentFormation: { include: { Formation: true } },
//         StudentActivite:  { include: { ActiviteParascolaire: true } },
//         Stage:            { orderBy: { dateDebut: "desc" } },
//         LettreStudent: {
//           include: {
//             LettreRecommandation: {
//               include: {
//                 Prof: {
//                   select: {
//                     id:          true,
//                     nom:         true,
//                     prenom:      true,
//                     departement: true,
//                     specialite:  true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//         portfolio: {
//           include: {
//             projets: {
//               include: { skills: { include: { skill: true } } },
//               orderBy: { id: "desc" },
//             },
//             skills: { include: { skill: true } },
//           },
//         },
//       },
//     });

//     if (!student) return null;

//     // Toutes les lettres pour /me (toutes visibilités)
//     const lettres = student.LettreStudent.map((ls) => ({
//       id:         ls.LettreRecommandation.id,
//       type:       ls.LettreRecommandation.type,
//       contenu:    ls.LettreRecommandation.contenu,
//       visibilite: ls.LettreRecommandation.visibilite,
//       date:       ls.LettreRecommandation.date,
//       prof:       ls.LettreRecommandation.Prof,
//     }));

//     // Filtrage JS — Prisma ne supporte pas `where` dans `include` pour cette relation
//     const activites = student.StudentActivite
//       .map((sa) => sa.ActiviteParascolaire)
//       .filter((a): a is NonNullable<typeof a> =>
//         a !== null && a.statutV === "VALIDATED"
//       );

//     const { LettreStudent, StudentActivite, ...rest } = student;

//     return { ...rest, lettres, activites };
//   },

//   // ── GET /api/portfolio/public/:studentId ──────────────────────────
//   async getPublicPortfolio(studentId: number) {
//     // On récupère TOUT sans filtre Prisma sur les relations imbriquées
//     // car Prisma ne supporte pas `where` dans `include` pour les relations
//     // indirectes (LettreStudent → LettreRecommandation) → crash 500
//     // Le filtrage se fait entièrement en JavaScript ci-dessous
//     const student = await prisma.student.findUnique({
//       where:   { id: studentId },
//       include: {
//         skills:           { include: { skill: true } },
//         StudentFormation: { include: { Formation: true } },
//         Stage:            true,   // filtrage JS ci-dessous
//         LettreStudent: {
//           include: {
//             LettreRecommandation: {
//               include: {
//                 Prof: {
//                   select: {
//                     id:          true,
//                     nom:         true,
//                     prenom:      true,
//                     departement: true,
//                     specialite:  true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//         portfolio: {
//           include: {
//             projets: {
//               include: {
//                 skills: { include: { skill: true } },
//                 Prof:   { select: { id: true, nom: true, prenom: true } },
//               },
//               orderBy: { id: "desc" },
//             },
//             skills: { include: { skill: true } },
//           },
//         },
//       },
//     });

//     if (!student) return null;
//     if (!student.portfolio) return null;
//     if (student.portfolio.visibilite === "PRIVATE") return { restricted: true };

//     // ── Filtrage JS — sécurité maximale ───────────────────────────────

//     // Projets : uniquement VALIDATED
//     const projetsValides = student.portfolio.projets
//       .filter((p) => p.statusV === "VALIDATED")
//       .map((p) => ({
//         id:             p.id,
//         titre:          p.titre,
//         description:    p.description,
//         technologie:    p.technologie,
//         githubLink:     p.githubLink,
//         youtubeLink:    p.youtubeLink,
//         resultats:      p.resultats,
//         screenshots:    p.screenshots,
//         noteProf:       p.noteProf,
//         score:          p.score,
//         dateSoumission: p.dateSoumission,
//         type:           p.type,
//         statusV:        p.statusV,
//         skills:         p.skills,
//         Prof:           p.Prof,
//         // Exclus : portfolioId (interne)
//       }));

//     // Stages : uniquement VALIDATED, champs sensibles exclus
//     const stagesValides = student.Stage
//       .filter((s) => s.statutV === "VALIDATED")
//       .map((s) => ({
//         id:           s.id,
//         entreprise:   s.entreprise,
//         mission:      s.mission,
//         technologies: s.technologies,
//         dateDebut:    s.dateDebut,
//         dateFin:      s.dateFin,
//         duree:        s.duree,
//         // Exclus : rapportUrl, rejectionReason, studentId, encadrantId, statutV
//       }));

//     // Lettres : uniquement PUBLIC ou DOWNLOADABLE
//     const lettresPubliques = student.LettreStudent
//       .map((ls) => ls.LettreRecommandation)
//       .filter((l): l is NonNullable<typeof l> =>
//         l !== null && ["PUBLIC", "DOWNLOADABLE"].includes(l.visibilite)
//       )
//       .map((l) => ({
//         id:         l.id,
//         type:       l.type,
//         contenu:    l.contenu,
//         visibilite: l.visibilite,
//         date:       l.date,
//         Prof:       l.Prof,
//       }));

//     // Portfolio nettoyé
//     const portfolioNettoye = {
//       id:              student.portfolio.id,
//       visibilite:      student.portfolio.visibilite,
//       objective:       student.portfolio.objective,
//       scoreCredibilite: student.portfolio.scoreCredibilite,
//       skills:          student.portfolio.skills,
//       projets:         projetsValides,
//       // Exclus : studentId (interne), dateCr (interne)
//     };

//     // Réponse finale — aucune donnée sensible
//     return {
//       id:            student.id,
//       nom:           student.nom,
//       prenom:        student.prenom,
//       filiere:       student.filiere,
//       bio:           student.bio,
//       linkedin:      student.linkedin,
//       etablissement: student.etablissement,
//       disponibilite: student.disponibilite,
//       niveau:        student.niveau,
//       formationType: student.formationType,
//       anneeEntree:   student.anneeEntree,
//       diplomePrevu:  student.diplomePrevu,
//       // Relations filtrées
//       skills:     student.skills,
//       formations: student.StudentFormation,
//       stages:     stagesValides,
//       lettres:    lettresPubliques,
//       portfolio:  portfolioNettoye,
//       // Exclus explicitement : userId, skillsTexte, user, LettreStudent raw,
//       //                        StudentFormation raw, Stage raw
//     };
//   },

//   // ── PUT /api/portfolio/settings ───────────────────────────────────
//   async updateSettings(userId: number, data: UpdatePortfolioSettingsInput) {
//     const student = await prisma.student.findUnique({
//       where:  { userId },
//       select: { id: true },
//     });

//     if (!student) throw new Error("Student not found");

//     return prisma.portfolio.upsert({
//       where:  { studentId: student.id },
//       create: { studentId: student.id, ...data },
//       update: data,
//     });
//   },
// };




















// // import { prisma } from "../../utils/prisma.js";
// // import { UpdatePortfolioSettingsInput } from "./portfolio.validation.js";

// // // ── Champs User à ne JAMAIS retourner ──────────────────────────────
// // const SAFE_USER_SELECT = {
// //   id:   true,
// //   role: true,
// //   // Exclus : email, password, emailVerificationToken, emailVerificationExpires,
// //   //          isEmailVerified, createdAt, updatedAt, googleId, avatarUrl, status
// // } as const;

// // export const PortfolioService = {

// //   // ── GET /api/portfolio/me ─────────────────────────────────────────
// //   async getMyPortfolio(userId: number) {
// //     const student = await prisma.student.findUnique({
// //       where:   { userId },
// //       include: {
// //         user: { select: SAFE_USER_SELECT },
// //         skills: { include: { skill: true } },
// //         StudentFormation: { include: { Formation: true } },
// //         StudentActivite: {
// //           include: { ActiviteParascolaire: true },
// //         },
// //         Stage: {
// //           orderBy: { dateDebut: "desc" },
// //         },
// //         LettreStudent: {
// //           include: {
// //             LettreRecommandation: {
// //               include: {
// //                 Prof: {
// //                   select: {
// //                     id:          true,
// //                     nom:         true,
// //                     prenom:      true,
// //                     departement: true,
// //                     specialite:  true,
// //                   },
// //                 },
// //               },
// //             },
// //           },
// //         },
// //         portfolio: {
// //           include: {
// //             projets: {
// //               include: { skills: { include: { skill: true } } },
// //               orderBy: { id: "desc" },
// //             },
// //             skills: { include: { skill: true } },
// //           },
// //         },
// //       },
// //     });

// //     if (!student) return null;

// //     // Toutes les lettres pour /me (toutes visibilités)
// //     const lettres = student.LettreStudent.map((ls) => ({
// //       id:         ls.LettreRecommandation.id,
// //       type:       ls.LettreRecommandation.type,
// //       contenu:    ls.LettreRecommandation.contenu,
// //       visibilite: ls.LettreRecommandation.visibilite,
// //       date:       ls.LettreRecommandation.date,
// //       prof:       ls.LettreRecommandation.Prof,
// //     }));

// //     // Activités validées seulement
// //     const activites = student.StudentActivite
// //       .map((sa) => sa.ActiviteParascolaire)
// //       .filter((a) => a !== null && a.statutV === "VALIDATED");

// //     const { LettreStudent, StudentActivite, ...rest } = student;

// //     return {
// //       ...rest,
// //       lettres,
// //       activites,
// //     };
// //   },

// //   // ── GET /api/portfolio/public/:studentId ──────────────────────────
// //   async getPublicPortfolio(studentId: number) {
// //     const student = await prisma.student.findUnique({
// //       where:   { id: studentId },
// //       include: {
// //         skills: { include: { skill: true } },
// //         StudentFormation: { include: { Formation: true } },
// //         Stage: {
// //           where:   { statutV: "VALIDATED" },
// //           select: {
// //             id:           true,
// //             entreprise:   true,
// //             mission:      true,
// //             technologies: true,
// //             dateDebut:    true,
// //             dateFin:      true,
// //             duree:        true,
// //             // Exclus : rapportUrl, rejectionReason, studentId, encadrantId, statutV
// //           },
// //         },
// //         LettreStudent: {
// //           include: {
// //             LettreRecommandation: {
// //               where: {
// //                 visibilite: { in: ["PUBLIC", "DOWNLOADABLE"] },
// //               },
// //               select: {
// //                 id:         true,
// //                 type:       true,
// //                 contenu:    true,
// //                 visibilite: true,
// //                 date:       true,
// //                 Prof: {
// //                   select: {
// //                     id:          true,
// //                     nom:         true,
// //                     prenom:      true,
// //                     departement: true,
// //                     specialite:  true,
// //                   },
// //                 },
// //               },
// //             },
// //           },
// //         },
// //         portfolio: {
// //           include: {
// //             projets: {
// //               where: { statusV: "VALIDATED" },
// //               select: {
// //                 id:            true,
// //                 titre:         true,
// //                 description:   true,
// //                 technologie:   true,
// //                 githubLink:    true,
// //                 youtubeLink:   true,
// //                 resultats:     true,
// //                 screenshots:   true,
// //                 noteProf:      true,
// //                 score:         true,
// //                 dateSoumission:true,
// //                 type:          true,
// //                 statusV:       true,
// //                 skills: { include: { skill: true } },
// //                 Prof: {
// //                   select: { id: true, nom: true, prenom: true },
// //                 },
// //               },
// //               orderBy: { id: "desc" },
// //             },
// //             skills: { include: { skill: true } },
// //           },
// //         },
// //       },
// //     });

// //     if (!student) return null;
// //     if (!student.portfolio) return null;

// //     if (student.portfolio.visibilite === "PRIVATE") {
// //       return { restricted: true };
// //     }

// //     // Filtrer les lettres nulles (relation Prisma peut retourner null si filtre where)
// //     const lettresPubliques = student.LettreStudent
// //       .map((ls) => ls.LettreRecommandation)
// //       .filter((l): l is NonNullable<typeof l> =>
// //         l !== null && ["PUBLIC", "DOWNLOADABLE"].includes(l.visibilite)
// //       );

// //     // Réponse nettoyée — aucune donnée sensible
// //     // Exclus explicitement : userId, skillsTexte, user relation,
// //     //                        passwordResetTokens, refreshTokens, loginLogs
// //     return {
// //       id:            student.id,
// //       nom:           student.nom,
// //       prenom:        student.prenom,
// //       filiere:       student.filiere,
// //       bio:           student.bio,
// //       linkedin:      student.linkedin,
// //       etablissement: student.etablissement,
// //       disponibilite: student.disponibilite,
// //       niveau:        student.niveau,
// //       formationType: student.formationType,
// //       anneeEntree:   student.anneeEntree,
// //       diplomePrevu:  student.diplomePrevu,
// //       skills:        student.skills,
// //       formations:    student.StudentFormation,
// //       stages:        student.Stage,
// //       lettres:       lettresPubliques,
// //       portfolio:     student.portfolio,
// //     };
// //   },

// //   // ── PUT /api/portfolio/settings ───────────────────────────────────
// //   async updateSettings(userId: number, data: UpdatePortfolioSettingsInput) {
// //     const student = await prisma.student.findUnique({
// //       where:  { userId },
// //       select: { id: true },
// //     });

// //     if (!student) throw new Error("Student not found");

// //     return prisma.portfolio.upsert({
// //       where:  { studentId: student.id },
// //       create: { studentId: student.id, ...data },
// //       update: data,
// //     });
// //   },
// // };
// // // // FIX ts(2304) : imports en haut du fichier (pas commentés en bas)
// // // import { prisma } from "../../utils/prisma.js";
// // // import { UpdatePortfolioSettingsInput } from "./portfolio.validation.js";
// // // import { StatutValidation, VisibiliteLettre } from "@prisma/client";
 
// // // // ── Champs User à ne JAMAIS retourner ──────────────────────────────
// // // const SAFE_USER_SELECT = {
// // //   id:    true,
// // //   email: true,
// // //   role:  true,
// // // } as const;
 
// // // // ── Types locaux pour résoudre ts(7006) ───────────────────────────
// // // // TypeScript en mode strict refuse les paramètres implicitement `any`
// // // // On déclare les types inline pour les callbacks .map() et .filter()
 
// // // type LettreStudentItem = {
// // //   LettreRecommandation: {
// // //     id:         number;
// // //     type:       string | null;
// // //     contenu:    string | null;
// // //     visibilite: VisibiliteLettre;
// // //     date:       Date;
// // //     Prof: {
// // //       id:          number;
// // //       nom:         string | null;
// // //       prenom:      string | null;
// // //       departement: string | null;
// // //       specialite:  string | null;
// // //     } | null;
// // //   };
// // // };
 
// // // type StudentActiviteItem = {
// // //   ActiviteParascolaire: {
// // //     id:           number;
// // //     nom:          string | null;
// // //     description:  string | null;
// // //     type:         string | null;
// // //     statutV:      StatutValidation;
// // //     attestationUrl: string | null;
// // //     adminId:      number | null;
// // //   } | null;
// // // };
 
// // // // ── Sélection pour /me ─────────────────────────────────────────────
// // // // FIX ts(2339) : suppression du `where` dans l'include ActiviteParascolaire
// // // // Prisma ne supporte pas `where` dans `include` pour les relations indirectes
// // // // → Le filtre statutV est appliqué côté JS dans getMyPortfolio()
// // // const MY_PORTFOLIO_INCLUDE = {
// // //   user: { select: SAFE_USER_SELECT },
// // //   skills: { include: { skill: true } },
// // //   StudentFormation: { include: { Formation: true } },
// // //   StudentActivite: {
// // //     include: {
// // //       ActiviteParascolaire: true, // ← `true` au lieu de `{ where: {...} }`
// // //     },
// // //   },
// // //   Stage: {
// // //     orderBy: { dateDebut: "desc" as const },
// // //   },
// // //   LettreStudent: {
// // //     include: {
// // //       LettreRecommandation: {
// // //         include: {
// // //           Prof: {
// // //             select: {
// // //               id:          true,
// // //               nom:         true,
// // //               prenom:      true,
// // //               departement: true,
// // //               specialite:  true,
// // //             },
// // //           },
// // //         },
// // //       },
// // //     },
// // //   },
// // //   portfolio: {
// // //     include: {
// // //       projets: {
// // //         include: { skills: { include: { skill: true } } },
// // //         orderBy: { id: "desc" as const },
// // //       },
// // //       skills: { include: { skill: true } },
// // //     },
// // //   },
// // // } as const;
 
// // // // ── Sélection pour /public/:studentId ─────────────────────────────
// // // const PUBLIC_PORTFOLIO_INCLUDE = {
// // //   skills: { include: { skill: true } },
// // //   StudentFormation: { include: { Formation: true } },
// // //   Stage: {
// // //     where: { statutV: "VALIDATED" as const },
// // //     select: {
// // //       id:           true,
// // //       entreprise:   true,
// // //       mission:      true,
// // //       technologies: true,
// // //       dateDebut:    true,
// // //       dateFin:      true,
// // //       duree:        true,
// // //     },
// // //   },
// // //   LettreStudent: {
// // //     include: {
// // //       LettreRecommandation: {
// // //         where: {
// // //           visibilite: { in: ["PUBLIC", "DOWNLOADABLE"] as const },
// // //         },
// // //         select: {
// // //           id:         true,
// // //           type:       true,
// // //           contenu:    true,
// // //           visibilite: true,
// // //           date:       true,
// // //           Prof: {
// // //             select: {
// // //               id:          true,
// // //               nom:         true,
// // //               prenom:      true,
// // //               departement: true,
// // //               specialite:  true,
// // //             },
// // //           },
// // //         },
// // //       },
// // //     },
// // //   },
// // //   portfolio: {
// // //     include: {
// // //       projets: {
// // //         where: { statusV: "VALIDATED" as const },
// // //         select: {
// // //           id:             true,
// // //           titre:          true,
// // //           description:    true,
// // //           technologie:    true,
// // //           githubLink:     true,
// // //           youtubeLink:    true,
// // //           resultats:      true,
// // //           screenshots:    true,
// // //           noteProf:       true,
// // //           score:          true,
// // //           dateSoumission: true,
// // //           type:           true,
// // //           statusV:        true,
// // //           skills: { include: { skill: true } },
// // //           Prof: {
// // //             select: { id: true, nom: true, prenom: true },
// // //           },
// // //         },
// // //         orderBy: { id: "desc" as const },
// // //       },
// // //       skills: { include: { skill: true } },
// // //     },
// // //   },
// // // } as const;
 
// // // export const PortfolioService = {
 
// // //   // ── GET /api/portfolio/me ──────────────────────────────────────
// // //   async getMyPortfolio(userId: number) {
// // //     const student = await prisma.student.findUnique({
// // //       where:   { userId },
// // //       include: MY_PORTFOLIO_INCLUDE,
// // //     });
 
// // //     if (!student) return null;
 
// // //     // FIX ts(7006) : type explicite sur le paramètre `ls`
// // //     const lettres = student.LettreStudent
// // //       .map((ls: LettreStudentItem) => ({
// // //         id:         ls.LettreRecommandation.id,
// // //         type:       ls.LettreRecommandation.type,
// // //         contenu:    ls.LettreRecommandation.contenu,
// // //         visibilite: ls.LettreRecommandation.visibilite,
// // //         date:       ls.LettreRecommandation.date,
// // //         prof:       ls.LettreRecommandation.Prof,
// // //       }));
 
// // //     // FIX ts(7006) : type explicite sur le paramètre `sa`
// // //     // FIX ts(2339) : filtre statutV appliqué ici en JS (plus dans l'include)
// // //     const activites = student.StudentActivite
// // //       .filter((sa: StudentActiviteItem) =>
// // //         sa.ActiviteParascolaire !== null &&
// // //         sa.ActiviteParascolaire.statutV === "VALIDATED"
// // //       )
// // //       .map((sa: StudentActiviteItem) => sa.ActiviteParascolaire);
 
// // //     const { LettreStudent, StudentActivite, ...rest } = student;
 
// // //     return {
// // //       ...rest,
// // //       lettres,
// // //       activites,
// // //     };
// // //   },
 
// // //   // ── GET /api/portfolio/public/:studentId ───────────────────────
// // //   async getPublicPortfolio(studentId: number) {
// // //     const student = await prisma.student.findUnique({
// // //       where:   { id: studentId },
// // //       include: PUBLIC_PORTFOLIO_INCLUDE,
// // //     });
 
// // //     if (!student) return null;
// // //     if (!student.portfolio) return null;
 
// // //     if (student.portfolio.visibilite === "PRIVATE") {
// // //       return { restricted: true };
// // //     }
 
// // //     // FIX ts(7006) : type explicite sur le paramètre `l`
// // //     const lettresPubliques = student.LettreStudent
// // //       .map((ls: { LettreRecommandation: { id: number; type: string | null; contenu: string | null; visibilite: VisibiliteLettre; date: Date; Prof: { id: number; nom: string | null; prenom: string | null; departement: string | null; specialite: string | null } | null } | null }) =>
// // //         ls.LettreRecommandation
// // //       )
// // //       .filter((l: { id: number; visibilite: VisibiliteLettre } | null) =>
// // //         l !== null && ["PUBLIC", "DOWNLOADABLE"].includes(l.visibilite)
// // //       );
 
// // //     const { LettreStudent, ...studentSansLettres } = student;
 
// // //     return {
// // //       id:            student.id,
// // //       nom:           student.nom,
// // //       prenom:        student.prenom,
// // //       filiere:       student.filiere,
// // //       bio:           student.bio,
// // //       linkedin:      student.linkedin,
// // //       etablissement: student.etablissement,
// // //       disponibilite: student.disponibilite,
// // //       niveau:        student.niveau,
// // //       formationType: student.formationType,
// // //       anneeEntree:   student.anneeEntree,
// // //       diplomePrevu:  student.diplomePrevu,
// // //       skills:        student.skills,
// // //       formations:    student.StudentFormation,
// // //       stages:        student.Stage,
// // //       lettres:       lettresPubliques,
// // //       portfolio:     student.portfolio,
// // //     };
// // //   },
 
// // //   // ── PUT /api/portfolio/settings ────────────────────────────────
// // //   async updateSettings(userId: number, data: UpdatePortfolioSettingsInput) {
// // //     const student = await prisma.student.findUnique({
// // //       where:  { userId },
// // //       select: { id: true },
// // //     });
 
// // //     if (!student) throw new Error("Student not found");
 
// // //     return prisma.portfolio.upsert({
// // //       where:  { studentId: student.id },
// // //       create: { studentId: student.id, ...data },
// // //       update: data,
// // //     });
// // //   },
// // // };
// // // // ── Champs User à ne JAMAIS retourner ──────────────────────────────
// // // // Appliqué partout (me + public)
// // // const SAFE_USER_SELECT = {
// // //   id:    true,
// // //   email: true,
// // //   role:  true,
// // //   // Exclus : password, emailVerificationToken, emailVerificationExpires,
// // //   //          isEmailVerified, createdAt, updatedAt, googleId, avatarUrl, status
// // // } as const;
 
// // // // ── Sélection du profil étudiant pour /me ──────────────────────────
// // // // CORRECTION : suppression du `where` dans l'include ActiviteParascolaire
// // // // Prisma ne supporte pas `where` dans `include` pour cette relation
// // // // → Le filtre statutV est appliqué côté JavaScript dans getMyPortfolio()
// // // const MY_PORTFOLIO_INCLUDE = {
// // //   user: { select: SAFE_USER_SELECT },
// // //   skills: { include: { skill: true } },
// // //   StudentFormation: { include: { Formation: true } },
// // //   StudentActivite: {
// // //     include: {
// // //       // CORRECTION : `true` au lieu de `{ where: { statutV: "VALIDATED" } }`
// // //       // Le filtre se fait en JS dans getMyPortfolio() ci-dessous
// // //       ActiviteParascolaire: true,
// // //     },
// // //   },
// // //   Stage: {
// // //     orderBy: { dateDebut: "desc" as const },
// // //   },
// // //   LettreStudent: {
// // //     include: {
// // //       LettreRecommandation: {
// // //         include: {
// // //           Prof: {
// // //             select: {
// // //               id:          true,
// // //               nom:         true,
// // //               prenom:      true,
// // //               departement: true,
// // //               specialite:  true,
// // //             },
// // //           },
// // //         },
// // //       },
// // //     },
// // //   },
// // //   portfolio: {
// // //     include: {
// // //       projets: {
// // //         include: { skills: { include: { skill: true } } },
// // //         orderBy: { id: "desc" as const },
// // //       },
// // //       skills: { include: { skill: true } },
// // //     },
// // //   },
// // // } as const;
 
// // // // ── Sélection du profil étudiant pour /public/:studentId ──────────
// // // // Données filtrées — uniquement ce qui est validé/public
// // // const PUBLIC_PORTFOLIO_INCLUDE = {
// // //   // Profil de base — pas d'email ni données sensibles
// // //   // (on expose nom, prenom, filiere, bio, linkedin, etablissement)
// // //   skills: { include: { skill: true } },
// // //   StudentFormation: { include: { Formation: true } },
// // //   Stage: {
// // //     where: { statutV: "VALIDATED" as const },
// // //     select: {
// // //       id:           true,
// // //       entreprise:   true,
// // //       mission:      true,
// // //       technologies: true,
// // //       dateDebut:    true,
// // //       dateFin:      true,
// // //       duree:        true,
// // //       // Exclu : rapportUrl, rejectionReason, studentId, encadrantId, statutV
// // //     },
// // //   },
// // //   LettreStudent: {
// // //     include: {
// // //       LettreRecommandation: {
// // //         where: {
// // //           visibilite: { in: ["PUBLIC", "DOWNLOADABLE"] as const },
// // //         },
// // //         select: {
// // //           id:         true,
// // //           type:       true,
// // //           contenu:    true,
// // //           visibilite: true,
// // //           date:       true,
// // //           Prof: {
// // //             select: {
// // //               id:          true,
// // //               nom:         true,
// // //               prenom:      true,
// // //               departement: true,
// // //               specialite:  true,
// // //             },
// // //           },
// // //         },
// // //       },
// // //     },
// // //   },
// // //   portfolio: {
// // //     include: {
// // //       projets: {
// // //         where: { statusV: "VALIDATED" as const },
// // //         select: {
// // //           id:             true,
// // //           titre:          true,
// // //           description:    true,
// // //           technologie:    true,
// // //           githubLink:     true,
// // //           youtubeLink:    true,
// // //           resultats:      true,
// // //           screenshots:    true,
// // //           noteProf:       true,
// // //           score:          true,
// // //           dateSoumission: true,
// // //           type:           true,
// // //           statusV:        true,
// // //           skills: { include: { skill: true } },
// // //           Prof: {
// // //             select: { id: true, nom: true, prenom: true },
// // //           },
// // //         },
// // //         orderBy: { id: "desc" as const },
// // //       },
// // //       skills: { include: { skill: true } },
// // //     },
// // //   },
// // // } as const;
 
// // // export const PortfolioService = {
 
// // //   // ── GET /api/portfolio/me ─────────────────────────────────────────
// // //   // Retourne toutes les données de l'étudiant connecté
// // //   async getMyPortfolio(userId: number) {
// // //     const student = await prisma.student.findUnique({
// // //       where:   { userId },
// // //       include: MY_PORTFOLIO_INCLUDE,
// // //     });
 
// // //     if (!student) return null;
 
// // //     // Nettoyer les lettres : inclure toutes les visibilités pour /me
// // //     const lettres = student.LettreStudent
// // //       .map((ls) => ({
// // //         id:         ls.LettreRecommandation.id,
// // //         type:       ls.LettreRecommandation.type,
// // //         contenu:    ls.LettreRecommandation.contenu,
// // //         visibilite: ls.LettreRecommandation.visibilite,
// // //         date:       ls.LettreRecommandation.date,
// // //         prof:       ls.LettreRecommandation.Prof,
// // //       }));
 
// // //     // ✅ CORRECTION : filtre statutV côté JavaScript
// // //     // (car `where` dans `include` n'est pas supporté pour cette relation)
// // //     const activites = student.StudentActivite
// // //       .filter(
// // //         (sa) =>
// // //           sa.ActiviteParascolaire !== null &&
// // //           sa.ActiviteParascolaire.statutV === "VALIDATED"
// // //       )
// // //       .map((sa) => sa.ActiviteParascolaire);
 
// // //     const { LettreStudent, StudentActivite, ...rest } = student;
 
// // //     return {
// // //       ...rest,
// // //       lettres,
// // //       activites,
// // //     };
// // //   },
 
// // //   // ── GET /api/portfolio/public/:studentId ──────────────────────────
// // //   // Retourne uniquement les données publiques/validées
// // //   async getPublicPortfolio(studentId: number) {
// // //     const student = await prisma.student.findUnique({
// // //       where:   { id: studentId },
// // //       include: PUBLIC_PORTFOLIO_INCLUDE,
// // //     });
 
// // //     if (!student) return null;
 
// // //     if (!student.portfolio) return null;
 
// // //     if (student.portfolio.visibilite === "PRIVATE") {
// // //       return { restricted: true };
// // //     }
 
// // //     // Filtrer les lettres : garder uniquement PUBLIC ou DOWNLOADABLE
// // //     // (le filtre Prisma le fait déjà, mais on double-vérifie)
// // //     const lettresPubliques = student.LettreStudent
// // //       .map((ls) => ls.LettreRecommandation)
// // //       .filter(
// // //         (l) =>
// // //           l !== null && ["PUBLIC", "DOWNLOADABLE"].includes(l.visibilite)
// // //       );
 
// // //     // Construire la réponse nettoyée — aucune donnée sensible
// // //     const { LettreStudent, ...studentSansLettres } = student;
 
// // //     return {
// // //       // Profil de base
// // //       id:            student.id,
// // //       nom:           student.nom,
// // //       prenom:        student.prenom,
// // //       filiere:       student.filiere,
// // //       bio:           student.bio,
// // //       linkedin:      student.linkedin,
// // //       etablissement: student.etablissement,
// // //       disponibilite: student.disponibilite,
// // //       niveau:        student.niveau,
// // //       formationType: student.formationType,
// // //       anneeEntree:   student.anneeEntree,
// // //       diplomePrevu:  student.diplomePrevu,
// // //       // Relations filtrées
// // //       skills:    student.skills,
// // //       formations: student.StudentFormation,
// // //       stages:     student.Stage,
// // //       lettres:    lettresPubliques,
// // //       portfolio:  student.portfolio,
// // //       // Exclu : userId, skillsTexte (interne), LettreStudent raw
// // //     };
// // //   },
 
// // //   // ── PUT /api/portfolio/settings ───────────────────────────────────
// // //   async updateSettings(userId: number, data: UpdatePortfolioSettingsInput) {
// // //     const student = await prisma.student.findUnique({
// // //       where:  { userId },
// // //       select: { id: true },
// // //     });
 
// // //     if (!student) throw new Error("Student not found");
 
// // //     return prisma.portfolio.upsert({
// // //       where:  { studentId: student.id },
// // //       create: { studentId: student.id, ...data },
// // //       update: data,
// // //     });
// // //   },
// // // };

// // // import { prisma } from "../../utils/prisma.js";
// // // import { UpdatePortfolioSettingsInput } from "./portfolio.validation.js";
 
// // // // ── Champs User à ne JAMAIS retourner ──────────────────────────────
// // // // Appliqué partout (me + public)
// // // const SAFE_USER_SELECT = {
// // //   id:    true,
// // //   email: true,
// // //   role:  true,
// // //   // Exclus : password, emailVerificationToken, emailVerificationExpires,
// // //   //          isEmailVerified, createdAt, updatedAt, googleId, avatarUrl, status
// // // } as const;
 
// // // // ── Sélection du profil étudiant pour /me ──────────────────────────
// // // // Données complètes — l'étudiant peut voir toutes ses propres infos
// // // const MY_PORTFOLIO_INCLUDE = {
// // //   user: { select: SAFE_USER_SELECT },
// // //   skills: { include: { skill: true } },
// // //   StudentFormation: { include: { Formation: true } },
// // //   StudentActivite: {
// // //     include: {
// // //       ActiviteParascolaire: {
// // //         where: { statutV: "VALIDATED" as const },
// // //       },
// // //     },
// // //   },
// // //   Stage: {
// // //     orderBy: { dateDebut: "desc" as const },
// // //   },
// // //   LettreStudent: {
// // //     include: {
// // //       LettreRecommandation: {
// // //         include: {
// // //           Prof: {
// // //             select: {
// // //               id:          true,
// // //               nom:         true,
// // //               prenom:      true,
// // //               departement: true,
// // //               specialite:  true,
// // //             },
// // //           },
// // //         },
// // //       },
// // //     },
// // //   },
// // //   portfolio: {
// // //     include: {
// // //       projets: {
// // //         include: { skills: { include: { skill: true } } },
// // //         orderBy: { id: "desc" as const },
// // //       },
// // //       skills: { include: { skill: true } },
// // //     },
// // //   },
// // // } as const;
 
// // // // ── Sélection du profil étudiant pour /public/:studentId ──────────
// // // // Données filtrées — uniquement ce qui est validé/public
// // // const PUBLIC_PORTFOLIO_INCLUDE = {
// // //   // Profil de base — pas d'email ni données sensibles
// // //   // (on expose nom, prenom, filiere, bio, linkedin, etablissement)
// // //   skills: { include: { skill: true } },
// // //   StudentFormation: { include: { Formation: true } },
// // //   Stage: {
// // //     where: { statutV: "VALIDATED" as const },
// // //     select: {
// // //       id:          true,
// // //       entreprise:  true,
// // //       mission:     true,
// // //       technologies:true,
// // //       dateDebut:   true,
// // //       dateFin:     true,
// // //       duree:       true,
// // //       // Exclu : rapportUrl, rejectionReason, studentId, encadrantId, statutV
// // //     },
// // //   },
// // //   LettreStudent: {
// // //     include: {
// // //       LettreRecommandation: {
// // //         where: {
// // //           visibilite: { in: ["PUBLIC", "DOWNLOADABLE"] as const },
// // //         },
// // //         select: {
// // //           id:         true,
// // //           type:       true,
// // //           contenu:    true,
// // //           visibilite: true,
// // //           date:       true,
// // //           Prof: {
// // //             select: {
// // //               id:          true,
// // //               nom:         true,
// // //               prenom:      true,
// // //               departement: true,
// // //               specialite:  true,
// // //             },
// // //           },
// // //         },
// // //       },
// // //     },
// // //   },
// // //   portfolio: {
// // //     include: {
// // //       projets: {
// // //         where: { statusV: "VALIDATED" as const },
// // //         select: {
// // //           id:            true,
// // //           titre:         true,
// // //           description:   true,
// // //           technologie:   true,
// // //           githubLink:    true,
// // //           youtubeLink:   true,
// // //           resultats:     true,
// // //           screenshots:   true,
// // //           noteProf:      true,
// // //           score:         true,
// // //           dateSoumission:true,
// // //           type:          true,
// // //           statusV:       true,
// // //           skills: { include: { skill: true } },
// // //           Prof: {
// // //             select: { id: true, nom: true, prenom: true },
// // //           },
// // //         },
// // //         orderBy: { id: "desc" as const },
// // //       },
// // //       skills: { include: { skill: true } },
// // //     },
// // //   },
// // // } as const;
 
// // // export const PortfolioService = {
 
// // //   // ── GET /api/portfolio/me ─────────────────────────────────────────
// // //   // Retourne toutes les données de l'étudiant connecté
// // //   async getMyPortfolio(userId: number) {
// // //     const student = await prisma.student.findUnique({
// // //       where:   { userId },
// // //       include: MY_PORTFOLIO_INCLUDE,
// // //     });
 
// // //     if (!student) return null;
 
// // //     // Nettoyer les lettres : inclure toutes les visibilités pour /me
// // //     const lettres = student.LettreStudent
// // //       .map((ls) => ({
// // //         id:         ls.LettreRecommandation.id,
// // //         type:       ls.LettreRecommandation.type,
// // //         contenu:    ls.LettreRecommandation.contenu,
// // //         visibilite: ls.LettreRecommandation.visibilite,
// // //         date:       ls.LettreRecommandation.date,
// // //         prof:       ls.LettreRecommandation.Prof,
// // //       }));
 
// // //     // Activités validées seulement
// // //     const activites = student.StudentActivite
// // //       .filter((sa) => sa.ActiviteParascolaire !== null)
// // //       .map((sa) => sa.ActiviteParascolaire);
 
// // //     const { LettreStudent, StudentActivite, ...rest } = student;
 
// // //     return {
// // //       ...rest,
// // //       lettres,
// // //       activites,
// // //     };
// // //   },
 
// // //   // ── GET /api/portfolio/public/:studentId ──────────────────────────
// // //   // Retourne uniquement les données publiques/validées
// // //   async getPublicPortfolio(studentId: number) {
// // //     const student = await prisma.student.findUnique({
// // //       where:   { id: studentId },
// // //       include: PUBLIC_PORTFOLIO_INCLUDE,
// // //     });
 
// // //     if (!student) return null;
 
// // //     if (!student.portfolio) return null;
 
// // //     if (student.portfolio.visibilite === "PRIVATE") {
// // //       return { restricted: true };
// // //     }
 
// // //     // Filtrer les lettres : garder uniquement PUBLIC ou DOWNLOADABLE
// // //     // (le filtre Prisma le fait déjà, mais on double-vérifie)
// // //     const lettresPubliques = student.LettreStudent
// // //       .map((ls) => ls.LettreRecommandation)
// // //       .filter((l) => l !== null && ["PUBLIC", "DOWNLOADABLE"].includes(l.visibilite));
 
// // //     // Construire la réponse nettoyée — aucune donnée sensible
// // //     const { LettreStudent, ...studentSansLettres } = student;
 
// // //     return {
// // //       // Profil de base
// // //       id:            student.id,
// // //       nom:           student.nom,
// // //       prenom:        student.prenom,
// // //       filiere:       student.filiere,
// // //       bio:           student.bio,
// // //       linkedin:      student.linkedin,
// // //       etablissement: student.etablissement,
// // //       disponibilite: student.disponibilite,
// // //       niveau:        student.niveau,
// // //       formationType: student.formationType,
// // //       anneeEntree:   student.anneeEntree,
// // //       diplomePrevu:  student.diplomePrevu,
// // //       // Relations filtrées
// // //       skills:           student.skills,
// // //       formations:       student.StudentFormation,
// // //       stages:           student.Stage,
// // //       lettres:          lettresPubliques,
// // //       portfolio:        student.portfolio,
// // //       // Exclu : userId, skillsTexte (interne), LettreStudent raw
// // //     };
// // //   },
 
// // //   // ── PUT /api/portfolio/settings ───────────────────────────────────
// // //   async updateSettings(userId: number, data: UpdatePortfolioSettingsInput) {
// // //     const student = await prisma.student.findUnique({
// // //       where:  { userId },
// // //       select: { id: true },
// // //     });
 
// // //     if (!student) throw new Error("Student not found");
 
// // //     return prisma.portfolio.upsert({
// // //       where:  { studentId: student.id },
// // //       create: { studentId: student.id, ...data },
// // //       update: data,
// // //     });
// // //   },
// // // };
// // // import { prisma } from "../../utils/prisma.js";
// // // import { UpdatePortfolioSettingsInput } from "./portfolio.validation.js";

// // // export const PortfolioService = {

// // //   // GET /api/portfolio/me
// // //   async getMyPortfolio(userId: number) {
// // //     const student = await prisma.student.findUnique({
// // //       where: { userId },
// // //       include: {
// // //         skills: { include: { skill: true } },
// // //         StudentFormation: { include: { Formation: true } },
// // //         Stage: true,
// // //         portfolio: {
// // //           include: {
// // //             projets: true,
// // //           },
// // //         },
// // //       },
// // //     });
// // //     return student;
// // //   },

// // //   // GET /api/portfolio/public/:studentId
// // //   async getPublicPortfolio(studentId: number) {
// // //     const student = await prisma.student.findUnique({
// // //       where: { id: studentId },
// // //       include: {
// // //         skills: { include: { skill: true } },
// // //         StudentFormation: { include: { Formation: true } },
// // //         Stage: {
// // //           where: { statutV: "VALIDATED" },
// // //         },
// // //         portfolio: {
// // //           include: {
// // //             projets: {
// // //               where: { statusV: "VALIDATED" },
// // //             },
// // //           },
// // //         },
// // //       },
// // //     });

// // //     if (!student) return null;

// // //     if (!student.portfolio) return null;

// // //     if (student.portfolio.visibilite === "PRIVATE") {
// // //       return { restricted: true };
// // //     }

// // //     return student;
// // //   },

// // //   // PUT /api/portfolio/settings
// // //   async updateSettings(userId: number, data: UpdatePortfolioSettingsInput) {
// // //     const student = await prisma.student.findUnique({
// // //       where: { userId },
// // //       select: { id: true },
// // //     });

// // //     if (!student) throw new Error("Student not found");

// // //     // Upsert portfolio si pas encore créé
// // //     return prisma.portfolio.upsert({
// // //       where: { studentId: student.id },
// // //       create: {
// // //         studentId: student.id,
// // //         ...data,
// // //       },
// // //       update: data,
// // //     });
// // //   },
// // // };
// import { prisma } from "../../utils/prisma.js";
// import { UpdatePortfolioSettingsInput } from "./portfolio.validation.js";

// const SAFE_USER_SELECT = {
//   id:   true,
//   role: true,
// } as const;

// export const PortfolioService = {

//   async getMyPortfolio(userId: number) {
//     const student = await prisma.student.findUnique({
//       where:   { userId },
//       include: {
//         user:             { select: SAFE_USER_SELECT },
//         skills:           { include: { skill: true } },
//         StudentFormation: { include: { Formation: true } },
//         StudentActivite:  { include: { ActiviteParascolaire: true } },
//         Stage:            { orderBy: { dateDebut: "desc" } },
//         LettreStudent: {
//           include: {
//             LettreRecommandation: {
//               include: {
//                 Prof: {
//                   select: {
//                     id: true, nom: true, prenom: true,
//                     departement: true, specialite: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//         portfolio: {
//           include: {
//             projets: {
//               include: { skills: { include: { skill: true } } },
//               orderBy: { id: "desc" },
//             },
//             skills: { include: { skill: true } },
//           },
//         },
//       },
//     });

//     if (!student) return null;

//     const lettres = student.LettreStudent.map((ls) => ({
//       id:         ls.LettreRecommandation.id,
//       type:       ls.LettreRecommandation.type,
//       contenu:    ls.LettreRecommandation.contenu,
//       visibilite: ls.LettreRecommandation.visibilite,
//       date:       ls.LettreRecommandation.date,
//       prof:       ls.LettreRecommandation.Prof,
//     }));

//     // Filtrage en JS — Prisma ne supporte pas where dans include sur une relation normale
//     const activites = student.StudentActivite
//       .map((sa) => sa.ActiviteParascolaire)
//       .filter((a): a is NonNullable<typeof a> =>
//         a !== null && a.statutV === "VALIDATED"
//       );

//     const { LettreStudent, StudentActivite, ...rest } = student;

//     return { ...rest, lettres, activites };
//   },

//   async getPublicPortfolio(studentId: number) {
//     const student = await prisma.student.findUnique({
//       where:   { id: studentId },
//       include: {
//         skills:           { include: { skill: true } },
//         StudentFormation: { include: { Formation: true } },
//         Stage: {
//           where:  { statutV: "VALIDATED" },
//           select: {
//             id: true, entreprise: true, mission: true,
//             technologies: true, dateDebut: true, dateFin: true, duree: true,
//           },
//         },
//         LettreStudent: {
//           include: {
//             LettreRecommandation: {
//               where:  { visibilite: { in: ["PUBLIC", "DOWNLOADABLE"] } },
//               select: {
//                 id: true, type: true, contenu: true,
//                 visibilite: true, date: true,
//                 Prof: {
//                   select: {
//                     id: true, nom: true, prenom: true,
//                     departement: true, specialite: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//         portfolio: {
//           include: {
//             projets: {
//               where:  { statusV: "VALIDATED" },
//               select: {
//                 id: true, titre: true, description: true, technologie: true,
//                 githubLink: true, youtubeLink: true, resultats: true,
//                 screenshots: true, noteProf: true, score: true,
//                 dateSoumission: true, type: true, statusV: true,
//                 skills: { include: { skill: true } },
//                 Prof: { select: { id: true, nom: true, prenom: true } },
//               },
//               orderBy: { id: "desc" },
//             },
//             skills: { include: { skill: true } },
//           },
//         },
//       },
//     });

//     if (!student) return null;
//     if (!student.portfolio) return null;
//     if (student.portfolio.visibilite === "PRIVATE") return { restricted: true };

//     const lettresPubliques = student.LettreStudent
//       .map((ls) => ls.LettreRecommandation)
//       .filter((l): l is NonNullable<typeof l> =>
//         l !== null && ["PUBLIC", "DOWNLOADABLE"].includes(l.visibilite)
//       );

//     return {
//       id:            student.id,
//       nom:           student.nom,
//       prenom:        student.prenom,
//       filiere:       student.filiere,
//       bio:           student.bio,
//       linkedin:      student.linkedin,
//       etablissement: student.etablissement,
//       disponibilite: student.disponibilite,
//       niveau:        student.niveau,
//       formationType: student.formationType,
//       anneeEntree:   student.anneeEntree,
//       diplomePrevu:  student.diplomePrevu,
//       skills:        student.skills,
//       formations:    student.StudentFormation,
//       stages:        student.Stage,
//       lettres:       lettresPubliques,
//       portfolio:     student.portfolio,
//     };
//   },

//   async updateSettings(userId: number, data: UpdatePortfolioSettingsInput) {
//     const student = await prisma.student.findUnique({
//       where:  { userId },
//       select: { id: true },
//     });

//     if (!student) throw new Error("Student not found");

//     return prisma.portfolio.upsert({
//       where:  { studentId: student.id },
//       create: { studentId: student.id, ...data },
//       update: data,
//     });
//   },
// };