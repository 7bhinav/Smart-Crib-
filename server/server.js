import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('Processing chat message:', message.substring(0, 50) + '...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GROQ API error:', errorData);
      return res.status(response.status).json({ error: 'Failed to get response from AI', details: errorData });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || 'No response generated';

    console.log('Chat response generated successfully');
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat handler error:', error);
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Chat API available at http://localhost:${PORT}/api/chat`);
  console.log(`✅ Health check at http://localhost:${PORT}/health`);
});
