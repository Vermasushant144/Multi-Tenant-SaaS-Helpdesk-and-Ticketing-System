package controller;

import dto.CreateUserRequest;
import dto.UpdateUserRequest;
import dto.UserResponse;
import entity.User;
import service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ─── GET /api/users ───────────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getAllUsers(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        if (currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied. Admins only."));
        }

        List<UserResponse> users = userService.getUsersByTenant(currentUser.getTenant().getId());
        return ResponseEntity.ok(users);
    }

    // ─── GET /api/users/agents ────────────────────────────────────
    @GetMapping("/agents")
    public ResponseEntity<?> getAgents(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        List<UserResponse> agents = userService.getAgentsByTenant(currentUser.getTenant().getId());
        return ResponseEntity.ok(agents);
    }

    // ─── POST /api/users ──────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest request, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        if (currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied. Admins only."));
        }

        try {
            UserResponse createdUser = userService.createUser(request, currentUser.getTenant());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── PUT /api/users/{id} ──────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        if (currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied. Admins only."));
        }

        try {
            UserResponse updatedUser = userService.updateUser(id, request, currentUser.getTenant().getId());
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── DELETE /api/users/{id} ───────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        if (currentUser.getRole() != User.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied. Admins only."));
        }

        try {
            userService.deleteUser(id, currentUser.getTenant().getId());
            return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // Helper to get authenticated User principal
    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not authenticated");
        }
        return (User) authentication.getPrincipal();
    }
}
