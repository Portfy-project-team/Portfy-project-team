import { Resend } from 'resend';

// ── INITIALISATION ──────────────────────────────
const isTest = process.env.NODE_ENV === "test";
const resend = !isTest ? new Resend(process.env.RESEND_API_KEY) : null;
// const resend = new Resend(process.env.RESEND_API_KEY);
// const FROM_EMAIL = process.env.MAIL_FROM ?? 'onboarding@resend.dev';
const FROM_EMAIL = process.env.MAIL_FROM ?? "onboarding@resend.dev";
// ── HELPERS ─────────────────────────────────────
const getClientUrl = (): string => {
  const url = process.env.FRONTEND_URL;
  if (!url) throw new Error("CLIENT_URL is not defined");
  return url;
};

// ── EMAILS ──────────────────────────────────────
export const sendApprovalEmail = async (email: string, name: string): Promise<void> => {
  // Guard : en mode test, resend est null → on sort immédiatement
  if (isTest || !resend) return;
  const loginUrl = `${getClientUrl()}/login`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Your account has been approved',
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: auto;">
        <h2>Hello ${name}</h2>
        <p>Your account has been approved. You can now access the platform.</p>
        <a href="${loginUrl}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4F46E5;
          color: white;
          border-radius: 6px;
          text-decoration: none;
        ">Login to your account</a>
      </div>
    `,
  });
};

export const sendRejectionEmail = async (email: string, name: string, reason?: string): Promise<void> => {
  // Guard : en mode test, resend est null → on sort immédiatement
  if (isTest || !resend) return;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Account status update',
    html: `
      <div style="font-family: Arial; max-width: 600px; margin: auto;">
        <h2>Hello ${name}</h2>
        <p>Unfortunately, your account request has not been approved.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>If you have any questions, please contact support.</p>
      </div>
    `,
  });
};