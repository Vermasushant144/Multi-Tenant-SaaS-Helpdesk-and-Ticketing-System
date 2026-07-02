package com.emailtesting.service;

import com.emailtesting.exception.EmailException;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service class that interfaces with the Resend Email SDK.
 */
@Service
public class EmailService {

    private final String apiKey;

    public EmailService(@Value("${resend.api.key}") String apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Sends an HTML email to the specified recipient using Resend API.
     *
     * @param to          recipient email address
     * @param subject     email subject line
     * @param htmlContent HTML content body of the email
     * @return the unique email transaction ID returned by Resend
     * @throws EmailException if any error occurs during API submission
     */
    public String sendMail(String to, String subject, String htmlContent) {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("YOUR_API_KEY")) {
            throw new EmailException("Invalid API Key: Please set a valid Resend API key in application.properties or via RESEND_API_KEY environment variable.");
        }

        // Initialize Resend SDK client
        Resend resend = new Resend(apiKey);

        // Build email payload options
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("onboarding@resend.dev") // Default Resend test sending address
                .to(to)
                .subject(subject)
                .html(htmlContent)
                .build();

        try {
            CreateEmailResponse response = resend.emails().send(params);
            if (response != null && response.getId() != null) {
                return response.getId();
            } else {
                throw new EmailException("Resend API returned a success status but no Email transaction ID was found.");
            }
        } catch (ResendException e) {
            throw new EmailException("Resend SDK encountered an API exception: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new EmailException("Unexpected system error while dispatching email: " + e.getMessage(), e);
        }
    }
}
