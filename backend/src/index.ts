import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';


dotenv.config(); //charger les variables  depuis le fichier .env

const app  = express()
const PORT = process.env.PORT || 3000;

//Helmet

app.use(helmet({
  
  
  contentSecurityPolicy: { //Contre les scripts malveillants XSS
    directives: { //Uniquement notre domaine: self
      defaultSrc: ["'self'"],              
      styleSrc: ["'self'", "'unsafe-inline'"], 
      scriptSrc: ["'self'"],               
      imgSrc: ["'self'", "data:", "https:"], 
    },
  },
  
  // Forcer HTTPS pour le navigateur
  hsts: {
    maxAge: 31536000,        // 1 an en secondes
    includeSubDomains: true, 
    preload: true            // Permettre l'inclusion 
  },
  
  // Protection contre le clickjacking
  frameguard: {
    action: 'deny'           
  },
  
  // Contre les attaques MIME(sniffing)
  noSniff: true,
  
  // Protection XSS du navigateur
  xssFilter: true
}));

console.log('Helmet activé ');



// CORS 
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true,           // envoi de cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'] //Content-type -> application/json / format uniforme pour envoi de donnes
                                                    //Authorization -> JWT
}));

console.log('CORS configuré pour:', process.env.FRONTEND_URL || 'http://localhost:5173');


// Rate limiter GLOBAL pour tous les routes
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes en ms
  max: 100,                  // Maximum 100 requêtes par IP pendant ces 15 minutes
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette IP, réessayez dans 15 minutes.'
  },
  standardHeaders: true,     // Retourner les headers 
  legacyHeaders: false,      // Désactiver les vieux headers 
  
  // Fonction qui s'exécute quand la limite est atteinte
  handler: (req, res) => {
    console.warn(`Rate limit atteint pour IP: ${req.ip}`); //IP==req.ip ==> l adresse ip de la requette envoyee
    res.status(429).json({ //429= too many requests donc la limite est atteinte
      success: false,
      message: 'Trop de requêtes. Veuillez patienter avant de réessayer.'
    });
  }
});

// Appliquer le rate limiter global à toutes les routes /api/*
app.use('/api/', globalLimiter);

console.log('Rate limiting global activé : 100 req/15min par IP');



// Rate limiter pour les routes sensible d auth -> login/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  
  max: 5,                    // Max 5 tentatives 
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
  },
  skipSuccessfulRequests: true, //compter seulement les tentatives echouees
  
  handler: (req, res) => {
    console.warn(`Tentatives de login excessives depuis IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Trop de tentatives. Compte temporairement bloqué pour 15 minutes.'
    });
  }
});

// Appliquer UNIQUEMENT aux routes de login et register
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

console.log(' Rate limiting auth activé : 5 tentatives/15min par IP');

//Middleware
//Protection des attaques ddos et la surcharge du server en limitant la taille des requetes a 10mb seulement
app.use(express.json({ limit: '10mb' })); //Lire les requetes json
app.use(express.urlencoded({ extended: true, limit: '10mb' })); //Parser les donnes envoyes sous formulaires html
console.log('Body parsers configurés (limite: 10mb)');

//Healthcheck

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

console.log('Route /health créée');

//Routes


import authRoutes from './modules/auth/auth.routes.js';
app.use('/api/auth', authRoutes);

console.log('Routes auth montées sur /api/auth');

// Route info API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'API Portfy v1.0 - Secured',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh'
      },
      health: 'GET /health'
    }
  });
});

//Error handlers

// 404 ==>  Route non trouvée
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Error Handler global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur capturée:', err.message);
  console.error(err.stack);
  
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    message: isDev ? err.message : 'Une erreur est survenue',
    ...(isDev && { stack: err.stack })
  });
});

console.log('Error handler configuré');

//Demarrage

app.listen(PORT, () => {
  console.log(' PORTFY BACKEND - SÉCURISÉ');
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Environment: ${(process.env.NODE_ENV || 'development').padEnd(11)} `);
  console.log('Helmet:  Activé');
  console.log('Rate Limiting:  Activé');
  console.log('Auth Protection: Activé');
  console.log('CORS:  Configuré');

});

export default app;