// apiService object to handle API calls
const apiService = {
  chatId: null,
  
  /**
   * Send a message to the backend
   * @param {string} message - The message to send
   * @returns {Promise<string>} - The response from the backend
   */
  async sendMessage(message) {
    try {
      // Add timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('http://localhost:8080', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'sendMessage',
          message: message,
          chatId: this.chatId
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      this.chatId = data.chatId; // Store the chat ID for future requests
      return data.response;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out');
        throw new Error('The request timed out. Please try again later.');
      }
      console.error('API error:', error);
      throw error;
    }
  },
  
  /**
   * Create a new chat
   * @returns {Promise<string>} - The new chat ID
   */
  async createNewChat() {
    try {
      const response = await fetch('http://localhost:8080', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'newChat'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      this.chatId = data.chatId;
      return data.chatId;
    } catch (error) {
      console.error('Error creating new chat:', error);
      throw error;
    }
  },
  
  /**
   * Clear conversation history
   */
  async clearHistory() {
    try {
      const response = await fetch('http://localhost:8080', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'clearHistory'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }
};
