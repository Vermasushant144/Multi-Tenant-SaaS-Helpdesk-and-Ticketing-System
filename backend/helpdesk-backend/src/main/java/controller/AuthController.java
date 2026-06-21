package controller;

import dto.LoginRequest;
import dto.LoginResponse;
import dto.RegisterCompanyRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ─── POST /api/auth/login ─────────────────────────────────────
    // Frontend sends: { "email": "...", "password": "..." }
    // Backend returns: { "token": "...", "name": "...", "role": "...", ... }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── POST /api/auth/register ──────────────────────────────────
    // Frontend sends: { "companyName": "...", "fullName": "...", "email": "...", "password": "..." }
    // Backend creates tenant + admin user, returns JWT token
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterCompanyRequest request) {
        try {
            LoginResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── GET /api/auth/me ─────────────────────────────────────────
    // Returns current user info (frontend can call this to verify token is valid)
    @GetMapping("/me")
    public ResponseEntity<?> me(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        entity.User user = (entity.User) authentication.getPrincipal();
        return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "tenantId", user.getTenant().getId(),
                "company", user.getTenant().getName()
        ));
    }
}

