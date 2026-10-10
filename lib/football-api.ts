// Brevo Email Alert Utility
export async function sendEmailAlert(
  toEmail: string,
  toName: string,
  subject: string,
  textContent: string,
  htmlContent: string
): Promise<boolean> {
  const brevoKey = process.env.BREVO_API_KEY;

  if (!brevoKey) {
    console.warn('Brevo API key is missing! Cannot send email to', toEmail, 'content:', textContent);
    return true; // Simulate success in local dev
  }

  try {
    console.log(`[Brevo] Sending email to ${toEmail}...`);
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'FIFA 2026 Fan Club',
          email: process.env.BREVO_SENDER_EMAIL || 'alerts@world-cup-fan-site.vercel.app',
        },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        textContent: textContent,
        htmlContent: htmlContent,
      }),
    });

    const data = await res.json();
    console.log(`[Brevo] Response status: ${res.status}`, data);
    if (!res.ok) {
      console.error('Brevo API error:', data);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error sending Brevo email:', error);
    return false;
  }
}
