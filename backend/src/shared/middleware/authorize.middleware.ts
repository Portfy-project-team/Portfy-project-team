import { Role } from "@prisma/client";
import { Request,Response,NextFunction } from "express";

export const authorize = (...roles:Role[])=>
(req:Request,res:Response,next:NextFunction):void=>{
    if(!req.user || !roles.includes(req.user.role)){
res.status(403).json({message:"insufficient permissions"})
return;
    }
    next()

}