import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes     from "./modules/auth/auth.routes.js";
import projectRoutes  from "./modules/projects/project.routes.js";
import letterRoutes   from "./modules/letters/letter.routes.js";
import skillRoutes    from "./modules/skills/skill.routes.js";
import activityRoutes from "./modules/activities/activity.routes.js";

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

app.use("/api/auth",       authRoutes);
app.use("/api/projects",   projectRoutes);
app.use("/api/letters",    letterRoutes);
app.use("/api/skills",     skillRoutes);
app.use("/api/activities", activityRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Ressource introuvable" });
});

export default app;