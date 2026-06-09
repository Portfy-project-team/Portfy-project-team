import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes         from "./modules/auth/auth.routes.js";
import userRoutes         from "./modules/user/user.routes.js";
import adminRoutes        from "./modules/admin/admin.routes.js";
import portfolioRoutes    from "./modules/portfolio/portfolio.routes.js";
import projectRoutes      from "./modules/projects/project.routes.js";
import letterRoutes       from "./modules/letters/letter.routes.js";
import stageRoutes        from "./modules/stages/stage.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";
import exportRoute        from "./modules/export_pdf/export-portfolio.routes.js";

const app = express();

const isTest = process.env.NODE_ENV === "test";
const isK6   = process.env.K6        === "true";

app.set("trust proxy", 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: "same-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'"],
      styleSrc:       ["'self'", "'unsafe-inline'"],
      objectSrc:      ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
}));

const ALLOWED_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin:         ALLOWED_ORIGIN,
  credentials:    true,
  methods:        ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type"],
  // Authorization retiré — cookies httpOnly uniquement
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

const globalLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             100,
  message:         { message: "Trop de requêtes, veuillez réessayer plus tard." },
  standardHeaders: true,
  legacyHeaders:   false,
});

if (!isTest && !isK6) {
  app.use(globalLimiter);
}

app.use("/api/auth",          authRoutes);
app.use("/api/user",          userRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/projects",      projectRoutes);
app.use("/api/letters",       letterRoutes);
app.use("/api/stages",        stageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/portfolio",     portfolioRoutes);
app.use("/api",               exportRoute);

// CORRECTION : uploads servis avec protection
// La version originale exposait TOUT le dossier uploads publiquement
// sans aucune restriction — n'importe qui peut accéder à n'importe quel avatar
// en devinant le nom du fichier
// On ajoute les headers de sécurité appropriés pour les fichiers statiques
app.use("/uploads/avatars", express.static("uploads/avatars", {
  // Désactiver le directory listing — empêche de lister tous les fichiers
  index: false,
  // Headers de sécurité sur les fichiers servis
  setHeaders: (res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Security-Policy", "default-src 'none'");
    res.setHeader("Cache-Control", "private, max-age=3600");
  },
}));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Ressource introuvable" });
});

export default app;