import type { Request, Response } from "express";
import {
  createProjectSchema,
  updateProjectSchema,
  projectDecisionSchema,
} from "./project.validation.js";
import {
  createProject,
  getMyProjects,
  getProjectById,
  updateProject,
  deleteProject,
  submitProject,
  getPendingProjects,
  validateProject,
  rejectProject,
} from "./project.service.js";

const parseProjectId = (req: Request): number | null => {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const handleError = (error: unknown, res: Response, context: string): void => {
  if (error instanceof Error && "statusCode" in error) {
    const statusCode = Number((error as { statusCode: number }).statusCode);
    res.status(statusCode).json({ message: error.message });
    return;
  }
  console.error(`[${context}]`, error);
  res.status(500).json({ message: "Une erreur est survenue" });
};

export const createProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = createProjectSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const project = await createProject(req.user!.id, parsed.data);
    res.status(201).json({
      message: "Projet créé avec succès",
      project,
    });
  } catch (error) {
    handleError(error, res, "createProjectController");
  }
};

export const getMyProjectsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await getMyProjects(req.user!.id);
    res.status(200).json({ projects });
  } catch (error) {
    handleError(error, res, "getMyProjectsController");
  }
};

export const getProjectByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const projectId = parseProjectId(req);

  if (!projectId) {
    res.status(400).json({ message: "Id projet invalide" });
    return;
  }

  try {
    const project = await getProjectById(req.user!, projectId);
    res.status(200).json({ project });
  } catch (error) {
    handleError(error, res, "getProjectByIdController");
  }
};

export const updateProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const projectId = parseProjectId(req);

  if (!projectId) {
    res.status(400).json({ message: "Id projet invalide" });
    return;
  }

  const parsed = updateProjectSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const project = await updateProject(req.user!.id, projectId, parsed.data);
    res.status(200).json({
      message: "Projet modifié avec succès",
      project,
    });
  } catch (error) {
    handleError(error, res, "updateProjectController");
  }
};

export const deleteProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const projectId = parseProjectId(req);

  if (!projectId) {
    res.status(400).json({ message: "Id projet invalide" });
    return;
  }

  try {
    await deleteProject(req.user!, projectId);
    res.status(200).json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    handleError(error, res, "deleteProjectController");
  }
};

export const submitProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const projectId = parseProjectId(req);

  if (!projectId) {
    res.status(400).json({ message: "Id projet invalide" });
    return;
  }

  try {
    const project = await submitProject(req.user!.id, projectId);
    res.status(200).json({
      message: "Projet soumis à validation",
      project,
    });
  } catch (error) {
    handleError(error, res, "submitProjectController");
  }
};

export const getPendingProjectsController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const projects = await getPendingProjects();
    res.status(200).json({ projects });
  } catch (error) {
    handleError(error, res, "getPendingProjectsController");
  }
};

export const validateProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const projectId = parseProjectId(req);

  if (!projectId) {
    res.status(400).json({ message: "Id projet invalide" });
    return;
  }

  const parsed = projectDecisionSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const project = await validateProject(req.user!, projectId, parsed.data);
    res.status(200).json({
      message: "Projet validé avec succès",
      project,
    });
  } catch (error) {
    handleError(error, res, "validateProjectController");
  }
};

export const rejectProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const projectId = parseProjectId(req);

  if (!projectId) {
    res.status(400).json({ message: "Id projet invalide" });
    return;
  }

  const parsed = projectDecisionSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const project = await rejectProject(req.user!, projectId, parsed.data);
    res.status(200).json({
      message: "Projet rejeté",
      project,
    });
  } catch (error) {
    handleError(error, res, "rejectProjectController");
  }
};