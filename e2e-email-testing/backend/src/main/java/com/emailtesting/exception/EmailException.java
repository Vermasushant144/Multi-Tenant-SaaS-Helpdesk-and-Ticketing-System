package com.emailtesting.exception;

/**
 * Custom runtime exception representing failures in sending emails via the Resend API.
 */
public class EmailException extends RuntimeException {
    
    public EmailException(String message) {
        super(message);
    }
    
    public EmailException(String message, Throwable cause) {
        super(message, cause);
    }
}
