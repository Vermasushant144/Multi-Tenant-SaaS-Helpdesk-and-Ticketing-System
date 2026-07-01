package dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class CreateUserRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Role is required")
    private String role; // CUSTOMER, AGENT, ADMIN

    @NotBlank(message = "Status is required")
    private String status; // ACTIVE, INACTIVE

    // Constructors
    public CreateUserRequest() {}

    public CreateUserRequest(String name, String email, String role, String status) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
