import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";

import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import portfolioRoutes from "./modules/portfolio/portfolio.routes.js";
import authRoutes      from "./modules/auth/auth.routes.js";
import userRoutes      from "./modules/user/user.routes.js";
import adminRoutes     from "./modules/admin/admin.routes.js";
import recoRoutes      from "./modules/ai-reco/reco.routes.js";
import stageRoutes      from "./modules/stages/stage.routes.js";
import commentsProRoutes
from './modules/commentsPro/commentsPro.routes.js'
import projectRoutes     from "./modules/projects/project.routes.js";
import dashboardRoutes from "./modules/DashboardProf/dashboard.routes.js";
import skillRoutes     from "./modules/skills/skill.routes.js";
import activityRoutes  from "./modules/activities/activity.routes.js";
import notifRoutes     from "./modules/notifications/notification.routes.js";
import settingsRoutes  from "./modules/settings/settings.routes.js";
import commentRoutes   from "./modules/comments/comments.routes.js";
import formationRoutes from "./modules/formations/formation.routes.js";
import badgeRoutes     from "./modules/badges/badge.routes.js";
import searchRoutes    from "./modules/Search/Search.routes.js";
import dashboardProfRoutes from './modules/DashboardProfss/dashboardProf.routes.js'

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const isTest       = process.env.NODE_ENV === "test";
const isK6         = process.env.K6 === "true";

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
  origin:         [ALLOWED_ORIGIN, "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials:    true,
  methods:        ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use("/api/dashboard-prof", dashboardProfRoutes);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

const globalLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             1000,
  message:         { message: "Trop de requêtes, veuillez réessayer plus tard." },
  standardHeaders: true,
  legacyHeaders:   false,
});

if (!isTest && !isK6) {
  app.use(globalLimiter);
}

app.use("/api/portfolio",     portfolioRoutes);
app.use('/api/stages',        stageRoutes)
app.use('/api/projects',      projectRoutes)
app.use("/api/auth",          authRoutes);
app.use("/api/user",          userRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/ai-reco",       recoRoutes);
app.use("/api/dashboard",     dashboardRoutes);
app.use("/api/skills",        skillRoutes);
app.use("/api/activities",    activityRoutes);
app.use("/api/notifications", notifRoutes);
app.use("/api/settings",      settingsRoutes);
app.use("/api/comments",      commentRoutes);
app.use("/api/formations",    formationRoutes);
app.use("/api/badges",        badgeRoutes);
app.use("/api/search",        searchRoutes);
app.use(
  '/api/comments-pro',
  commentsProRoutes
)

app.get("/health", (req, res) => {
  res.status(200).json({
    status:    "ok",
    env:       process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 GLOBAL ERROR:", err);
  
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Une erreur interne est survenue.";
  
  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Ressource introuvable" });
});

export default app;
