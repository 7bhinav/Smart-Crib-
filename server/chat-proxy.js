const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY not set. Proxy will return fallback responses.');
}

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body || {};
  if (!OPENAI_API_KEY) {
    return res.status(503).json({ error: 'OpenAI API key not configured on server.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 400,
        temperature: 0.2
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Chat proxy error', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Chat proxy server running on port ${port}`));
