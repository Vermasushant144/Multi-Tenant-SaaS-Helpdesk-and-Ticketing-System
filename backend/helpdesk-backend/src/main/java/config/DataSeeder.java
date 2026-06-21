package config;

import entity.Tenant;
import entity.User;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import repository.TenantRepository;
import repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      TenantRepository tenantRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tenantRepository = tenantRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@acme.com").isPresent()) {
            return;
        }

        Tenant acme = tenantRepository.findByDomain("acme.com")
                .orElseGet(() -> tenantRepository.save(
                        Tenant.builder()
                                .name("Acme Corp")
                                .displayName("Acme Corp")
                                .companyCode("ACME001")
                                .domain("acme.com")
                                .build()
                ));
        Tenant globex = tenantRepository.findByDomain("customer.com")
                .orElseGet(() -> tenantRepository.save(
                        Tenant.builder()
                                .name("Globex Inc")
                                .displayName("Globex Inc")
                                .companyCode("GLOBEX001")
                                .domain("customer.com")
                                .build()
                ));

        String hashedPassword = passwordEncoder.encode("password123");

        userRepository.save(User.builder()
                .tenant(acme)
                .name("Sushant Verma")
                .email("admin@acme.com")
                .password(hashedPassword)
                .role(User.Role.ADMIN)
                .status(User.Status.ACTIVE)
                .build());

        userRepository.save(User.builder()
                .tenant(acme)
                .name("John Doe")
                .email("john@acme.com")
                .password(hashedPassword)
                .role(User.Role.AGENT)
                .status(User.Status.ACTIVE)
                .build());

        userRepository.save(User.builder()
                .tenant(globex)
                .name("Alice Smith")
                .email("alice@customer.com")
                .password(hashedPassword)
                .role(User.Role.CUSTOMER)
                .status(User.Status.ACTIVE)
                .build());

        userRepository.save(User.builder()
                .tenant(acme)
                .name("Bob Johnson")
                .email("bob@agent.com")
                .password(hashedPassword)
                .role(User.Role.AGENT)
                .status(User.Status.INACTIVE)
                .build());
    }
}
