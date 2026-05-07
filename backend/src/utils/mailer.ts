import nodemailer from "nodemailer";

// Vérification fail-fast — le serveur refuse de démarrer sans config mail
const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_FROM = process.env.MAIL_FROM ?? "Portfy <no-reply@portfy.ma>";

if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) {
  throw new Error("CRITICAL: Configuration SMTP manquante dans les variables d'environnement.");
}

// Le transporter est créé UNE seule fois au démarrage
// et réutilisé pour tous les emails — pas besoin de recréer à chaque appel
const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: Number(MAIL_PORT),
  // false pour Mailtrap (port 587 = STARTTLS)
  // true si port 465 (SSL direct) en production
  secure: Number(MAIL_PORT) === 465,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

// Interface claire pour les paramètres d'envoi
interface SendEmailOptions {
  to:      string;
  subject: string;
  html:    string;
}

// Fonction principale — appelée par les services qui ont besoin d'envoyer un mail
export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  await transporter.sendMail({
    from:    MAIL_FROM,
    to:      options.to,
    subject: options.subject,
    html:    options.html,
  });
};

// Templates email — centralisés ici pour faciliter la maintenance
// Si tu veux changer le design de tous les emails → un seul endroit
export const emailTemplates = {

  // Template reset password
  resetPassword: (resetLink: string) => ({
    subject: "Réinitialisation de votre mot de passe — Portfy",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé à réinitialiser votre mot de passe sur <strong>Portfy</strong>.</p>
        <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
        <a 
          href="${resetLink}" 
          style="
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            margin: 16px 0;
          "
        >
          Réinitialiser mon mot de passe
        </a>
        <p style="color: #6b7280; font-size: 14px;">
          Ce lien est valable <strong>1 heure</strong>. 
          Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">Portfy — Plateforme de portfolios académiques certifiés</p>
      </div>
    `,
  }),
  verifyEmail: (verifyLink: string) => ({
    subject: "Vérifiez votre email — Portfy",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Vérification de votre email</h2>
        <p>Bienvenue sur <strong>Portfy</strong> ! Cliquez ci-dessous pour vérifier votre email :</p>
        <a 
          href="${verifyLink}" 
          style="
            display: inline-block;
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            margin: 16px 0;
          "
        >
          Vérifier mon email
        </a>
        <p style="color: #6b7280; font-size: 14px;">
          Ce lien est valable <strong>24 heures</strong>.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">Portfy — Plateforme de portfolios académiques certifiés</p>
      </div>
    `,
  }),
};
