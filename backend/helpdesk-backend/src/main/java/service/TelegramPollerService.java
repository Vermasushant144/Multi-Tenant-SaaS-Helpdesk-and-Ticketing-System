package service;

import dto.TicketRequest;
import dto.TicketResponse;
import entity.User;
import repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class TelegramPollerService {

    private static final Logger logger = LoggerFactory.getLogger(TelegramPollerService.class);

    @Value("${telegram.bot.token}")
    private String botToken;

    private final UserRepository userRepository;
    private final TicketService ticketService;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private int lastUpdateId = 0;

    public TelegramPollerService(UserRepository userRepository, TicketService ticketService) {
        this.userRepository = userRepository;
        this.ticketService = ticketService;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Periodically queries Telegram server for updates using long polling.
     * Scheduled to execute every 5000 milliseconds (5 seconds).
     */
    @Scheduled(fixedDelay = 5000)
    public void pollTelegramUpdates() {
        try {
            if (botToken == null || botToken.isEmpty() || botToken.contains("YOUR_BOT_TOKEN")) {
                return;
            }

            String url = "https://api.telegram.org/bot" + botToken + "/getUpdates?offset=" + (lastUpdateId + 1) + "&timeout=10";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode resultNode = rootNode.path("result");

                if (resultNode.isArray()) {
                    for (JsonNode updateNode : resultNode) {
                        int updateId = updateNode.path("update_id").asInt();
                        lastUpdateId = updateId; // Increment offset to acknowledge receipt

                        JsonNode messageNode = updateNode.path("message");
                        String text = messageNode.path("text").asText();
                        long chatId = messageNode.path("chat").path("id").asLong();
                        
                        String senderName = messageNode.path("from").path("username").asText();
                        if (senderName == null || senderName.isEmpty()) {
                            senderName = messageNode.path("from").path("first_name").asText("User");
                        }

                        if (text != null && !text.isEmpty()) {
                            processTelegramMessage(text, senderName, chatId);
                        }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error occurred during Telegram polling: {}", e.getMessage());
        }
    }

    /**
     * Parses the incoming text message and triggers ticket creation if appropriate.
     */
    private void processTelegramMessage(String text, String senderName, long chatId) {
        String lowercaseText = text.toLowerCase();

        if (lowercaseText.contains("create ticket") || lowercaseText.contains("create a ticket")) {
            // Parse subject/title
            String title = extractValue(text, new String[]{"name:", "title:", "subject:"});
            // Parse description with typo tolerance (handles "description:" or "descition:")
            String description = extractValue(text, new String[]{"desc:", "description:", "descition:"});

            if (title.isEmpty()) {
                sendReply(chatId, "❌ <b>Format Error:</b> Ticket name/title is required.\n\n" +
                        "<b>Correct format:</b>\n" +
                        "<code>create ticket\n" +
                        "name: [title]\n" +
                        "description: [description]</code>");
                return;
            }

            if (description.isEmpty()) {
                description = "No description provided.";
            }

            try {
                // Fetch the default admin account context for Telegram ticket creation
                User adminCreator = userRepository.findByEmail("admin@acme.com")
                        .orElseThrow(() -> new RuntimeException("Default administrator account not found."));

                // Build Ticket Request DTO
                TicketRequest request = new TicketRequest();
                request.setTitle(title);
                request.setDescription(description);
                request.setPriority("MEDIUM");
                request.setCreatorEmail("admin@acme.com");
                request.setCreatorName(senderName + " (via Telegram)");

                // Call TicketService
                TicketResponse createdTicket = ticketService.createTicket(request, adminCreator);

                sendReply(chatId, String.format(
                        "<b>🎫 Ticket Created Successfully!</b>\n\n" +
                        "<b>Ticket ID:</b> #%d\n" +
                        "<b>Subject:</b> %s\n" +
                        "<b>Priority:</b> %s\n" +
                        "<b>Creator:</b> %s\n\n" +
                        "Your ticket has been logged in the helpdesk system.",
                        createdTicket.getId(),
                        createdTicket.getTitle(),
                        createdTicket.getPriority(),
                        createdTicket.getCreatorName()
                ));
            } catch (Exception e) {
                logger.error("Failed to create ticket from Telegram: {}", e.getMessage(), e);
                sendReply(chatId, "❌ <b>Database Error:</b> Could not log ticket. Reason: " + e.getMessage());
            }
        } else if (lowercaseText.startsWith("/start")) {
            sendReply(chatId, "<b>👋 Welcome to SaaS Helpdesk Bot!</b>\n\n" +
                    "You can raise support tickets directly from this chat.\n\n" +
                    "<b>Command Format:</b>\n" +
                    "<code>create ticket\n" +
                    "name: My Issue Title\n" +
                    "description: Detailed description of the problem.</code>");
        }
    }

    /**
     * Parses values following specified keys (e.g. name:, description:).
     */
    private String extractValue(String text, String[] keys) {
        String lowerText = text.toLowerCase();
        for (String key : keys) {
            int idx = lowerText.indexOf(key);
            if (idx != -1) {
                int start = idx + key.length();
                // Extract until the next newline
                int end = text.indexOf("\n", start);
                if (end == -1) {
                    end = text.length();
                }
                String val = text.substring(start, end).trim();
                // Strip leading colons or hyphens if present
                if (val.startsWith(":") || val.startsWith("-")) {
                    val = val.substring(1).trim();
                }
                if (!val.isEmpty()) {
                    return val;
                }
            }
        }
        return "";
    }

    /**
     * Sends a direct HTML response to the sender's Telegram chat.
     */
    private void sendReply(long chatId, String htmlText) {
        try {
            String url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("chat_id", chatId);
            body.put("text", htmlText);
            body.put("parse_mode", "HTML");

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            restTemplate.postForEntity(url, request, String.class);
        } catch (Exception e) {
            logger.error("Failed to send reply to chat {}: {}", chatId, e.getMessage());
        }
    }
}
