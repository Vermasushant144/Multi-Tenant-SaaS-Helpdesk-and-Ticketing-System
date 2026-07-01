package dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterCompanyRequest {
    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    // Constructors
    public RegisterCompanyRequest() {}

    public RegisterCompanyRequest(String companyName, String fullName, String email, String password) {
        this.companyName = companyName;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

