import "dotenv/config";
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// 1. Sécurité des Headers (Helmet)
// Protège contre les failles XSS, le sniffing de type MIME, et cache le header X-Powered-By
app.use(helmet());

// 2. Configuration CORS restrictive
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // URL précise du front
  credentials: true, // INDISPENSABLE pour autoriser l'envoi des cookies HttpOnly
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 3. Middlewares de parsing
app.use(express.json({ limit: '10kb' })); // Limite la taille du body pour éviter les attaques DoS
app.use(cookieParser()); // Permet à Express de lire req.cookies

// 4. Rate Limiting Global (Protection contre le déni de service)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: { message: "Trop de requêtes, veuillez réessayer plus tard." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// 5. Routes
app.use("/api/auth", authRoutes); // Ajout du préfixe /api pour la clarté

// Route de santé (Healthcheck)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", env: process.env.NODE_ENV });
});

// SÉCURITÉ : Suppression de la route /users globale qui fuyait les données

// 6. Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: "Ressource introuvable" });
});

// app.listen(PORT, () => {
//   console.log(`🚀 Portfy API sécurisée lancée sur le port ${PORT}`);
//   if (!isProduction) console.log(`📡 CORS autorisé pour : ${process.env.FRONTEND_URL}`);
// });

export default app;