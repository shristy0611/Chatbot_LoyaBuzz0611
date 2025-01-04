import { useState } from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
}

export function ChatWindow({ messages, onSendMessage }: ChatWindowProps) {
  const [inputText, setInputText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    await onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.sender === 'system'
                  ? 'bg-gray-300 text-gray-700'
                  : 'bg-white text-gray-800'
              }`}
            >
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2">{children}</p>,
                  code: ({ className, children }) => (
                    <code className={`${className} bg-gray-100 rounded px-1`}>
                      {children}
                    </code>
                  ),
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}