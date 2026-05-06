import {Request,Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { Role } from "@prisma/client";
import { changePasswordSchema, updateProfSchema, updateProfessionnelSchema, updateStudentSchema } from "./user.validation.js";
import prisma from "../../shared/utils/prisma.js";
export const getMe = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
        try {
const profile = await UserService.getFullProfile(req.user.userId)
res.status(200).json({user:profile})

        } catch (err) {
            next(err)
        }
      }

export const changePassword = async (

  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
try {
    const data =changePasswordSchema.parse(req.body)
    await UserService.changePassword(req.user.userId, data);

res.json({message:"Password changed successfully"})
} catch (err) {
    next(err)
}
    }

  export const updateProfile = async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
     const {role} = req.user

     let ProfileData
  
     switch(role){
      case Role.STUDENT:{
        ProfileData=updateStudentSchema.parse(req.body)

        await UserService.upsertStudentProfile(req.user.userId,ProfileData)
        break
      }
             case Role.PROF:{
        ProfileData=updateProfSchema.parse(req.body)
        await UserService.upsertProfessorProfile(req.user.userId,ProfileData)
        break
      }
            case Role.PRO:{
        ProfileData=updateProfessionnelSchema.parse(req.body)
        await UserService.upsertCompanyProfile(req.user.userId,ProfileData)
        break
      }
      default:{
        res.status(400).json({message:"This account has no specialized profile"})
        return
      }
     }
   
     const fullProfile = await UserService.getFullProfile(req.user.userId)
     res.json({
      message:"Profile updated successfully",
      user:fullProfile
     })
    } catch (err) {
      next(err)
    }
  }



export const getSkills = async (req:Request, res:Response) => {
  const skills = await prisma.skill.findMany();
  res.json(skills);
};