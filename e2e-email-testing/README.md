# 📬 End-to-End (E2E) Email Testing Project

This project demonstrates how to construct and test an E2E email dispatch flow using **Spring Boot 3.x**, the **Resend Email API**, and **Playwright**.

---

## 📂 Project Structure

```
e2e-email-testing/
├── backend/
│   ├── pom.xml                                  # Maven dependencies
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/
│           │       └── emailtesting/
│           │           ├── EmailTestingApplication.java  # Main application launcher
│           │           ├── controller/
│           │           │   └── EmailController.java       # GET /send-email endpoint
│           │           ├── service/
│           │           │   └── EmailService.java          # Wrapper for Resend SDK
│           │           └── exception/
│           │               ├── EmailException.java        # Custom email exception
│           │               └── GlobalExceptionHandler.java # REST exception intercepter
│           └── resources/
│               ├── application.properties        # Application configs
│               └── static/
│                   └── index.html                # Dark-themed UI web console
├── playwright/
│   ├── package.json                              # Node scripts & Playwright deps
│   ├── playwright.config.js                      # Config for browsers (Chrome/Firefox/Safari)
│   └── tests/
│       └── email.spec.js                         # Real & Mocked Playwright tests
└── README.md                                     # Setup & execution instructions
```

---

## 🚀 Execution & Setup Guide

### Step 1: Clone & Configure API Key
The project reads your Resend API key securely. By default, it falls back to the configured sandbox test key (`re_AmRjr4yA_JQVXnzk8cfKgfBxh7kcYh7dT`), but in production, you should set it as an environment variable:

**Windows PowerShell:**
```powershell
$env:RESEND_API_KEY="your_resend_api_key_here"
```

**Linux/macOS:**
```bash
export RESEND_API_KEY="your_resend_api_key_here"
```

---

### Step 2: Start the Spring Boot Backend

Navigate to the `backend` folder and compile and boot the service:

```bash
cd backend
mvn clean spring-boot:run
```

*The server will boot on port **`9090`**.*
*Open your web browser and navigate to `http://localhost:9090` to view the E2E Email Dispatch Center.*

---

### Step 3: Set Up Playwright

Open a new terminal session, navigate to the `playwright` directory, install NPM dependencies, and fetch browser binaries:

```bash
cd playwright
npm install
npx playwright install
```

---

### Step 4: Run E2E Test Scenarios

Execute the Playwright automated E2E tests across all configured browsers (Chrome, Firefox, Safari):

```bash
# Run tests in headless mode
npm run test

# Run tests with interactive UI
npm run test:ui

# Run tests with debugger open
npm run test:debug
```

---

### Step 5: View Test Reports

If any test fails or when execution concludes, view the HTML report detailing step execution, snapshots, and traces:

```bash
npm run show-report
```
