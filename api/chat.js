export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2-70b-4096',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful pediatric clinical assistant. Provide safe, accurate, and concise responses about baby care, vital signs monitoring, and when to seek medical help. Always emphasize the importance of consulting with a healthcare provider for serious concerns.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GROQ API error:', errorData);
      return res.status(response.status).json({ error: 'Failed to get response from AI' });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'No response generated';

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat handler error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}