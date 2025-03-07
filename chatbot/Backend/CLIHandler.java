package chatbot;

import java.util.Scanner;

/**
 * Handles command-line interface interactions for TalkFlow
 */
public class CLIHandler {
    private final Responses responseHandler;
    private final ChatDatabase database;
    private String currentChatId;
    private final Scanner scanner;
    
    public CLIHandler(Responses responseHandler, ChatDatabase database) {
        this.responseHandler = responseHandler;
        this.database = database;
        this.scanner = new Scanner(System.in);
        this.currentChatId = responseHandler.createNewChat();
        database.createNewChat(this.currentChatId);
    }
    
    /**
     * Starts the CLI interaction loop
     */
    public void start() {
        System.out.println("\nTalkFlow CLI Mode");
        System.out.println("=================");
        System.out.println("Type your messages and press Enter to chat with TalkFlow.");
        System.out.println("Special commands:");
        System.out.println("  /new     - Start a new chat");
        System.out.println("  /clear   - Clear chat history");
        System.out.println("  /exit    - Exit the application\n");
        
        System.out.println("TalkFlow: Hello! How can I help you today?");
        
        // Changed input loop
        while (scanner.hasNextLine()) {
            System.out.print("\nYou: ");
            String input = scanner.nextLine().trim();
            
            if (input.equalsIgnoreCase("/exit")) {
                System.out.println("Goodbye! Thank you for using TalkFlow.");
                break;
            } else if (input.equalsIgnoreCase("/new")) {
                currentChatId = responseHandler.createNewChat();
                database.createNewChat(currentChatId);
                System.out.println("TalkFlow: Started a new chat. How can I help you?");
            } else if (input.equalsIgnoreCase("/clear")) {
                database.clearHistory();
                System.out.println("TalkFlow: Chat history cleared.");
            } else {
                // Save user message to database
                database.saveMessage(currentChatId, "user", input);
                
                // Get response and save bot response
                String response = responseHandler.getResponse(input);
                database.saveMessage(currentChatId, "bot", response);
                
                // Display the response
                System.out.println("TalkFlow: " + response);
            }
        }
        
        scanner.close();
    }
}
