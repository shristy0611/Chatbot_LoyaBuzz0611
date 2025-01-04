import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';
import { RouterAgent } from './agents/router';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize AI clients
const gemini = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
const groq = new Groq({ apiKey: process.env.VITE_GROQ_API_KEY || '' });

// Initialize router
const router = new RouterAgent();

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await router.routeQuery(message, context || {}, gemini, groq);
    res.json(response);
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ 
      agentName: 'System',
      message: 'Internal server error'
    });
  }
});

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ status: 'ok' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('\n🚀 Server is ready!');
  console.log(`Local URL: http://localhost:${port}`);
  console.log('\nAPI Endpoints:');
  console.log('- POST /api/chat');
  console.log('  Request body: { "message": "string", "context": object }');
  console.log('\n- GET /health');
  console.log('  Health check endpoint');
  console.log('\nPress Ctrl+C to stop the server.');
}); 