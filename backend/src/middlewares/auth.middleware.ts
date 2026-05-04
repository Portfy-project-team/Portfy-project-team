import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {Prisma} from "@prisma/client"; 

type Role = "STUDENT" | "PROF" | "PRO" | "ADMIN";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "fallback_secret";

// Interface propre pour ton projet
interface UserPayload {
  sub: number;
  email: string;
  role: Role;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.access_token;
  if (!token) {
    res.status(401).json({ message: "Non authentifié" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);

    // On s'assure que c'est un objet (Sécurité + Correction Erreur 2)
    if (typeof decoded === "string") throw new Error();

    // Le cast 'as any' ici est localisé et sécurisé par le check précédent
    const payload = decoded as any as UserPayload;

    req.user = { 
      sub: payload.sub, 
      email: payload.email, 
      role: payload.role 
    };
    
    next();
  } catch {
    res.clearCookie("access_token");
    res.status(401).json({ message: "Session expirée ou invalide." });
  }
};

export const requireRole = (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
       res.status(403).json({ message: "Accès refusé" });
       return;
    }
    next();
  };