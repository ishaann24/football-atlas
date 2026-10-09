import { NextResponse } from 'next/server';
import { askClaude } from '@/lib/claude';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

// 1. Webhook Verification (GET Request)
// Required by Meta WhatsApp Cloud API to authorize the webhook endpoint
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // A verification token of your choosing, configured in the Meta developer portal
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'fifa2026_webhook_verify';

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('[Webhook] Verification successful!');
        return new Response(challenge, { status: 200 });
      } else {
        console.warn('[Webhook] Verification failed! Token mismatch.');
        return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
      }
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('[Webhook] GET verification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. Message Event Receiver (POST Request)
// Receives incoming fan replies, routes them to Claude AI, and replies back
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Check if the payload is a valid WhatsApp message event
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message) {
        const from = message.from; // User's WhatsApp ID/number
        const textBody = message.text?.body; // User's text message
        const messageId = message.id;

        console.log(`[Webhook] Received message from ${from}: "${textBody}"`);

        if (textBody) {
          // Route the query to Anthropic Claude AI
          const chatbotReply = await askClaude(textBody);

          console.log(`[Webhook] Claude Chatbot Reply: "${chatbotReply}"`);

          // Send the response back to the user via WhatsApp
          await sendWhatsAppMessage(from, chatbotReply);
        }
      }

      // Meta requires a 200 OK response to avoid resending the event
      return NextResponse.json({ success: true, status: 'EVENT_RECEIVED' });
    }

    // Return 404 if the event is not a standard WhatsApp account event
    return NextResponse.json({ error: 'Not a WhatsApp Event' }, { status: 404 });
  } catch (error: any) {
    console.error('[Webhook] POST event handler failed:', error);
    // Always return 200 to prevent Meta from retrying and flooding the server on errors
    return NextResponse.json({ error: error.message, status: 'FAILED' }, { status: 200 });
  }
}
