import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import portfolioRoutes from "./modules/portfolio/portfolio.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
import letterRoutes from "./modules/letters/letter.routes.js";


const app = express();

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";
const isK6 = process.env.K6 === "true";


//  CONFIGURATION RÉSEAU ---
// Nécessaire pour capturer la vraie IP derrière Docker pour le Rate Limiting et LoginLog
app.set("trust proxy", 1);

// SÉCURITÉ DES HEADERS (Défense en profondeur) 
app.use(helmet({
  crossOriginResourcePolicy: { policy: "same-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc:     ["'self'"],
      scriptSrc:      ["'self'"],
      styleSrc:       ["'self'", "'unsafe-inline'"], // Autorise les styles internes si besoin
      objectSrc:      ["'none'"],
      frameAncestors: ["'none'"], // Empêche le Clickjacking
    },
  },
}));

// CONTRÔLE DES ACCÈS (CORS) 
const ALLOWED_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin:      ALLOWED_ORIGIN,
  credentials: true, // Crucial pour les cookies HttpOnly (JWT)
  methods:     ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"], 
}));

// PROTECTION CONTRE LE DÉNI DE SERVICE (DoS)
app.use(express.json({ limit: "10kb" })); // Limite la taille des JSON entrants
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use("/api/portfolio", portfolioRoutes);

// Rate Limiting Global
const globalLimiter = rateLimit({
  windowMs:        15 * 60 * 1000, // 15 minutes
  max:             100,            // 100 requêtes max par IP
  message:         { message: "Trop de requêtes, veuillez réessayer plus tard." },
  standardHeaders: true,
  legacyHeaders:   false,
});

//app.use(globalLimiter);
if (!isTest && !isK6) {
  app.use(globalLimiter);
}

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/projects" , projectRoutes);
// Healthcheck améliorée pour le debug
app.use("/api/letters", letterRoutes);


// Route de santé (Healthcheck)

app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    env: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString()
  });
});

// Capture des routes inexistantes (404)
app.use((req, res) => {
  res.status(404).json({ message: "Ressource introuvable" });
});



// app.listen(PORT, () => {
//   console.log(` Portfy API sécurisée lancée sur le port ${PORT}`);
//   if (!isProduction) console.log(` CORS autorisé pour : ${process.env.FRONTEND_URL}`);
// });


export default app;