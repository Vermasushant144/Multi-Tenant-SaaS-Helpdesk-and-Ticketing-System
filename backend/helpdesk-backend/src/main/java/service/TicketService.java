package service;

import dto.TicketRequest;
import dto.TicketResponse;
import entity.Ticket;
import entity.User;
import repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final EmailService emailService;

    public TicketService(TicketRepository ticketRepository, EmailService emailService) {
        this.ticketRepository = ticketRepository;
        this.emailService = emailService;
    }

    // List all tickets in the tenant
    public List<TicketResponse> getTicketsByTenant(Long tenantId) {
        return ticketRepository.findByTenantId(tenantId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Create a new ticket in the tenant
    @Transactional
    public TicketResponse createTicket(TicketRequest request, User currentUser) {
        Ticket ticket = Ticket.builder()
                .tenant(currentUser.getTenant())
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority().toUpperCase())
                .status("OPEN")
                .creatorName(request.getCreatorName())
                .creatorEmail(request.getCreatorEmail())
                .build();

        ticket = ticketRepository.save(ticket);

        // Send Email Notification
        emailService.sendTicketCreatedEmail(
                ticket.getCreatorEmail(),
                ticket.getId(),
                ticket.getTitle(),
                ticket.getPriority(),
                ticket.getDescription()
        );

        return mapToResponse(ticket);
    }

    // Helper mapper
    private TicketResponse mapToResponse(Ticket ticket) {
        return new TicketResponse(
                ticket.getId(),
                ticket.getTitle(),
                ticket.getDescription(),
                ticket.getPriority(),
                ticket.getStatus(),
                ticket.getCreatorName(),
                ticket.getCreatorEmail(),
                ticket.getAssignee() != null ? ticket.getAssignee().getId() : null,
                ticket.getAssignee() != null ? ticket.getAssignee().getName() : "Unassigned",
                ticket.getCreatedAt()
        );
    }
}
