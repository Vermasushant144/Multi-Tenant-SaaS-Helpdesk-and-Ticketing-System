package com.helpdesk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
//import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.helpdesk", "config", "controller", "security", "service"})
@org.springframework.boot.persistence.autoconfigure.EntityScan(basePackages = {"entity"})
@EnableJpaRepositories(basePackages = {"repository"})
public class HelpdeskBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(HelpdeskBackendApplication.class, args);
	}
}

