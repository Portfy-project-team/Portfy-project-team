import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type Role = "STUDENT" | "PROF" | "PRO" | "ADMIN";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;

if (!JWT_ACCESS_SECRET) {
  throw new Error(
    "JWT_ACCESS_SECRET manquant dans les variables d'environnement"
  );
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id:   number;
        role: Role;
      };
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.access_token;

  if (!token) {
    res.status(401).json({ message: "Non authentifie" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as {
      userId: number;
      role:   Role;
    };

    if (!decoded.userId || !decoded.role) {
      res.clearCookie("access_token", {
        httpOnly: true,
        sameSite: "strict",
        path:     "/",
      });
      res.status(401).json({ message: "Session expiree. Reconnectez-vous." });
      return;
    }

    req.user = {
      id:   decoded.userId,
      role: decoded.role,
    };

    next();
  } catch {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "strict",
      path:     "/",
    });
    res.status(401).json({ message: "Session expiree. Reconnectez-vous." });
  }
};

export const requireRole = (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
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