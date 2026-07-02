package controller;

import service.TelegramService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/telegram")
public class TelegramController {

    private final TelegramService telegramService;

    public TelegramController(TelegramService telegramService) {
        this.telegramService = telegramService;
    }

    /**
     * POST /api/telegram/test-send
     * Triggers a manual test message to the Telegram Bot.
     *
     * @param request JSON payload containing "message"
     * @return ResponseEntity indicating request has been forwarded
     */
    @PostMapping("/test-send")
    public ResponseEntity<Map<String, Object>> testSendNotification(@RequestBody Map<String, String> request) {
        String message = request.getOrDefault("message", "<b>Test Notification</b>\nThis is a manual test message from helpdesk-backend.");
        telegramService.sendNotification(message);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Telegram API request submitted successfully"
        ));
    }
}
