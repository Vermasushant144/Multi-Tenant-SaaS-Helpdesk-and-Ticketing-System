package service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class TelegramService {

    private static final Logger logger = LoggerFactory.getLogger(TelegramService.class);

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    private final RestTemplate restTemplate;

    public TelegramService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Sends a message to the configured Telegram chat.
     * Incorporates try-catch to ensure failures do not disrupt the caller workflow.
     *
     * @param htmlMessage HTML formatted message text
     */
    public void sendNotification(String htmlMessage) {
        try {
            if (botToken == null || botToken.isEmpty() || botToken.contains("YOUR_BOT_TOKEN")) {
                logger.warn("Telegram bot token is not configured correctly. Skipping notification.");
                return;
            }
            if (chatId == null || chatId.isEmpty() || chatId.contains("YOUR_CHAT_ID")) {
                logger.warn("Telegram chat ID is not configured correctly. Skipping notification.");
                return;
            }

            String telegramUrl = "https://api.telegram.org/bot" + botToken + "/sendMessage";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("chat_id", chatId);
            requestBody.put("text", htmlMessage);
            requestBody.put("parse_mode", "HTML");

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(telegramUrl, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Telegram notification sent successfully.");
            } else {
                logger.error("Failed to send Telegram notification. Status code: {}, Response: {}", 
                        response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            // Log exception but do not rethrow, ensuring main flow continues uninterrupted
            logger.error("Error occurred while sending Telegram notification: {}", e.getMessage(), e);
        }
    }
}
