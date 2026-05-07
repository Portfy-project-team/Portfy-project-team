<<<<<<< HEAD
import { Request, Response } from "express";
import { registerSchema } from "./auth.validation.js";
import { registerUser } from "./auth.service.js";
import { loginSchema } from "./auth.validation.js";
import { loginUser } from "./auth.service.js";


export const registerController = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    return res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error: any) {

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    return res.status(400).json({
      errors:
        error.issues?.map((issue: any) => issue.message) ||
        [error.message],
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    // validate request body
    const validatedData = loginSchema.parse(req.body);

    // login user
    const result = await loginUser(validatedData);

    // success response
    return res.status(200).json({
      message: "Login successful",
      ...result,
    });

  } catch (error: any) {
    return res.status(400).json({
      errors:
        error.issues?.map((issue: any) => issue.message) ||
        [error.message],
=======
import type { Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
} from "./auth.validation.js";
import {
  registerUser,
  loginUser,
  refreshTokenService,
  logoutUser,
} from "./auth.service.js";

// Options communes pour les cookies httpOnly
const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge:   15 * 60 * 1000,        // 15 minutes
  path:     "/",
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge:   7 * 24 * 60 * 60 * 1000, // 7 jours
  path:     "/",      // path restreint au seul endpoint qui en a besoin
};

// Erreurs metier prevues — status associe
// Seuls ces messages sont retournes au client — les autres → 500 generique
const KNOWN_ERRORS: Record<string, number> = {
  "Inscription impossible":                          409,
  "Identifiants incorrects":                         401,
  "Token invalide":                                  401,
  "Session expiree. Reconnectez-vous.":              401,
  "Compte en attente de validation par un administrateur": 403,
};

function handleError(error: unknown, res: Response, context: string): void {
  if (error instanceof Error) {
    const status = KNOWN_ERRORS[error.message];
    if (status) {
      res.status(status).json({ message: error.message });
      return;
    }
  }
  // Erreur inattendue — log serveur, message generique client
  // Ne jamais exposer error.message directement (peut contenir des infos Prisma)
  console.error(`[${context}]`, error);
  res.status(500).json({ message: "Une erreur est survenue" });
}

// ── Register ──────────────────────────────────────────────────────
export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  // safeParse au lieu de parse — controle explicite sans throw
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Donnees invalides",
      errors:  parsed.error.flatten().fieldErrors,
      // fieldErrors structure par champ : { email: [...], password: [...] }
      // Le frontend affiche l'erreur sous le bon input
>>>>>>> 90ae145350d2bd1c6f4c3029f591473bfc107e39
    });
    return;
  }

  try {
    const user = await registerUser(parsed.data);
    res.status(201).json({ message: "Compte cree avec succes", user });
  } catch (error) {
    handleError(error, res, "registerController");
  }
};

<<<<<<< HEAD
// export const refreshController = async (req: Request, res: Response) => {
//   try {
//     // Validate request body
//     const { refreshToken } = refreshSchema.parse(req.body);

//     // Refresh token
//     const result = await refreshTokenService(refreshToken);

//     // Success response
//     res.status(200).json({
//       message: "Token refreshed successfully",
//       ...result,
//     });

//   } catch (error: any) {
//     res.status(401).json({
//       errors: error.issues?.map((issue: any) => issue.message) || [error.message],
//     });
//   }

// };
=======
// ── Login ─────────────────────────────────────────────────────────
export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Message generique sur echec de validation login — ne pas detailler
  // Dire "format email invalide" aide a confirmer que l'email n'existe pas
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(401).json({ message: "Identifiants incorrects" });
    return;
  }

  try {
    const { user, accessToken, refreshToken } = await loginUser(parsed.data, {
      ip:        req.ip,
      userAgent: req.headers["user-agent"] as string,
});

    // Tokens en cookies httpOnly — JAMAIS dans le body de la reponse
    // Un cookie httpOnly est inaccessible au JavaScript frontend
    // → si XSS, les tokens restent proteges
    res.cookie("access_token",  accessToken,  ACCESS_COOKIE_OPTIONS);
    res.cookie("refresh_token", refreshToken, REFRESH_COOKIE_OPTIONS);

    // Le body retourne uniquement les infos utilisateur
    res.status(200).json({
      message: "Connexion reussie",
      user,    // { id, email, role } — sans aucun token
    });
  } catch (error) {
    handleError(error, res, "loginController");
  }
};

// ── Refresh ───────────────────────────────────────────────────────
export const refreshController = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Le refresh token vient du cookie httpOnly — pas du body
  // Le dev avait mis refreshSchema.parse(req.body) — incorrect
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    res.status(401).json({ message: "Session expiree. Reconnectez-vous." });
    return;
  }

  try {
    const { accessToken } = await refreshTokenService(refreshToken);

    // Renouveler uniquement le access token
    res.cookie("access_token", accessToken, ACCESS_COOKIE_OPTIONS);

    res.status(200).json({ message: "Token renouvele avec succes" });
    // Le nouveau token est en cookie — pas dans le body
  } catch (error) {
    handleError(error, res, "refreshController");
  }
};

// ── Logout ────────────────────────────────────────────────────────
export const logoutController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken = req.cookies?.refresh_token;

  if (refreshToken) {
    await logoutUser(
      refreshToken,
      req.user?.id,                              // userId depuis le middleware verifyToken
      {
        ip:        req.ip,
        userAgent: req.headers["user-agent"] as string,
      }
    ).catch((err) => {
      console.error("[logoutController] Erreur suppression token:", err);
    });
  }

  res.clearCookie("access_token",  { path: "/",                 sameSite: "strict", httpOnly: true });
  res.clearCookie("refresh_token", { path: "/", sameSite: "strict", httpOnly: true });

  res.status(200).json({ message: "Deconnexion reussie" });
};
>>>>>>> 90ae145350d2bd1c6f4c3029f591473bfc107e39
