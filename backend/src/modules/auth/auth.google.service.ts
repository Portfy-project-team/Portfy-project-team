// Service dédié à l'authentification Google via Supabase
// Gère la création/récupération du compte utilisateur local
import { prisma }       from "../../utils/prisma.js";
import { supabaseAdmin } from "../../utils/supabaseAdmin.js";
import { UserStatus }   from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt.js";

<<<<<<< HEAD

=======
// ── Types ──────────────────────────────────────────────────────────
interface GoogleCallbackMeta {
  ip?:       string;
  userAgent?: string;
}

// ── Vérification du token Supabase ────────────────────────────────
// Valide le token d'accès Supabase et retourne les infos utilisateur Google
export const verifySupabaseToken = async (supabaseAccessToken: string) => {
  const { data, error } = await supabaseAdmin.auth.getUser(supabaseAccessToken);

  if (error || !data.user) {
    const err: any = new Error("Token Supabase invalide ou expiré");
    err.statusCode = 401;
    throw err;
  }

  const { user } = data;

  // Vérification que le provider est bien Google
  const isGoogleProvider = user.app_metadata?.provider === "google" ||
    user.identities?.some((id: any) => id.provider === "google");

  if (!isGoogleProvider) {
    const err: any = new Error("Provider non autorisé");
    err.statusCode = 403;
    throw err;
  }

  return {
    googleId:  user.id,                              // UUID Supabase (lié à Google)
    email:     user.email!,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
    fullName:  user.user_metadata?.full_name  ?? null,
  };
};

// ── Connexion / Inscription via Google ───────────────────────────
// Crée le compte local si inexistant, sinon le récupère
// Retourne les tokens JWT de l'application (pas ceux de Supabase)
export const loginOrRegisterWithGoogle = async (
  supabaseAccessToken: string,
  meta?: GoogleCallbackMeta
) => {
  // 1. Vérifier et décoder le token Supabase
  const googleUser = await verifySupabaseToken(supabaseAccessToken);

  // 2. Chercher un utilisateur existant par googleId ou email
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        { googleId: googleUser.googleId },
        { email:    googleUser.email    },
      ],
    },
    select: {
      id:              true,
      email:           true,
      role:            true,
      googleId:        true,
      status:          true,
      isEmailVerified: true,
    },
  });

  if (user) {
    // ── Cas 1 : utilisateur existant ─────────────────────────────
    // Lier le compte Google si l'utilisateur s'était inscrit par email avant
    if (!user.googleId) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId:        googleUser.googleId,
          avatarUrl:       googleUser.avatarUrl,
          isEmailVerified: true, // Email Google = email vérifié
        },
      });
    }


    // ── Vérification du statut du compte via user.status ─────────
    // Le statut est géré directement par l'admin via PATCH /users/:id/status

    // Compte rejeté par l'administration
    if (user.status === UserStatus.REJECTED) {
      const err: any = new Error("Votre compte a été rejeté par l'administration");
      err.statusCode = 403;
      throw err;
    }

    // Compte bloqué par l'administration
    if (user.status === UserStatus.BLOCKED) {
      const err: any = new Error("Votre compte a été bloqué");
      err.statusCode = 403;
      throw err;
    }

    // Compte en attente de validation (PRO / PROF)
    // Pas de tokens générés — le frontend affiche un message d'attente
    if (user.status === UserStatus.PENDING) {
      return { pending: true, user: { id: user.id, email: user.email, role: user.role } };
    }

  } else {
    // ── Cas 2 : nouvel utilisateur via Google ────────────────────
    // Par défaut STUDENT — l'utilisateur peut changer de rôle après
    user = await prisma.user.create({
      data: {
        email:           googleUser.email,
        googleId:        googleUser.googleId,
        avatarUrl:       googleUser.avatarUrl,
        isEmailVerified: true,    // Pas besoin de vérification email
        role:            "STUDENT",
        status:          UserStatus.ACTIVE,
        student:         { create: {} },
        // password reste null — connexion uniquement via Google
      },
      select: {
        id:    true,
        email: true,
        role:  true,
        googleId: true,
        status:   true,
        isEmailVerified: true,
      },
    });
  }

  // 3. Générer les tokens JWT de l'application
  const accessToken  = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id });

  // 4. Persister le refresh token + log de connexion
  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        token:     refreshToken,
        userId:    user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.loginLog.create({
      data: {
        userId:    user.id,
        ip:        meta?.ip        ?? null,
        userAgent: meta?.userAgent ?? null,
        status:    "SUCCESS",
      },
    }),
  ]);

  return {
    user:  { id: user.id, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};
>>>>>>> b55639c3c3594a37b0b5769ecf641178b722675e

// Vérifie le token Supabase et retourne les infos Google
// Sans créer de compte — utilisé pour la première étape
export const verifyAndGetGoogleUser = async (supabaseAccessToken: string) => {
  const { data, error } = await supabaseAdmin.auth.getUser(supabaseAccessToken);

  if (error || !data.user) {
    const err: any = new Error("Token Supabase invalide ou expiré");
    err.statusCode = 401;
    throw err;
  }

  const { user } = data;

  const isGoogleProvider =
    user.app_metadata?.provider === "google" ||
    user.identities?.some((id: any) => id.provider === "google");

  if (!isGoogleProvider) {
    const err: any = new Error("Provider non autorisé");
    err.statusCode = 403;
    throw err;
  }

  return {
    googleId:  user.id,
    email:     user.email!,
    avatarUrl: user.user_metadata?.avatar_url ?? null,
  };
};

// Crée le compte après choix du rôle par l'utilisateur
// Appelé depuis /auth/google/complete-registration
export const completeGoogleRegistration = async (
  googleId:  string,
  email:     string,
  avatarUrl: string | null,
  role:      "STUDENT" | "PRO" | "PROF",
  meta?:     { ip?: string; userAgent?: string }
) => {
  // Vérifier que le compte n'existe pas déjà
  const existing = await prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
    select: { id: true, role: true, googleId: true },
  });

  if (existing) {
    // Compte existant — on le connecte directement
    return await loginExistingGoogleUser(existing.id, meta);
  }

  // Déterminer le statut selon le rôle choisi
  // STUDENT → ACTIVE directement
  // PRO / PROF → PENDING, en attente de validation Admin
  const status =
    role === "STUDENT" ? UserStatus.ACTIVE : UserStatus.PENDING;

  const user = await prisma.user.create({
    data: {
      email,
      googleId,
      avatarUrl,
      isEmailVerified: true,
      role,
      status,

      // Créer le profil lié selon le rôle
      ...(role === "STUDENT" && { student:        { create: {} } }),
      ...(role === "PRO"     && { professionnel:  { create: {} } }),
      ...(role === "PROF"    && { professeur:     { create: {} } }),
    },
    select: { id: true, email: true, role: true, status: true },
  });

  // Si PENDING → pas de tokens, juste retourner le statut
  if (user.status === UserStatus.PENDING) {
    return { pending: true, user };
  }

  // Si ACTIVE (STUDENT) → générer les tokens et connecter
  return await loginExistingGoogleUser(user.id, meta);
};

// ── Connexion d'un utilisateur Google existant ────────────────────
const loginExistingGoogleUser = async (
  userId: number,
  meta?:  { ip?: string; userAgent?: string }
) => {
  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { id: true, email: true, role: true, status: true },
  });

  if (!user) {
    const err: any = new Error("Utilisateur introuvable");
    err.statusCode = 404;
    throw err;
  }

  // Vérifier si PRO est toujours en attente
  if (user.role === "PRO" || user.role === "PROF") {
    if (user.status === UserStatus.PENDING) {
      return { pending: true, user };
    }
  }

  const accessToken  = generateAccessToken({ userId: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id });

  await prisma.$transaction([
    prisma.refreshToken.create({
      data: {
        token:     refreshToken,
        userId:    user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.loginLog.create({
      data: {
        userId:    user.id,
        ip:        meta?.ip        ?? null,
        userAgent: meta?.userAgent ?? null,
        status:    "SUCCESS",
      },
    }),
  ]);

  return {
    pending: false,
    user:    { id: user.id, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};
