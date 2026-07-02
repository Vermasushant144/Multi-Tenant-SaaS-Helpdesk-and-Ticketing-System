const { test, expect } = require('@playwright/test');

test.describe('E2E Email testing sandbox', () => {

  test('should successfully trigger real email dispatch flow', async ({ page }) => {
    // 1. Navigate to the Spring Boot static landing page
    await page.goto('/');

    // Verify initial layout page load
    await expect(page.locator('h1')).toHaveText('Email Dispatch Center');
    
    // Check that target recipient is displayed correctly
    await expect(page.locator('.highlight')).toHaveText('delivered@resend.dev');

    // 2. Locate and click the "Send Test Email" button
    const sendButton = page.locator('#send-email-btn');
    await expect(sendButton).toBeVisible();
    await sendButton.click();

    // 3. Wait and verify success alert appears and displays correct state
    const successAlert = page.locator('#success-alert');
    // Set 15s timeout since sending email requires a round-trip to Resend APIs
    await expect(successAlert).toBeVisible({ timeout: 15000 }); 
    await expect(successAlert.locator('.alert-body')).toContainText('Email sent successfully!');
  });

  test('should successfully display mocked response output without hitting Resend server', async ({ page }) => {
    // Intercept any backend API calls to "/send-email" and return a mocked success payload
    await page.route('**/send-email', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: "Email sent successfully (mocked)",
          id: "mock_tx_playwright_e2e_12345"
        })
      });
    });

    // 1. Navigate to the landing page
    await page.goto('/');

    // 2. Click the "Send Test Email" button
    const sendButton = page.locator('#send-email-btn');
    await sendButton.click();

    // 3. Verify success alert shows the mocked transaction ID instantly
    const successAlert = page.locator('#success-alert');
    await expect(successAlert).toBeVisible();
    await expect(successAlert.locator('.alert-body')).toContainText('mock_tx_playwright_e2e_12345');
  });

});
