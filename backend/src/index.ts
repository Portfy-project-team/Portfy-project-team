import "dotenv/config";
import express from "express";
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
import projectRoutes     from "./modules/projects/project.routes.js";
import dashboardRoutes from "./modules/DashboardProf/dashboard.routes.js"; // ← AJOUT
import studentDashboardRoutes from "./modules/DashbordStudent/dashboard.routes.js"
const app = express();
app.use("/api/student-dashboard", studentDashboardRoutes)




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
  origin:         ALLOWED_ORIGIN,
  credentials:    true,
  methods:        ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use("/api/portfolio", portfolioRoutes);

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

app.use('/api/stages', stageRoutes)
app.use('/api/projects', projectRoutes)
app.use("/api/auth",      authRoutes);
app.use("/api/user",      userRoutes);
app.use("/api/admin",     adminRoutes);
app.use("/api/ai-reco",   recoRoutes);
app.use("/api/dashboard", dashboardRoutes); // ← AJOUT

app.get("/health", (req, res) => {
  res.status(200).json({
    status:    "ok",
    env:       process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Ressource introuvable" });
});



// app.listen(PORT, () => {
//   console.log(` Portfy API sécurisée lancée sur le port ${PORT}`);
//   if (!isProduction) console.log(` CORS autorisé pour : ${process.env.FRONTEND_URL}`);
// });


export default app;
