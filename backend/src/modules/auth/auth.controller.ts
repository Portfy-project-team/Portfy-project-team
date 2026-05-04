
import { Request, Response } from "express";
import { registerSchema } from "./auth.validation.js";
import { registerUser } from "./auth.service.js";
import { loginSchema } from "./auth.validation.js";
import { loginUser } from "./auth.service.js";


export const registerController = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

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
      errors:
        error.issues?.map((issue: any) => issue.message) ||
        [error.message],
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    // validate request body
    const validatedData = loginSchema.parse(req.body);

    // login user
    const result = await loginUser(validatedData);

    // success response
    return res.status(200).json({
      message: "Login successful",
      ...result,
    });

  } catch (error: any) {
    return res.status(400).json({
      errors:
        error.issues?.map((issue: any) => issue.message) ||
        [error.message],
    });
  }
};




export const refreshController = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { refreshToken } = refreshSchema.parse(req.body);

    // Refresh token
    const result = await refreshTokenService(refreshToken);

    // Success response
    res.status(200).json({
      message: "Token refreshed successfully",
      ...result,
    });

  } catch (error: any) {
    res.status(401).json({
      errors: error.issues?.map((issue: any) => issue.message) || [error.message],
    });
  }

};










// export const registerController = async (req: Request, res: Response) => {
//   try {
//     const validatedData = registerSchema.parse(req.body);

//     const user = await registerUser(validatedData);

//     return res.status(201).json({
//       message: "User created successfully",
//       user,
//     });

//   } catch (error: any) {

//     if (error.statusCode) {
//       return res.status(error.statusCode).json({
//         message: error.message,
//       });
//     }


//     return res.status(400).json({
//       errors:
//         error.issues?.map((issue: any) => issue.message) ||
//         [error.message],

// })
// };

// export const loginController = async(req: Request , res:Response)=>{
//   try{
//     //validate request body 
//     const validatedData = loginSchema.parse(req.body);

//     // login user 
//     const result = await loginUser(validatedData);

//     //success response
//      res.status(200).json({
//       message: "Login successful",
//       ...result,
//     });

//   } catch (error: any) {
//     res.status(400).json({
//       errors: error.issues?.map((issue: any) => issue.message) || [error.message],

//     });
//   }
// };

