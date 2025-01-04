export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}

export type Language = 'en' | 'ja';

export interface Translations {
  welcome: string;
  description: string;
  startButton: string;
}