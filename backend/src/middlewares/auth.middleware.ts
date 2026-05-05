
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
type Role = "STUDENT" | "PROF" | "PRO" | "ADMIN";
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET manquant dans les variables d'environnement");
}

// Extension du type Request Express — ajoute req.user dans toute la chaine
declare global {
  namespace Express {
    interface Request {
      user?: {
        id:    number; // Int dans le schema Prisma (@id @default(autoincrement()))
        email: string;
        role:  Role;   // enum Prisma : STUDENT | PROF | PRO | ADMIN
      };
    }
  }
}

// ── verifyToken ───────────────────────────────────────────────────
// A utiliser sur toutes les routes necessitant une authentification
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Token lu depuis le cookie httpOnly — jamais depuis le body ou un header Authorization
  // Le frontend n'a pas acces a ce cookie (httpOnly) — envoye automatiquement par le navigateur
  const token = req.cookies?.access_token;

  if (!token) {
    res.status(401).json({ message: "Non authentifie" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as {
      userId: number;
      role:   Role;
      email?: string;
    };

    req.user = {
      id:    decoded.userId,
      email: decoded.email ?? "",
      role:  decoded.role,
    };

    next();
  } catch {
    // Token expire ou falsifie — nettoyer le cookie corrompu
    res.clearCookie("access_token", { httpOnly: true, sameSite: "strict", path: "/" });
    res.status(401).json({ message: "Session expiree. Reconnectez-vous." });
  }
};

// ── requireRole ───────────────────────────────────────────────────
// A chainer apres verifyToken sur les routes a acces restreint
// Exemple : router.post("/validate", verifyToken, requireRole("PROF", "ADMIN"), controller)
export const requireRole = (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      // 403 et non 401 — l'utilisateur est connecte mais n'a pas le bon role
      res.status(403).json({ message: "Acces refuse" });
      return;
    }
    next();
  };

// ── Exemples d'utilisation dans les autres modules ───────────────
//
// import { verifyToken, requireRole } from "../../middlewares/auth.middleware.js";
//
// Portfolio public — connecte seulement
// router.get("/portfolio/:uuid",  verifyToken, portfolioController.get);
//
// Validation projet — PROF ou ADMIN uniquement
// router.post("/projects/:id/validate", verifyToken, requireRole("PROF", "ADMIN"), projectController.validate);
//
// Soumission projet — STUDENT uniquement
// router.post("/projects",  verifyToken, requireRole("STUDENT"), projectController.create);
//
// Gestion utilisateurs — ADMIN uniquement
// router.get("/admin/users", verifyToken, requireRole("ADMIN"), adminController.listUsers);