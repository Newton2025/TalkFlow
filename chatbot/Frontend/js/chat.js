let currentMessages = [];
let isWaitingForResponse = false;

// Enable/disable send button
messageInput.addEventListener('input', () => {
  sendButton.disabled = !messageInput.value.trim() || isWaitingForResponse;
});

// Send on Enter (without shift)
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Simplified auto-resize that maintains button position
messageInput.addEventListener('input', function() {
  // Auto-resize the textarea
  this.style.height = 'auto';
  const newHeight = Math.min(Math.max(this.scrollHeight, 40), 120); 
  this.style.height = newHeight + 'px';
  
  // Position the button appropriately based on textarea height
  const button = document.getElementById('sendButton');
  if (newHeight > 50) {
    button.style.top = '20px'; 
    button.style.transform = 'none';
  } else {
    button.style.top = '50%';
    button.style.transform = 'translateY(-50%)';
  }
});

// Send message
sendButton.addEventListener('click', sendMessage);

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text || isWaitingForResponse) return;

  // Add user message to UI
  addMessage(text, 'user');

  // Clear input and disable send button
  messageInput.value = '';
  messageInput.style.height = 'auto';
  isWaitingForResponse = true;
  sendButton.disabled = true;
  messageInput.focus();

  // Show typing indicator
  showTypingIndicator();

  try {
    // Call Gemini API
    const response = await apiService.sendMessage(text);
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Add bot response to UI
    addMessage(response, 'bot');
  } catch (error) {
    // Remove typing indicator
    removeTypingIndicator();
    
    // Add error message
    addMessage("Sorry, I encountered an error. Please try again later.", "bot");
    console.error('API error:', error);
  } finally {
    isWaitingForResponse = false;
    sendButton.disabled = !messageInput.value.trim();
  }
}

function addMessage(text, sender) {
  // If this is the first user message, remove the center logo
  if (currentMessages.length === 0) {
    centerLogo.classList.add('hidden');
  }

  currentMessages.push({ text, sender });

  // Create a bubble
  const bubble = document.createElement('div');
  bubble.classList.add(
    'max-w-[70%]',
    'px-4',
    'py-2',
    'rounded-xl',
    'mb-2',
    'break-words'
  );
  if (sender === 'user') {
    bubble.classList.add('bg-blue-500', 'text-white', 'ml-auto');
  } else {
    bubble.classList.add('bg-gray-200', 'text-gray-800', 'mr-auto');
  }
  
  // Add formatted text with line breaks preserved
  const formattedText = formatMessageText(text);
  bubble.innerHTML = formattedText;
  
  messagesContainer.appendChild(bubble);

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // If first message in new chat, add to chat history
  if (currentMessages.length === 1) {
    addChatToHistory(text);
  }
}

function formatMessageText(text) {
  // Handle markdown-style formatting
  return text
    // Convert URLs to clickable links first
    .replace(/https?:\/\/[^\s]+/g, url => `<a href="${url}" target="_blank" class="text-blue-600 hover:underline">${url}</a>`)
    // Convert line breaks to <br> tags
    .replace(/\n/g, '<br>')
    // Bold text: **text** becomes <strong>text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text: *text* becomes <em>text</em>
    .replace(/\*([^\*]+)\*/g, '<em>$1</em>')
    // Headings: # Heading becomes <h3>Heading</h3>
    .replace(/^# (.*?)$/gm, '<h3 class="text-xl font-bold my-2">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h4 class="text-lg font-bold my-1">$1</h4>')
    // Bullet points with • or - into proper list items
    .replace(/(•|-) (.*?)(?:<br>|$)/g, '<li class="ml-4">$2</li>')
    // Code blocks
    .replace(/```([^`]+)```/g, '<pre class="bg-gray-800 text-white p-2 rounded my-1 overflow-x-auto">$1</pre>')
    // Inline code: `code` becomes <code>code</code>
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>');
}

function showTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.id = 'typingIndicator';
  indicator.classList.add(
    'max-w-[70%]',
    'px-4',
    'py-2',
    'rounded-xl',
    'mb-2',
    'bg-gray-200',
    'text-gray-800',
    'mr-auto',
    'flex',
    'items-center'
  );
  
  indicator.innerHTML = `
    <div class="typing-dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  `;
  
  messagesContainer.appendChild(indicator);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.remove();
  }
}

async function loadChat(chatId) {
  try {
    // Clear current messages
    messagesContainer.innerHTML = '';
    currentMessages = [];
    
    // Show typing indicator while loading
    showTypingIndicator();
    
    // Fetch messages from backend by chatId
    const response = await fetch('http://localhost:8080', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'getChatHistory',
        chatId: chatId
      })
    });
    
    // Remove typing indicator
    removeTypingIndicator();
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update the current chat ID in the API service
    apiService.chatId = chatId;
    
    // If we got messages, display them
    if (data.messages && data.messages.length > 0) {
      // Hide center logo since we're showing messages
      centerLogo.classList.add('hidden');
      
      // Display each message
      data.messages.forEach(msg => {
        addMessage(msg.content, msg.sender);
      });
    } else {
      // Show center logo if no messages
      centerLogo.classList.remove('hidden');
    }
    
    console.log('Loaded chat:', chatId);
  } catch (error) {
    console.error('Error loading chat history:', error);
    addMessage("Sorry, I couldn't load the chat history.", "bot");
  }
}
