package service;

import dto.CreateUserRequest;
import dto.UpdateUserRequest;
import dto.UserResponse;
import entity.Tenant;
import entity.User;
import repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // Get all users in the tenant
    public List<UserResponse> getUsersByTenant(Long tenantId) {
        return userRepository.findByTenantId(tenantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Get all agents/admins in the tenant
    public List<UserResponse> getAgentsByTenant(Long tenantId) {
        return userRepository.findByTenantId(tenantId).stream()
                .filter(u -> u.getRole() == User.Role.AGENT || u.getRole() == User.Role.ADMIN)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Create a new user in the tenant
    @Transactional
    public UserResponse createUser(CreateUserRequest request, Tenant tenant) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered.");
        }

        // Set default password as "password123"
        String hashedPassword = passwordEncoder.encode("password123");

        User user = User.builder()
                .tenant(tenant)
                .name(request.getName())
                .email(request.getEmail())
                .password(hashedPassword)
                .role(User.Role.valueOf(request.getRole().toUpperCase()))
                .status(User.Status.valueOf(request.getStatus().toUpperCase()))
                .build();

        user = userRepository.save(user);

        // Send email
        emailService.sendUserCreatedEmail(user.getEmail(), user.getName(), user.getRole().name(), user.getStatus().name());

        return mapToResponse(user);
    }

    // Update an existing user in the tenant
    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest request, Long tenantId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        // Verify tenancy
        if (!user.getTenant().getId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized: User does not belong to your organization.");
        }

        // Verify email uniqueness
        if (userRepository.existsByEmailAndIdNot(request.getEmail(), userId)) {
            throw new RuntimeException("Email is already registered to another user.");
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(User.Role.valueOf(request.getRole().toUpperCase()));
        user.setStatus(User.Status.valueOf(request.getStatus().toUpperCase()));

        user = userRepository.save(user);

        // Send email
        emailService.sendUserUpdatedEmail(user.getEmail(), user.getName(), user.getRole().name(), user.getStatus().name());

        return mapToResponse(user);
    }

    // Delete a user in the tenant
    @Transactional
    public void deleteUser(Long userId, Long tenantId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        // Verify tenancy
        if (!user.getTenant().getId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized: User does not belong to your organization.");
        }

        userRepository.delete(user);

        // Send email
        emailService.sendUserDeletedEmail(user.getEmail(), user.getName());
    }

    // Helper mapper
    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getStatus().name(),
                user.getTenant().getId(),
                user.getTenant().getName()
        );
    }
}
