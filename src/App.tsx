import { useState, useEffect } from 'react';
import { Message } from './types';
import { ChatWindow } from './components/ChatWindow';
import { WelcomeScreen } from './components/WelcomeScreen';
import { v4 as uuidv4 } from 'uuid';

const translations = {
  welcome: "Welcome to LoyaBuzz AI Chat",
  description: "I'm here to help you with any questions about LoyaBuzz's services and features.",
  startButton: "Start Chat"
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Add initial system message
    if (messages.length === 0) {
      setMessages([
        {
          id: uuidv4(),
          text: "Hello! I'm LoyaBuzz's AI Assistant. How can I help you today?",
          sender: 'system',
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send to API
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          context: {}
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Add bot response
      const botMessage: Message = {
        id: uuidv4(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      {showWelcome ? (
        <WelcomeScreen 
          translations={translations} 
          onStart={() => setShowWelcome(false)} 
        />
      ) : (
        <ChatWindow 
          messages={messages} 
          onSendMessage={handleSendMessage} 
        />
      )}
    </div>
  );
}

export default App;