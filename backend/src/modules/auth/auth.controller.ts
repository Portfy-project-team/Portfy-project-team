import { Request, Response } from "express";
import { registerSchema, loginSchema, refreshSchema } from "./auth.validation.js";
import { registerUser, loginUser, refreshTokenService, logoutUser } from "./auth.service.js";


export const registerController = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    // Success response
    return res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error: any) {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(400).json({
    errors: error.issues?.map((i: any) => i.message) || [error.message],
  });
}
};

export const loginController = async (req: Request, res: Response) => {
  try {
    // validate request body
    const validatedData = loginSchema.parse(req.body);

    // login user
    const result = await loginUser(validatedData);

    //success response
     return res.status(200).json({
      message: "Login successful",
      ...result,
    });

  } catch (error: any) {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(400).json({
    errors: error.issues?.map((i: any) => i.message) || [error.message],
  });
}
};



// export const refreshController = async (req: Request, res: Response) => {
//   try {
//     // Validate request body
//     const { refreshToken } = refreshSchema.parse(req.body);

    // Success response
    return res.status(200).json({
      message: "Token refreshed successfully",
      ...result,
    });

  } catch (error: any) {
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(400).json({
    errors: error.issues?.map((i: any) => i.message) || [error.message],
  });
}
};

  export const logoutController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);

    const result = await logoutUser(refreshToken);

    return res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (error: any) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    return res.status(400).json({
      errors: error.issues?.map((i: any) => i.message) || [error.message],
    });
  }
};
