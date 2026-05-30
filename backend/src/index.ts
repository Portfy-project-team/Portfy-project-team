import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes    from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";

const app = express();

app.use(helmet());

app.use(cors({
  origin:         process.env.FRONTEND_URL || "http://localhost:5173",
  credentials:    true,
  methods:        ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.set("trust proxy", 1);

const globalLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             100,
  message:         { message: "Trop de requêtes, veuillez réessayer plus tard." },
  standardHeaders: true,
  legacyHeaders:   false,
});
app.use(globalLimiter);

app.use("/api/auth",     authRoutes);
app.use("/api/projects", projectRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ message: "Ressource introuvable" });
});

export default app;