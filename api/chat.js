module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      hasApiKey: !!process.env.GROQ_API_KEY,
      message: 'Chat API is running'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      console.error('GROQ_API_KEY not set. Available env vars:', Object.keys(process.env).filter(k => k.includes('GROQ') || k.includes('API') || k.includes('KEY')));
      return res.status(500).json({ error: 'API key not configured', code: 'MISSING_API_KEY' });
    }

    console.log('Processing chat message, API key length:', apiKey.length);

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
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

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('GROQ API failed:', groqResponse.status, errorText);
      return res.status(500).json({ 
        error: `GROQ API error: ${groqResponse.status}`,
        code: 'GROQ_API_ERROR',
        details: errorText.substring(0, 500)
      });
    }

    const data = await groqResponse.json();
    const reply = data?.choices?.[0]?.message?.content || 'No response generated';

    console.log('Chat response generated successfully');
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat API error:', error.message, error);
    return res.status(500).json({ 
      error: 'Server error: ' + error.message,
      code: 'SERVER_ERROR',
      type: error.name
    });
  }
}