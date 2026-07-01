package entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String priority; // LOW, MEDIUM, HIGH

    @Column(nullable = false, length = 50)
    private String status; // OPEN, IN_PROGRESS, RESOLVED

    @Column(name = "creator_name", nullable = false, length = 100)
    private String creatorName;

    @Column(name = "creator_email", nullable = false, length = 150)
    private String creatorEmail;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Ticket() {}

    public Ticket(Long id, Tenant tenant, String title, String description, String priority, String status, String creatorName, String creatorEmail, User assignee, LocalDateTime createdAt) {
        this.id = id;
        this.tenant = tenant;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.creatorName = creatorName;
        this.creatorEmail = creatorEmail;
        this.assignee = assignee;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        if (this.status == null) this.status = "OPEN";
        if (this.priority == null) this.priority = "MEDIUM";
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tenant getTenant() {
        return tenant;
    }

    public void setTenant(Tenant tenant) {
        this.tenant = tenant;
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

    public User getAssignee() {
        return assignee;
    }

    public void setAssignee(User assignee) {
        this.assignee = assignee;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static TicketBuilder builder() {
        return new TicketBuilder();
    }

    public static class TicketBuilder {
        private Long id;
        private Tenant tenant;
        private String title;
        private String description;
        private String priority;
        private String status;
        private String creatorName;
        private String creatorEmail;
        private User assignee;
        private LocalDateTime createdAt;

        public TicketBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TicketBuilder tenant(Tenant tenant) {
            this.tenant = tenant;
            return this;
        }

        public TicketBuilder title(String title) {
            this.title = title;
            return this;
        }

        public TicketBuilder description(String description) {
            this.description = description;
            return this;
        }

        public TicketBuilder priority(String priority) {
            this.priority = priority;
            return this;
        }

        public TicketBuilder status(String status) {
            this.status = status;
            return this;
        }

        public TicketBuilder creatorName(String creatorName) {
            this.creatorName = creatorName;
            return this;
        }

        public TicketBuilder creatorEmail(String creatorEmail) {
            this.creatorEmail = creatorEmail;
            return this;
        }

        public TicketBuilder assignee(User assignee) {
            this.assignee = assignee;
            return this;
        }

        public TicketBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Ticket build() {
            return new Ticket(id, tenant, title, description, priority, status, creatorName, creatorEmail, assignee, createdAt);
        }
    }
}
