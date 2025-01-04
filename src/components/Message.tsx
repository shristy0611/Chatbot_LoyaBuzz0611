import { Message as MessageType } from '../types';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  message: MessageType;
}

export function Message({ message }: MessageProps) {
  return (
    <div
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
  );
}