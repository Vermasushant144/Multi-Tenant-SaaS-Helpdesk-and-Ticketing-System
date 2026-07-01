package config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });

        // Use the first error message as the main "error" field for simple frontend alert displays
        String mainMessage = "Validation failed";
        if (!fieldErrors.isEmpty()) {
            mainMessage = fieldErrors.values().iterator().next();
        }

        Map<String, Object> body = new HashMap<>();
        body.put("error", mainMessage);
        body.put("details", fieldErrors);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
}
