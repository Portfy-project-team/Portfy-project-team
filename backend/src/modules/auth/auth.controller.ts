import type { Request, Response } from "express";
import { registerSchema } from "./auth.validation.js";
import { registerUser } from "./auth.service.js";

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = registerSchema.safeParse(req.body); 

  if (!parsed.success) {
    res.status(400).json({
      message: "Données invalides",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const user = await registerUser(parsed.data);

    res.status(201).json({
      message: "Compte créé avec succès",
      user,
    });

  } catch (error) {
    if (error instanceof Error && error.message === "Inscription impossible") {
      res.status(409).json({ message: error.message });
      return;
    }

    console.error("[registerController]", error);
    res.status(500).json({ message: "Une erreur est survenue lors de l'inscription" });
  }
};