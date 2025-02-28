package chatbot;
import java.util.Scanner;

public class talkFlow {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("talkFlow: Hello! I am your chatbot. Type 'exit' to end the chat.");

        while (true) {
            System.out.print("You: ");
            String userInput = scanner.nextLine().toLowerCase();

            if (userInput.equals("exit")) {
                System.out.println("talkFlow: Goodbye! Have a great day.");
                break;
            }

            String response = responses.getResponse(userInput);
            System.out.println("talkFlow: " + response);
        }

        scanner.close();
    }
}
