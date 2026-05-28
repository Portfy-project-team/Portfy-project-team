import type { Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validation.js";
import {
  registerUser,
  loginUser,
  refreshTokenService,
  logoutUser,
  verifyEmailService,
  sendVerificationEmail,
  resendVerificationEmail,
  forgotPasswordService,
  resetPasswordService} from "./auth.service.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";
import { completeGoogleRegistration, loginOrRegisterWithGoogle, verifyAndGetGoogleUser } from "./auth.google.service.js";
import { prisma } from "../../utils/prisma.js";

const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge:   15 * 60 * 1000,
  path:     "/",
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge:   7 * 24 * 60 * 60 * 1000,
  path:     "/",
};

const KNOWN_ERRORS: Record<string, number> = {
  "Inscription impossible":                                409,
  "Identifiants incorrects":                               401,
  "Token invalide":                                        401,
  "Session expiree. Reconnectez-vous.":                    401,
  "Compte en attente de validation par un administrateur": 403,
  "Veuillez vérifier votre email avant de vous connecter": 403,
  "Token invalide ou expiré":                              400,
};

function handleError(error: unknown, res: Response, context: string): void {
  if (error instanceof Error) {
    const status = KNOWN_ERRORS[error.message];
    if (status) {
      res.status(status).json({ message: error.message });
      return;
    }
  }
  console.error(`[${context}]`, error);
  res.status(500).json({ message: "Une erreur est survenue" });
}

// ── Register ──────────────────────────────────────────────────────
export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  // const data = req.body
  // console.log(data)
  // // const parsed = registerSchema.safeParse(data.data);
  // const parsed = registerSchema.safeParse(req.body?.data ?? req.body); // ← CORRECT

   const body = req.body?.data ?? req.body;
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Donnees invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    const user = await registerUser(parsed.data);
    console.log(user)

  sendVerificationEmail(user.id, user.email).catch((err) => {
      console.error("[registerController] Echec envoi email:", err);
    });

    res.status(201).json({
      success : true,
      message: "Compte créé avec succès. Vérifiez votre email pour activer votre compte.",
      user,
    });
  } catch (error) {
    handleError(error, res, "registerController");
  }
};

// ── Login ─────────────────────────────────────────────────────────
export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
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

    res.cookie("access_token",  accessToken,  ACCESS_COOKIE_OPTIONS);
    res.cookie("refresh_token", refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      message: "Connexion reussie",
      user,
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
  const refreshToken = req.cookies?.refresh_token;

  if (!refreshToken) {
    res.status(401).json({ message: "Session expiree. Reconnectez-vous." });
    return;
  }

  try {
    const { accessToken } = await refreshTokenService(refreshToken);
    res.cookie("access_token", accessToken, ACCESS_COOKIE_OPTIONS);
    res.status(200).json({ message: "Token renouvele avec succes" });
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
    await logoutUser(refreshToken, req.user?.id, {
      ip:        req.ip,
      userAgent: req.headers["user-agent"] as string,
    }).catch((err) => {
      console.error("[logoutController] Erreur:", err);
    });
  }

  res.clearCookie("access_token",  { httpOnly: true, sameSite: "strict", path: "/" });
  res.clearCookie("refresh_token", { httpOnly: true, sameSite: "strict", path: "/" });

  res.status(200).json({ message: "Deconnexion reussie" });
};

// ── Verify Email ──────────────────────────────────────────────────
export const verifyEmailController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    res.status(400).json({ message: "Token manquant" });
    return;
  }

  try {
    await verifyEmailService(token);
    res.status(200).json({
      message: "Email vérifié avec succès. Vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    handleError(error, res, "verifyEmailController");
  }
};

// ── Resend Verification ───────────────────────────────────────────
export const resendVerificationController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    res.status(400).json({ message: "Email requis" });
    return;
  }

  try {
    await resendVerificationEmail(email.trim().toLowerCase());
    res.status(200).json({
      message: "Si cet email est enregistré et non vérifié, un nouveau lien vous a été envoyé.",
    });
  } catch (error) {
    handleError(error, res, "resendVerificationController");
  }
};

// ── Forgot Password ───────────────────────────────────────────────
export const forgotPasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = forgotPasswordSchema.safeParse(req.body);

  // Réponse identique que la validation échoue ou non
  // Ne pas révéler si l'email est enregistré
  if (!parsed.success) {
    res.status(200).json({
      message: "Si cet email est enregistré, un lien de réinitialisation a été envoyé.",
    });
    return;
  }

  try {
    await forgotPasswordService(parsed.data.email);
    res.status(200).json({
      message: "Si cet email est enregistré, un lien de réinitialisation a été envoyé.",
    });
  } catch (error) {
    handleError(error, res, "forgotPasswordController");
  }
};

// ── Reset Password ────────────────────────────────────────────────
export const resetPasswordController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsed = resetPasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: "Donnees invalides",
      errors:  parsed.error.flatten().fieldErrors,
    });
    return;
  }

  try {
    await resetPasswordService(parsed.data.token, parsed.data.password);
    res.status(200).json({
      message: "Mot de passe réinitialisé avec succès. Veuillez vous reconnecter.",
    });
  } catch (error) {
    handleError(error, res, "resetPasswordController");
  }
};



// ── Google OAuth Callback ─────────────────────────────────────────
export const googleCallbackController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { supabaseAccessToken } = req.body;

  if (!supabaseAccessToken || typeof supabaseAccessToken !== "string") {
    res.status(400).json({ message: "Token Supabase manquant" });
    return;
  }

  try {
    const { user, accessToken, refreshToken } =
      await loginOrRegisterWithGoogle(supabaseAccessToken, {
        ip:        req.ip,
        userAgent: req.headers["user-agent"] as string,
      });

    res.cookie("access_token",  accessToken,  ACCESS_COOKIE_OPTIONS);
    res.cookie("refresh_token", refreshToken, REFRESH_COOKIE_OPTIONS);

    res.status(200).json({
      message: "Connexion Google réussie",
      user,
    });
  } catch (error) {
    handleError(error, res, "googleCallbackController");
  }
};

// ── Étape 1 : Vérifier token Google ──────────────────────────────
// Vérifie le token Supabase et retourne si c'est un nouvel utilisateur
export const googleVerifyController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { supabaseAccessToken } = req.body;

  if (!supabaseAccessToken || typeof supabaseAccessToken !== "string") {
    res.status(400).json({ message: "Token Supabase manquant" });
    return;
  }

  try {
    const googleUser = await verifyAndGetGoogleUser(supabaseAccessToken);

    // Vérifier si l'utilisateur existe déjà en DB
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: googleUser.googleId },
          { email:    googleUser.email    },
        ],
      },
      select: { id: true, role: true, status: true },
    });

    if (existing) {
      // Utilisateur existant — connexion directe
      const result = await completeGoogleRegistration(
        googleUser.googleId,
        googleUser.email,
        googleUser.avatarUrl,
        existing.role as "STUDENT" | "PRO" | "PROF",
        { ip: req.ip, userAgent: req.headers["user-agent"] as string }
      );

      if (result.pending) {
        res.status(200).json({ status: "PENDING", user: result.user });
        return;
      }

      res.cookie("access_token",  result.accessToken!,  ACCESS_COOKIE_OPTIONS);
      res.cookie("refresh_token", result.refreshToken!, REFRESH_COOKIE_OPTIONS);
      res.status(200).json({ status: "OK", user: result.user });
      return;
    }

    // Nouvel utilisateur — retourner les infos pour la page de sélection du rôle
    res.status(200).json({
      status:    "NEW_USER",
      googleId:  googleUser.googleId,
      email:     googleUser.email,
      avatarUrl: googleUser.avatarUrl,
    });
  } catch (error) {
    handleError(error, res, "googleVerifyController");
  }
};

// ── Étape 2 : Compléter l'inscription ────────────────────────────
// Reçoit le rôle choisi et crée le compte
export const googleCompleteController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { googleId, email, avatarUrl, role, supabaseAccessToken } = req.body;

  // Validation du rôle — ADMIN ne peut pas s'inscrire via Google
  const allowedRoles = ["STUDENT", "PRO", "PROF"];
  if (!role || !allowedRoles.includes(role)) {
    res.status(400).json({ message: "Rôle invalide" });
    return;
  }

  // Re-vérifier le token Supabase pour sécurité
  if (!supabaseAccessToken || typeof supabaseAccessToken !== "string") {
    res.status(400).json({ message: "Token Supabase manquant" });
    return;
  }

  try {
    // Vérification que le token correspond bien au googleId envoyé
    const googleUser = await verifyAndGetGoogleUser(supabaseAccessToken);
    if (googleUser.googleId !== googleId || googleUser.email !== email) {
      res.status(403).json({ message: "Données invalides" });
      return;
    }

    const result = await completeGoogleRegistration(
      googleId,
      email,
      avatarUrl,
      role,
      { ip: req.ip, userAgent: req.headers["user-agent"] as string }
    );

    if (result.pending) {
      res.status(200).json({
        status:  "PENDING",
        message: "Compte en attente de validation par un administrateur",
        user:    result.user,
      });
      return;
    }

    res.cookie("access_token",  result.accessToken!,  ACCESS_COOKIE_OPTIONS);
    res.cookie("refresh_token", result.refreshToken!, REFRESH_COOKIE_OPTIONS);
    res.status(200).json({ status: "OK", user: result.user });
  } catch (error) {
    handleError(error, res, "googleCompleteController");
  }
};