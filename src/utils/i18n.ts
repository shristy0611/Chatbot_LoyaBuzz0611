import { Translations } from '../types';

type Language = 'en' | 'ja';

export const translations: Record<Language, Translations> = {
  en: {
    welcome: 'Welcome to LoyaBuzz AI Chat',
    description: "I'm here to help you with any questions about LoyaBuzz's services and features.",
    startButton: 'Start Chat'
  },
  ja: {
    welcome: 'LoyaBuzz AIチャットへようこそ',
    description: 'LoyaBuzzのサービスと機能についてのご質問にお答えします。',
    startButton: 'チャットを始める'
  }
};

export const detectLanguage = (text: string): Language => {
  // Simple Japanese detection - checks for Japanese characters
  const hasJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf]/.test(text);
  return hasJapanese ? 'ja' : 'en';
};