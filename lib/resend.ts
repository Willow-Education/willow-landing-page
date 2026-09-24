import { Resend } from "resend";

const NOTIFY_EMAIL = "james@willowed.org";
const FROM_EMAIL = "notifications@willowed.org";

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendFormNotification({
  formName,
  data,
}: {
  formName: string;
  data: Record<string, string | null | undefined>;
}) {
  const resend = getResendClient();

  if (!resend) {
    console.log(`Resend not configured. Would have sent ${formName} notification:`, data);
    return { success: true, mock: true };
  }

  const dataRows = Object.entries(data)
    .filter(([, value]) => value != null)
    .map(([key, value]) => `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${escapeHtml(key)}</td><td style="padding: 8px; border: 1px solid #ddd; white-space: pre-wrap;">${escapeHtml(value as string)}</td></tr>`)
    .join("");

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New ${formName} Submission`,
      html: `
        <h2>New ${formName} Submission</h2>
        <p>A new form submission was received:</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          ${dataRows}
        </table>
        <p style="color: #666; margin-top: 20px; font-size: 12px;">
          Submitted at ${new Date().toLocaleString()}
        </p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to send email:", err);
    return { success: false, error: err };
  }
}
