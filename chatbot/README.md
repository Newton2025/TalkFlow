# TalkFlow Chatbot

TalkFlow is a modern AI chatbot application that uses Google's Gemini AI to provide intelligent responses. The application features a sleek interface with a collapsible sidebar, conversation history, and real-time chat capabilities.

## Features

- 💬 Real-time chat with AI using Google's Gemini model
- 📱 Responsive design with collapsible sidebar
- 🔍 Search through chat history
- 🔄 Start new conversations or continue previous ones
- 💾 Persistent chat history using SQLite database
- ⌨️ Command-line interface option for terminal-based interaction

## Architecture

TalkFlow follows a client-server architecture:

- **Frontend**: HTML, CSS (TailwindCSS), and vanilla JavaScript
- **Backend**: Java 11 with embedded HTTP server
- **Database**: SQLite for persistent storage
- **AI**: Google Gemini API integration

## Setup Instructions

### Prerequisites

- Java 11 or higher installed
- A Google Gemini API key

### Backend Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/TalkFlow.git
   cd TalkFlow/chatbot
   ```

2. Update the API key in `Backend/Responses.java`:
   ```java
   private static final String API_KEY = "YOUR_GEMINI_API_KEY";
   ```

3. Build the project:
   ```
   cd Backend
   ./gradlew build
   ```

## Running the Application

### Start the Backend Server

```
cd Backend
./gradlew runServer
```

The server will start on http://localhost:8080

### Access the Frontend

Open `Frontend/index.html` in your web browser. You can either:
- Double-click the file in your file explorer
- Or use a local development server like Live Server in VS Code

### Command-line Interface Mode

To use TalkFlow in terminal mode:

```
cd Backend
./gradlew runCli
```

## API Documentation

The backend provides the following API endpoints:

### POST /

Handles all API requests with different action parameters:

| Action | Description | Parameters | Response |
|--------|-------------|------------|----------|
| `sendMessage` | Send a message to the AI | `message`, `chatId` (optional) | `{chatId, response}` |
| `newChat` | Create a new chat session | None | `{chatId}` |
| `clearHistory` | Clear all chat history | None | `{status}` |
| `getChatHistory` | Get messages from a specific chat | `chatId` | `{chatId, messages}` |

## Usage Examples

### Starting a New Chat
Click the "New Chat" button in the sidebar or reload the page.

### Sending Messages
Type your message in the input field and press Enter or click the send button.

### Searching Chat History
Use the search bar in the sidebar to filter past conversations.

### Loading Previous Conversations
Click on any chat title in the sidebar to load that conversation.

## License

This project is open source and available under the MIT License.

## Acknowledgements

- Google Gemini API for AI capabilities
- TailwindCSS for styling
- SQLite for database functionality
