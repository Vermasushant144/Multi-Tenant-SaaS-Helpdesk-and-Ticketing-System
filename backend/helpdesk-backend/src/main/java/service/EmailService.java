package service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class EmailService {

    private final String apiKey = "re_AmRjr4yA_JQVXnzk8cfKgfBxh7kcYh7dT";
    private final String resendUrl = "https://api.resend.com/emails";
    private final RestTemplate restTemplate;

    // ─── TESTING MODE ──────────────────────────────────────────────
    // Resend ke free plan mein bina verified domain ke sirf apne
    // registered email pe hi bhej sakte ho.
    // Jab domain verify ho jaye, is line ko hata do aur niche
    // sendHtmlEmail(to, ...) use karo directly.
    private static final String TESTING_RECIPIENT = "vermasushant144@gmail.com";

    public EmailService() {
        this.restTemplate = new RestTemplate();
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("from", "onboarding@resend.dev");
            requestBody.put("to", to);
            requestBody.put("subject", subject);
            requestBody.put("html", htmlContent);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(resendUrl, requestEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("Email sent successfully to: " + to);
            } else {
                System.err.println("Failed to send email. Response: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Error while sending email: " + e.getMessage());
        }
    }

    public void sendUserCreatedEmail(String to, String name, String role, String status) {
        String subject = "Account Created - Welcome to SaaS Helpdesk";
        String htmlContent = String.format(
                "<h3>Welcome to SaaS Helpdesk</h3>" +
                        "<p>Hello <strong>%s</strong>,</p>" +
                        "<p>Your account has been successfully created with the following details:</p>" +
                        "<ul>" +
                        "  <li><strong>Email:</strong> %s</li>" +
                        "  <li><strong>Role:</strong> %s</li>" +
                        "  <li><strong>Status:</strong> %s</li>" +
                        "</ul>" +
                        "<p>Please sign in using your credentials.</p>",
                name, to, role, status);
        sendHtmlEmail(TESTING_RECIPIENT, subject, htmlContent);
    }

    public void sendUserUpdatedEmail(String to, String name, String role, String status) {
        String subject = "Account Updated - SaaS Helpdesk";
        String htmlContent = String.format(
                "<h3>Account Details Updated</h3>" +
                        "<p>Hello <strong>%s</strong>,</p>" +
                        "<p>Your account details have been updated:</p>" +
                        "<ul>" +
                        "  <li><strong>Email:</strong> %s</li>" +
                        "  <li><strong>Role:</strong> %s</li>" +
                        "  <li><strong>Status:</strong> %s</li>" +
                        "</ul>",
                name, to, role, status);
        sendHtmlEmail(TESTING_RECIPIENT, subject, htmlContent);
    }

    public void sendUserDeletedEmail(String to, String name) {
        String subject = "Account Deleted - SaaS Helpdesk";
        String htmlContent = String.format(
                "<h3>Account Deleted</h3>" +
                        "<p>Hello <strong>%s</strong>,</p>" +
                        "<p>Your account has been deleted/removed from our system.</p>",
                name);
        sendHtmlEmail(TESTING_RECIPIENT, subject, htmlContent);
    }

    public void sendTicketCreatedEmail(String to, Long ticketId, String title, String priority, String description) {
        String subject = "Ticket Created - #" + ticketId + ": " + title;
        String htmlContent = String.format(
                "<h3>Ticket Raised Successfully</h3>" +
                        "<p>Hello,</p>" +
                        "<p>A ticket was created by: <strong>%s</strong></p>" +
                        "<p>Ticket details:</p>" +
                        "<ul>" +
                        "  <li><strong>Ticket ID:</strong> #%d</li>" +
                        "  <li><strong>Subject:</strong> %s</li>" +
                        "  <li><strong>Priority:</strong> %s</li>" +
                        "  <li><strong>Description:</strong> %s</li>" +
                        "</ul>" +
                        "<p>Our support agents will review it shortly.</p>",
                to, ticketId, title, priority, description != null ? description : "No description provided.");
        // ─── TESTING MODE: Send to verified address ───────────────
        // In production (after domain verify), replace TESTING_RECIPIENT with: to
        sendHtmlEmail(TESTING_RECIPIENT, subject, htmlContent);
    }
}

