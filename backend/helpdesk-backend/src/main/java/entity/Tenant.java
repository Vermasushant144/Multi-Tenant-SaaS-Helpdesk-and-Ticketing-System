package entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tenants")
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false, length = 100)
    private String name;

    @Column(name = "name", nullable = false, length = 100)
    private String displayName;

    @Column(name = "company_code", nullable = false, unique = true, length = 50)
    private String companyCode;

    @Column(unique = true, length = 100)
    private String domain;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Tenant() {}

    public Tenant(Long id, String name, String displayName, String companyCode, String domain, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.companyCode = companyCode;
        this.domain = domain;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.displayName == null && this.name != null) {
            this.displayName = this.name;
        }
        if (this.companyCode == null && this.name != null) {
            String base = this.name.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
            if (base.isEmpty()) {
                base = "TENANT";
            }
            this.companyCode = base.substring(0, Math.min(base.length(), 6))
                    + System.currentTimeMillis() % 100000;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getCompanyCode() {
        return companyCode;
    }

    public void setCompanyCode(String companyCode) {
        this.companyCode = companyCode;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static TenantBuilder builder() {
        return new TenantBuilder();
    }

    public static class TenantBuilder {
        private Long id;
        private String name;
        private String displayName;
        private String companyCode;
        private String domain;
        private LocalDateTime createdAt;

        public TenantBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public TenantBuilder name(String name) {
            this.name = name;
            return this;
        }

        public TenantBuilder displayName(String displayName) {
            this.displayName = displayName;
            return this;
        }

        public TenantBuilder companyCode(String companyCode) {
            this.companyCode = companyCode;
            return this;
        }

        public TenantBuilder domain(String domain) {
            this.domain = domain;
            return this;
        }

        public TenantBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Tenant build() {
            return new Tenant(id, name, displayName, companyCode, domain, createdAt);
        }
    }
}
