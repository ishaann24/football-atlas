export async function askClaude(message: string, history: { role: 'user' | 'assistant'; content: string }[] = []): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('Anthropic API key is missing! Claude chatbot is operating in offline demo mode.');
    return 'Hey there! I am your FIFA 2026 Assistant. Currently, I am running in demo mode, but ask me anything about the fixtures or standings once my API key is configured!';
  }

  try {
    const systemPrompt = 'You are a FIFA World Cup 2026 assistant. Answer fan questions about matches, scores, lineups, and standings. Be short and friendly.';

    const formattedMessages = [
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: message },
    ];

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022', // Standard Claude 3.5 Sonnet identifier
        max_tokens: 500,
        system: systemPrompt,
        messages: formattedMessages,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Anthropic API error:', data);
      return 'Sorry, I encountered an issue accessing my brain. Please try again soon!';
    }

    return data.content[0]?.text || 'I am not sure how to answer that.';
  } catch (error) {
    console.error('Claude API call failed:', error);
    return 'I had trouble connecting to the network. Let’s try again in a bit!';
  }
}
