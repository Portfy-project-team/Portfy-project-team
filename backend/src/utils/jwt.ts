import jwt from "jsonwebtoken";

// Récupération des secrets avec une sécurité "Fail-Fast"
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Sécurité critique : Le serveur refuse de démarrer si les secrets sont absents
if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("CRITICAL: JWT secrets are missing in environment variables.");
}

interface TokenPayload {
  userId: number;
  role?: string;
}

/**
 * Génère un Access Token (Courte durée)
 * Signé avec l'algorithme HS256 par défaut
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "15m", // Durée courte pour limiter l'impact en cas de vol
  });
};

/**
 * Génère un Refresh Token (Longue durée)
 */
export const generateRefreshToken = (payload: { userId: number }): string => {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "7d", // Valable 7 jours
  });
};

/**
 * Vérifie la validité d'un Refresh Token
 * @throws Erreur si le token est expiré ou falsifié
 */
export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (error) {
    // On ne renvoie pas l'erreur brute pour ne pas donner d'indices à un attaquant
    throw new Error("Invalid or expired refresh token");
  }
};