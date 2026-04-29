import { Request, Response } from "express";
import { registerSchema } from "./auth.validation.js";
import { registerUser } from "./auth.service.js";

export const registerController = async (
  req: Request,
  res: Response
) => {
  try {

    // Validate request body
    const validatedData =
      registerSchema.parse(req.body);

    // Register user
    const user =
      await registerUser(validatedData);

    // Success response
    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error: any) {

    res.status(400).json({
      errors: error.issues?.map(
        (issue: any) => issue.message
      ) || [error.message],
    });

  }
};