package dto;

import java.time.LocalDateTime;

public class TicketResponse {
    private Long id;
    private String title;
    private String description;
    private String priority;
    private String status;
    private String creatorName;
    private String creatorEmail;
    private Long assigneeId;
    private String assigneeName;
    private LocalDateTime createdAt;

    // Constructors
    public TicketResponse() {}

    public TicketResponse(Long id, String title, String description, String priority, String status, String creatorName, String creatorEmail, Long assigneeId, String assigneeName, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.creatorName = creatorName;
        this.creatorEmail = creatorEmail;
        this.assigneeId = assigneeId;
        this.assigneeName = assigneeName;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public String getCreatorEmail() {
        return creatorEmail;
    }

    public void setCreatorEmail(String creatorEmail) {
        this.creatorEmail = creatorEmail;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public String getAssigneeName() {
        return assigneeName;
    }

    public void setAssigneeName(String assigneeName) {
        this.assigneeName = assigneeName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
