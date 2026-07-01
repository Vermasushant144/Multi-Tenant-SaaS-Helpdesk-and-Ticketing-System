package service;

import dto.LoginRequest;
import dto.LoginResponse;
import dto.RegisterCompanyRequest;
import entity.Tenant;
import entity.User;
import repository.TenantRepository;
import repository.UserRepository;
import security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       TenantRepository tenantRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ─── LOGIN ───────────────────────────────────────────────────
    public LoginResponse login(LoginRequest request) {
        // 1. Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // 2. Check password using bcrypt
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // 3. Check if account is active
        if (user.getStatus() == User.Status.INACTIVE) {
            throw new RuntimeException("Your account has been deactivated. Contact admin.");
        }

        // 4. Verify selected role matches user's role
        if (request.getRole() != null) {
            String selectedRole = request.getRole().toUpperCase();
            if (selectedRole.equals("ADMIN")) {
                if (user.getRole() != User.Role.ADMIN) {
                    throw new RuntimeException("Unauthorized: You do not have the Admin role");
                }
            } else if (selectedRole.equals("USER")) {
                if (user.getRole() != User.Role.CUSTOMER && user.getRole() != User.Role.AGENT) {
                    throw new RuntimeException("Unauthorized: You do not have the User role");
                }
            } else {
                if (!user.getRole().name().equals(selectedRole)) {
                    throw new RuntimeException("Unauthorized: Role mismatch");
                }
            }
        }

        // 5. Generate JWT token
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId(),
                user.getTenant().getId()
        );

        // 6. Return token + user info to frontend
        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getTenant().getId(),
                user.getTenant().getName()
        );
    }

    // ─── REGISTER (creates new company + admin user) ─────────────
    @Transactional
    public LoginResponse register(RegisterCompanyRequest request) {
        // 1. Check email not already used
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered.");
        }

        // 2. Create new Tenant (company)
        Tenant tenant = Tenant.builder()
                .name(request.getCompanyName())
                .domain(request.getEmail().split("@")[1]) // use domain from email
                .build();
        tenant = tenantRepository.save(tenant);

        // 3. Create customer user with hashed password (default is CUSTOMER/USER)
        User user = User.builder()
                .tenant(tenant)
                .name(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // bcrypt hash
                .role(User.Role.CUSTOMER)
                .status(User.Status.ACTIVE)
                .build();
        user = userRepository.save(user);

        // 4. Auto-login: generate token and return
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getId(),
                tenant.getId()
        );

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                tenant.getId(),
                tenant.getName()
        );
    }
}

