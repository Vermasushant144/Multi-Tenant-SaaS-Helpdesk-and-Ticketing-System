package dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class TicketRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Priority is required")
    private String priority; // LOW, MEDIUM, HIGH

    @NotBlank(message = "Creator email is required")
    @Email(message = "Invalid email format")
    private String creatorEmail;

    @NotBlank(message = "Creator name is required")
    private String creatorName;

    // Constructors
    public TicketRequest() {}

    public TicketRequest(String title, String description, String priority, String creatorEmail, String creatorName) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.creatorEmail = creatorEmail;
        this.creatorName = creatorName;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getCreatorEmail() {
        return creatorEmail;
    }

    public void setCreatorEmail(String creatorEmail) {
        this.creatorEmail = creatorEmail;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }
}
