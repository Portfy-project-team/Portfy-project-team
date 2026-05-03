import { Request, Response } from "express";
import { registerSchema } from "./auth.validation.js";
import { registerUser } from "./auth.service.js";
import { loginShema } from "./auth.validation.js";
import { loginUser } from "./auth.service.js";

export const registerController = async (
  req: Request,
  res: Response
) => {
  try {

    // Validate request body
    const validatedData = registerSchema.parse(req.body);

    // Register user
    const user = await registerUser(validatedData);

    // Success response
    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error: any) {

  res.status(400).json({
    errors:
      error.issues?.map(
        (issue: any) => issue.message
      ) || [error.message],
  });

}
};

export const loginController = async(req: Request , res:Response)=>{
  try{
    //validate request body 
    const validatedData = loginShema.parse(req.body);

    // login user 
    const result = await loginUser(validatedData);

    //success response
    res.status(200).json({
      message: "Login successful",
      ...result,
    });

  } catch (error: any) {
    res.status(400).json({
      errors: error.issues?.map((issue: any) => issue.message) || [error.message],
    });
  }
};