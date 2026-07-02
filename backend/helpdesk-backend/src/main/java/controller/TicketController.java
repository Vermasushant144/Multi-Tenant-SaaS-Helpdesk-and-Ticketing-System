package controller;

import dto.TicketRequest;
import dto.TicketResponse;
import entity.User;
import service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // ─── GET /api/tickets ─────────────────────────────────────────
    // Lists all tickets associated with the current user's tenant
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getTickets(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        List<TicketResponse> tickets = ticketService.getTicketsByTenant(currentUser.getTenant().getId());
        return ResponseEntity.ok(tickets);
    }

    // ─── POST /api/tickets ────────────────────────────────────────
    // Creates a new ticket under the current user's tenant and triggers Resend email
    @PostMapping
    public ResponseEntity<TicketResponse> createTicket(@Valid @RequestBody TicketRequest request, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        TicketResponse createdTicket = ticketService.createTicket(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Not authenticated");
        }
        return (User) authentication.getPrincipal();
    }
}

