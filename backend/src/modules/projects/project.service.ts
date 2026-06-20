/*
ce fichier est la logique metier des projets 
il contient toutes les fct qui 
creent un projet 
modifient un projet 
supriment un projet 
valident un projet 
refusent un projet
et communiquent avec bd via prisma 
*/
import type { Role } from "@prisma/client";
//importe prisma 
//prisma sert a parler avec la bd 
import { prisma } from "../../utils/prisma.js";
//importe les types generes avec zod 
import type {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectDecisionInput,
} from "./project.validation.js";

//creation d'une erreur personnalisee
class ProjectError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

//decrit l'user connecte 
interface AuthUser {
  id: number;
  role: Role;
}

//elle cherche l'etudiant 
//recupere son portfolio 
//cree le portfolio s'il n'existe pas 
const getStudentWithPortfolio = async (userId: number) => {
  const student = await prisma.student.findUnique({
    where: { userId },
    include: { portfolio: true },
  });

  //etudiant innexistant 
  if (!student) {
    throw new ProjectError("Profil étudiant introuvable", 404);
  }
  //si portfolio existe on le retourne 

  if (student.portfolio) {
    return { student, portfolio: student.portfolio };
  }
  //cree automatiquement un portfolio 
  const portfolio = await prisma.portfolio.create({
    data: { studentId: student.id },
  });

  return { student, portfolio };
};
//transforme un userid en profid 

const getProfIdFromUser = async (userId: number) => {
  const prof = await prisma.prof.findUnique({
    where: { userId },
    select: { id: true },
  });

  return prof?.id ?? null;
};
//prisma.projet.findUnique : cherche un projet par ID 
// cette fonction sert a recuperer un projet avec toutes les informations lies autour de lui
const getProjectWithOwner = async (projectId: number) => {
  //async car la fct parle avec la bd , donc ca prend du temps  
  const project = await prisma.projet.findUnique({
    //findUnique car il cherche un seul projet unique 
    where: { id: projectId },
    //include sert a charger les relations liees au projet sans include on recupere que id et titre 
    include: {
      //chaque projet appartient a un portfolio 
      portfolio: {
        include: {
          student: {
            select: {
              id: true,
              userId: true,
              nom: true,
              prenom: true,
              filiere: true,
            },
          },
        },
      },
      //2 eme relation est le prof 
      Prof: {
        select: {
          id: true,
          nom: true,
          prenom: true,
        },
      },
      //3 eme relation est skills 
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (!project) {
    throw new ProjectError("Projet introuvable", 404);
  }

  return project;
};

// verifier si le projet appartient vraiment a cet etudiant 
const ensureStudentOwnsProject = async (projectId: number, userId: number) => {
  
  const project = await getProjectWithOwner(projectId);

  if (project.portfolio.student.userId !== userId) {
    throw new ProjectError("Accès refusé", 403);
  }

  return project;
};
//creer un nouveau projet dans la bd 

export const createProject = async (
  userId: number,
  data: CreateProjectInput
) => {
  //cette fct cherche etudiant , recupere son portfolio , cree un portfolio s'il n'existe pas 
  const { portfolio } = await getStudentWithPortfolio(userId);
  
  const { github, demo, ...rest } = data as any;

  //sert a inserer une nouvelle ligne dans la db 
  return prisma.projet.create({
    data: { //donnees a enrregistrer 
      ...rest, // copie tous les champs de data 
      githubLink: github || rest.githubLink,
      youtubeLink: demo || rest.youtubeLink,
      portfolioId: portfolio.id,
      statusV: "PENDING",
      dateSoumission: null,
    },
  });
};

export const getMyProjects = async (userId: number) => {
  const { portfolio } = await getStudentWithPortfolio(userId);
  return prisma.projet.findMany({
    where: { portfolioId: portfolio.id },
    orderBy: { id: "desc" }, //trie les projets par id decroissant , descendig pour afficher les projets recents d'abbord 
    include: {
      skills: {
        include: {
          skill: true,
        },
      },
      Prof: {
        select: {
          id: true,
          nom: true,
          prenom: true,
        },
      },
    },
  });
};

//authUser est user connecte 
export const getProjectById = async (authUser: AuthUser, projectId: number) => {
  const project = await getProjectWithOwner(projectId);

/*
1 - si l'user est un etudiant 
et 
le projet ne lui appartient pas 
alors 
acces refuse 
*/
  if (
    authUser.role === "STUDENT" &&
    project.portfolio.student.userId !== authUser.id
  ) {
    throw new ProjectError("Accès refusé", 403);
  }

  return project;
};

// modifier un projet 
// cette fct verifie proprietaire , bloque projets valides , modifier DB 
export const updateProject = async (
  userId: number,
  projectId: number,
  data: UpdateProjectInput
) => {
  const project = await ensureStudentOwnsProject(projectId, userId);

  if (project.statusV === "VALIDATED") {
    throw new ProjectError("Un projet validé ne peut pas être modifié", 400);
  }

  const { github, demo, ...rest } = data as any;

  // update DB 
  return prisma.projet.update({
    where: { id: projectId }, // quel projet modifier 
    data: {
      ...rest,
      githubLink: github !== undefined ? github : rest.githubLink,
      youtubeLink: demo !== undefined ? demo : rest.youtubeLink,
    },
  });
};


export const deleteProject = async (userId: number, projectId: number) => {
  const project = await ensureStudentOwnsProject(projectId, userId);

  if (project.statusV === "VALIDATED") {
    throw new ProjectError("Un projet validé ne peut pas être supprimé", 400);
  }
// transaction en Prisma sert a executer plusieurs operations de base de donnees comme un seul bloc securise 
  await prisma.$transaction([
    // on supprime dependances then le projet 
    //si une seule requete echoue prisma fait automatiquement ROLLBACK : annuler toutes les operations precedentes 
    prisma.projetSkill.deleteMany({ where: { projetId: projectId } }),
    prisma.projetBadge.deleteMany({ where: { projetId: projectId } }),
    prisma.commentaire.deleteMany({ where: { projetId: projectId } }),
    prisma.projet.delete({ where: { id: projectId } }),
  ]);
};

//envoyer projet au prof pour validation 
export const submitProject = async (userId: number, projectId: number) => {
  const project = await ensureStudentOwnsProject(projectId, userId);

  if (project.statusV === "VALIDATED") {
    throw new ProjectError("Un projet validé ne peut pas être resoumis", 400);
  }

  return prisma.projet.update({
    where: { id: projectId },
    data: {
      statusV: "PENDING",
      dateSoumission: new Date(),
      noteProf: null,
      score: null,
      profId: null,
    },
  });
};
//recuperer projets en attente de validation 

export const getPendingProjects = async () => {
  return prisma.projet.findMany({
    where: {
      statusV: "PENDING",
      dateSoumission: { not: null },
    },
    orderBy: { dateSoumission: "desc" },
    include: {
      portfolio: {
        include: {
          student: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              filiere: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const validateProject = async (
  authUser: AuthUser,
  projectId: number,
  data: ProjectDecisionInput
) => {
  const project = await getProjectWithOwner(projectId);

  if (project.statusV !== "PENDING" || !project.dateSoumission) {
    throw new ProjectError("Ce projet n'est pas en attente de validation", 400);
  }

  const profId =
    authUser.role === "PROF" ? await getProfIdFromUser(authUser.id) : null;

  return prisma.projet.update({
    where: { id: projectId },
    data: {
      statusV: "VALIDATED",
      noteProf: data.noteProf,
      score: data.score,
      profId,
    },
  });
};

export const rejectProject = async (
  authUser: AuthUser,
  projectId: number,
  data: ProjectDecisionInput
) => {
  const project = await getProjectWithOwner(projectId);

  if (project.statusV !== "PENDING" || !project.dateSoumission) {
    throw new ProjectError("Ce projet n'est pas en attente de validation", 400);
  }

  const profId =
    authUser.role === "PROF" ? await getProfIdFromUser(authUser.id) : null;

  return prisma.projet.update({
    where: { id: projectId },
    data: {
      statusV: "REJECTED",
      noteProf: data.noteProf,
      score: data.score,
      profId,
    },
  });
};