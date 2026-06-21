package dto;

public class RegisterCompanyRequest {
    private String companyName;
    private String fullName;
    private String email;
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
