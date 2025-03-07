document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const newChatBtn = document.getElementById('newChatBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    let currentChatId = null;
    
    // Function to add a message to the chat
    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to send a message to the server
    async function sendMessage(text) {
        try {
            // Add the user message to the chat
            addMessage(text, true);
            
            // Clear the input field
            messageInput.value = '';
            
            // Show a loading indicator
            const loadingMessage = document.createElement('div');
            loadingMessage.className = 'message bot-message';
            loadingMessage.innerHTML = '<div class="message-content">Thinking...</div>';
            chatMessages.appendChild(loadingMessage);
            
            // Send the message to the server
            const response = await fetch('http://localhost:8080', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'sendMessage',
                    message: text,
                    chatId: currentChatId
                }),
            });
            
            // Remove the loading indicator
            chatMessages.removeChild(loadingMessage);
            
            if (response.ok) {
                const data = await response.json();
                addMessage(data.response, false);
            } else {
                addMessage('Sorry, there was an error communicating with the server.', false);
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, there was an error communicating with the server.', false);
        }
    }
    
    // Event listeners
    sendButton.addEventListener('click', () => {
        const text = messageInput.value.trim();
        if (text) {
            sendMessage(text);
        }
    });
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const text = messageInput.value.trim();
            if (text) {
                sendMessage(text);
            }
        }
    });
    
    newChatBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:8080', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'newChat'
                }),
            });
            
            if (response.ok) {
                const data = await response.json();
                currentChatId = data.chatId;
                
                // Clear the chat messages
                chatMessages.innerHTML = '';
                addMessage('Hello! I\'m TalkFlow. How can I help you today?', false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    
    clearHistoryBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:8080', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'clearHistory'
                }),
            });
            
            if (response.ok) {
                // Clear the chat messages
                chatMessages.innerHTML = '';
                addMessage('Chat history has been cleared.', false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    
    // Initialize with a new chat
    newChatBtn.click();
});
