import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';
import { BaseAgent, Message } from './base';
import { GeneralAgent } from './general';
import { SalesAgent } from './sales';
import { SupportAgent } from './support';
import { MarketingAgent } from './marketing';
import WebScraper from '../utils/webscraper';

interface RoutingResponse {
  agent: 'sales' | 'support' | 'marketing' | 'general';
  confidence: number;
  explanation: string;
}

interface ChatResponse {
  systemMessage?: string;
  agentName: string;
  message: string;
}

export class RouterAgent extends BaseAgent {
  private agents = {
    sales: new SalesAgent(),
    support: new SupportAgent(),
    marketing: new MarketingAgent(),
    general: new GeneralAgent()
  };

  private getAgentDisplayName(agent: string): string {
    switch (agent) {
      case 'sales':
        return 'Sales AI Assistant';
      case 'support':
        return 'Support AI Assistant';
      case 'marketing':
        return 'Marketing AI Assistant';
      default:
        return 'General AI Assistant';
    }
  }

  protected async getSystemPrompt(): Promise<string> {
    return `You are LoyaBuzz Router AI. Your role is to analyze user queries and route them to the most appropriate specialist AI assistant.

Specialist AIs:
1. Sales AI Assistant
   - Handles: pricing, plans, features, comparisons, payment methods
   - Example queries:
     * "What are your pricing plans?"
     * "What features do you offer?"
     * "How much does it cost?"

2. Support AI Assistant
   - Handles: technical issues, how-to questions, troubleshooting, transaction tracking, rewards
   - Example queries:
     * "How do I scan a QR code?"
     * "My transaction isn't showing up"
     * "How do I redeem rewards?"
     * "Why isn't my cashback tracked?"

3. Marketing AI Assistant
   - Handles: business benefits, growth opportunities, partnerships, merchant relations
   - Example queries:
     * "How can LoyaBuzz help my business grow?"
     * "What are the benefits for merchants?"
     * "How do I partner with LoyaBuzz?"

4. General AI Assistant
   - Handles: general information, overview, basic questions
   - Example queries:
     * "What is LoyaBuzz?"
     * "How does LoyaBuzz work?"
     * "Tell me about LoyaBuzz"

Response Format:
{
  "agent": "sales|support|marketing|general",
  "confidence": 0.0-1.0,
  "explanation": "Brief reason for selection"
}`;
  }

  protected async getInitialMessages(): Promise<Message[]> {
    return [];
  }

  async routeQuery(
    message: string,
    context: any,
    gemini: GoogleGenerativeAI,
    groq: Groq
  ): Promise<ChatResponse> {
    try {
      const routingResponse = await this.handleQuery(message, context, gemini, groq);
      
      try {
        const routing = JSON.parse(routingResponse) as RoutingResponse;
        const selectedAgent = this.agents[routing.agent];
        const agentName = this.getAgentDisplayName(routing.agent);
        
        if (!selectedAgent) {
          console.error('Invalid agent selected:', routing);
          const response = await this.agents.general.handleQuery(message, context, gemini, groq);
          return {
            systemMessage: '🔄 Routing to General AI Assistant...',
            agentName: 'General AI Assistant',
            message: response
          };
        }

        const response = await selectedAgent.handleQuery(message, context, gemini, groq);
        return {
          systemMessage: `🔄 Transferring to ${agentName}...`,
          agentName,
          message: response
        };
      } catch (parseError) {
        console.error('Error parsing routing response:', parseError);
        const response = await this.agents.general.handleQuery(message, context, gemini, groq);
        return {
          systemMessage: '🔄 Routing to General AI Assistant...',
          agentName: 'General AI Assistant',
          message: response
        };
      }
    } catch (error) {
      console.error('Error in router:', error);
      return {
        agentName: 'System',
        message: 'I apologize, but I am experiencing technical difficulties. Please try again later.'
      };
    }
  }
} 