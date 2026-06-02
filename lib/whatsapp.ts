export async function sendWhatsAppMessage(to: string, text: string): Promise<boolean> {
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const token = process.env.WHATSAPP_TOKEN;

  if (!phoneId || !token) {
    console.warn('WhatsApp environment variables are missing! Cannot send message to', to, 'content:', text);
    // Return true in local development to mock success if keys are missing
    return true;
  }

  try {
    // Standardize phone number format (e.g. remove plus sign and spaces)
    const cleanTo = to.replace(/[^0-9]/g, '');

    const res = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanTo,
        type: 'text',
        text: { preview_url: true, body: text },
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Failed to send WhatsApp message:', data);
      return false;
    }
    return true;
  } catch (error) {
    console.error('WhatsApp message send error:', error);
    return false;
  }
}
