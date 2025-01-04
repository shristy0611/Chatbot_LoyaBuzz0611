import { GoogleGenerativeAI } from '@google/generative-ai';
import { Groq } from 'groq-sdk';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export abstract class BaseAgent {
  protected abstract getSystemPrompt(): Promise<string>;
  protected abstract getInitialMessages(): Promise<Message[]>;

  public async handleQuery(
    message: string,
    context: any,
    gemini: GoogleGenerativeAI,
    groq: Groq
  ): Promise<string> {
    try {
      const systemPrompt = await this.getSystemPrompt();
      const initialMessages = await this.getInitialMessages();
      
      // Enhanced prompt with better guidance
      const enhancedPrompt = `${systemPrompt}

RESPONSE GUIDELINES:
1. ALWAYS check the scraped content thoroughly before saying information is not available
2. If information is partially available, provide what you know and be specific about what's missing
3. Instead of redirecting to website, say "For additional details about [specific topic], please contact our support team."
4. Keep responses focused on the specific question asked
5. Use clear, direct language without marketing speak
6. Format information in an easy-to-read way
7. If suggesting contact support, explain why: "Since this involves [reason], please contact our support team."

Example good responses:
"The BasicBuzzer plan costs $19.99/month and includes unlimited branches."
"While I can confirm we have a mobile app, the download links are not currently in our system. Please contact our support team for download instructions."

Example bad responses:
"Visit our website for more information..."
"According to loyabuzz.com..."
"This information is not available, please contact support."`;

      // Try with Gemini first
      const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
      
      try {
        const result = await model.generateContent([
          enhancedPrompt,
          ...initialMessages.map(m => m.content),
          `Previous context: ${JSON.stringify(context)}\nUser: ${message}`
        ]);
        
        return result.response.text();
      } catch (geminiError) {
        console.error('Gemini error, falling back to Groq:', geminiError);
        
        // Fallback to Groq
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: enhancedPrompt },
            ...initialMessages,
            { role: 'user', content: `Previous context: ${JSON.stringify(context)}\nUser: ${message}` }
          ],
          model: 'mixtral-8x7b-32768',
          temperature: 0.7,
          max_tokens: 800,
        });
        
        return completion.choices[0]?.message?.content || 'I apologize, but I am unable to process your request at the moment.';
      }
    } catch (error) {
      console.error('Error in agent:', error);
      return 'I apologize, but I am experiencing technical difficulties. Please try again later.';
    }
  }
} 