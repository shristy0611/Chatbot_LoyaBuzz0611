class ChatWidget {
  constructor() {
    this.isOpen = false;
    this.isLoading = false;
    this.messages = [];
    this.createWidget();
    this.attachEventListeners();
  }

  createWidget() {
    const widget = document.createElement('div');
    widget.id = 'loyabuzz-chat-widget';
    widget.innerHTML = `
      <div class="chat-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <div class="chat-window">
        <div class="chat-header">
          <h3>LoyaBuzz Assistant</h3>
          <button class="minimize-button">-</button>
        </div>
        <div class="chat-messages">
          <div class="message bot">
            <div class="message-sender">LoyaBuzz AI Assistant</div>
            <div class="message-content">Hello! I'm here to help you with any questions about LoyaBuzz. How can I assist you today?</div>
          </div>
        </div>
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="chat-input">
          <input type="text" placeholder="Type your message..." />
          <button>Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(widget);
  }

  attachEventListeners() {
    const chatButton = document.querySelector('.chat-button');
    const minimizeButton = document.querySelector('.minimize-button');
    const chatWindow = document.querySelector('.chat-window');
    const input = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');

    chatButton.addEventListener('click', () => this.toggleChat());
    minimizeButton.addEventListener('click', () => this.toggleChat());
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
    
    sendButton.addEventListener('click', () => this.sendMessage());
  }

  toggleChat() {
    const chatWindow = document.querySelector('.chat-window');
    this.isOpen = !this.isOpen;
    chatWindow.classList.toggle('open', this.isOpen);
    if (this.isOpen) {
      document.querySelector('.chat-input input').focus();
    }
  }

  async sendMessage() {
    const input = document.querySelector('.chat-input input');
    const message = input.value.trim();
    
    if (!message || this.isLoading) return;
    
    input.value = '';
    this.addMessage('user', message);
    this.setLoading(true);

    try {
      const API_ENDPOINT = window.LOYABUZZ_API_ENDPOINT || 'http://localhost:3000';
      const response = await fetch(`${API_ENDPOINT}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: {}
        }),
      });

      const data = await response.json();
      
      if (data.systemMessage) {
        this.addMessage('system', data.systemMessage);
      }
      
      if (data.message) {
        this.addMessage('bot', data.message, data.agentName);
      }
    } catch (error) {
      console.error('Error:', error);
      this.addMessage('system', 'Sorry, I encountered an error. Please try again.');
    }

    this.setLoading(false);
  }

  addMessage(type, content, sender = '') {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    let messageHTML = '';
    if (type === 'bot' && sender) {
      messageHTML += `<div class="message-sender">${sender}</div>`;
    }
    messageHTML += `<div class="message-content">${content}</div>`;
    
    messageDiv.innerHTML = messageHTML;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  setLoading(loading) {
    this.isLoading = loading;
    const typingIndicator = document.querySelector('.typing-indicator');
    typingIndicator.classList.toggle('visible', loading);
  }
}

// Initialize the chat widget
new ChatWidget(); 