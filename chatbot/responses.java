package chatbot;

public class responses {
    public static String getResponse(String input)
    {
        if (input.contains("hello") || input.contains("hi")) {
            return "Hi there! How can I help you?";
        } else if (input.contains("how are you")) {
            return "I'm just a bot, but I'm doing great! How about you?";
        } else if (input.contains("your name")) {
            return "I am a simple chatbot created in Java.";
        } else if (input.contains("bye")) {
            return "Goodbye! Take care.";
        } else {
            return "I'm not sure how to respond to that. Can you ask something else?";
        }
    }
}
