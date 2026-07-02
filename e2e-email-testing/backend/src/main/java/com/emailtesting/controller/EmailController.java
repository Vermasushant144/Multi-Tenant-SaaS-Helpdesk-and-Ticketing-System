package com.emailtesting.controller;

import com.emailtesting.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller exposing REST API endpoints for email operations.
 */
@RestController
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    /**
     * Endpoint to send a test email to delivered@resend.dev.
     *
     * @return JSON response indicating status
     */
    @GetMapping("/send-email")
    public ResponseEntity<Map<String, Object>> sendTestEmail() {
        String recipient = "delivered@resend.dev";
        String subject = "E2E Test Email";
        String body = "<h1>Playwright E2E Email Verification</h1>" +
                      "<p>This email was successfully dispatched via the Resend API during an automated E2E test run.</p>" +
                      "<p>Time of dispatch: " + java.time.LocalDateTime.now() + "</p>";

        String emailId = emailService.sendMail(recipient, subject, body);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Email sent successfully");
        response.put("id", emailId);

        return ResponseEntity.ok(response);
    }
}
