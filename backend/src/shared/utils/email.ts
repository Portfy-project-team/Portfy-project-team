// src/shared/utlis/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'onboarding@resend.dev';

export const sendInviteEmail = async (email: string, inviteToken: string, role: string) => {
  const inviteUrl = `${process.env.CLIENT_URL}/accept-invite?token=${inviteToken}`;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `You've been invited as ${role}`,
    html: `<p>Click <a href="${inviteUrl}">here</a> to accept the invite.</p>`,
  });
};

// 4. إشعار بالموافقة
export const sendApprovalEmail = async (email: string, name: string) => {
const loginUrl = `${process.env.CLIENT_URL}/login`;

await resend.emails.send({
  from: FROM_EMAIL,
  to: email,
  subject: 'Your account has been approved',
  html: `
    <div style="font-family: Arial">
      <h2>Hello ${name ?? "User"} </h2>
      <p>Your account has been approved.</p>
      <p>
         Click here to login:
        <a href="${loginUrl}">${loginUrl}</a>
      </p>
    </div>
  `,
});
};

export const sendRejectionEmail = async (email: string, name: string, reason?: string) => {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Account status update',
    html: `<p>Hello ${name}, your account was not approved. ${reason ? `Reason: ${reason}` : ''}</p>`,
  });
};