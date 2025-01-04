import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';
import { routeQuery } from './agents/router';
import { handleSalesQuery } from './agents/sales';
import { handleSupportQuery } from './agents/support';
import { handleMarketingQuery } from './agents/marketing';
import { handleGeneralQuery } from './agents/general';

// Load environment variables
dotenv.config();

// Initialize AI clients
const gemini = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
const groq = new Groq({ apiKey: process.env.VITE_GROQ_API_KEY || '' });

async function runTests() {
  const testCases = [
    {
      message: "What are your pricing plans for small businesses?",
      expectedType: "sales"
    },
    {
      message: "How do I scan a QR code to get cashback?",
      expectedType: "support"
    },
    {
      message: "How can LoyaBuzz help me grow my business?",
      expectedType: "marketing"
    },
    {
      message: "What is LoyaBuzz?",
      expectedType: "general"
    }
  ];

  console.log('Starting tests...\n');

  for (const test of testCases) {
    console.log(`Testing: "${test.message}"`);
    
    try {
      // Get routing decision
      const routing = await routeQuery(test.message, {}, gemini, groq);
      console.log(`Routed to: ${routing.specialist} (Expected: ${test.expectedType})`);
      console.log(`Confidence: ${routing.confidence}`);
      console.log(`Transfer message: ${routing.message}`);
      
      // Get specialist response
      let response: string;
      switch (routing.specialist) {
        case 'sales':
          response = await handleSalesQuery(test.message, {}, gemini, groq);
          break;
        case 'support':
          response = await handleSupportQuery(test.message, {}, gemini, groq);
          break;
        case 'marketing':
          response = await handleMarketingQuery(test.message, {}, gemini, groq);
          break;
        default:
          response = await handleGeneralQuery(test.message, {}, gemini, groq);
      }
      
      console.log('Response:', response);
      console.log('-'.repeat(80), '\n');
    } catch (error) {
      console.error(`Error testing "${test.message}":`, error);
    }
  }
}

runTests().catch(console.error); 