# 🏗️ Multi-Tenant SaaS Helpdesk & Ticketing System - Architecture Summary

---

## 📋 विषयसूची (Table of Contents)
1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Architecture](#database-architecture)
5. [Data Flow](#data-flow)
6. [Technology Stack](#technology-stack)
7. [Key Features & Purpose](#key-features--purpose)

---

## 🎯 System Overview

**Multi-Tenant SaaS Helpdesk & Ticketing System** एक platform है जहाँ **कई businesses** independently onboard कर सकते हैं और अपना customer support independently manage कर सकते हैं।

### Key Concept: Multi-Tenancy
- **हर business का अपना isolated data** है
- **कोई data sharing नहीं** businesses के बीच में
- **Centralized infrastructure** लेकिन separated workspaces

### System का Main Purpose
```
Customer Support को effectively manage करना:
├─ Tickets create करना
├─ Agents को assign करना  
├─ Status track करना
├─ SLA policies enforce करना
└─ Automated escalations trigger करना
```

---

## 💻 Frontend Architecture

**Technology**: React + Vite + Axios + React Router

### Frontend Structure

```
frontend-react/
├── src/
│   ├── App.jsx                 # Main routing और layout
│   ├── main.jsx               # Entry point
│   ├── index.css              # Global styles
│   │
│   ├── context/               
│   │   └── AuthContext.jsx    # Global auth state management
│   │
│   ├── services/              # API calls और business logic
│   │   ├── api.js            # Axios base configuration + interceptors
│   │   ├── AuthService.js    # Login/Register logic
│   │   ├── TicketService.js  # Ticket operations (CRUD)
│   │   ├── UserService.js    # User management
│   │   ├── DashboardService.js # Dashboard data
│   │   ├── NotificationService.js # Notifications
│   │   └── mockData.js       # Temporary mock data (DB से replace होगा)
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx # Route protection (auth check + role-based)
│   │
│   ├── components/            # Reusable UI components
│   │   ├── Layout/           # Main wrapper (Navbar + Sidebar)
│   │   ├── Navbar/           # Top navigation
│   │   ├── Sidebar/          # Left menu
│   │   ├── Modal/            # Generic modal
│   │   ├── ConfirmDialog/    # Confirmation dialogs
│   │   ├── StatusBadge/      # Ticket status display
│   │   ├── TicketCard/       # Individual ticket card
│   │   ├── TicketTable/      # Tickets in table format
│   │   ├── CommentSection/   # Comments on tickets
│   │   ├── NotificationBell/ # Notification indicator
│   │   ├── SearchBar/        # Search functionality
│   │   ├── Pagination/       # Page navigation
│   │   └── LoadingSkeleton/  # Loading state
│   │
│   └── pages/                 # Full page components
│       ├── Login/            # Login form
│       ├── Register/         # Registration (tenant onboarding)
│       ├── Dashboard/        # Main dashboard (analytics)
│       ├── Tickets/          # View all tickets
│       ├── CreateTicket/     # Create new ticket
│       ├── TicketDetails/    # Single ticket + comments
│       ├── Users/            # User management (ADMIN only)
│       ├── Notifications/    # View all notifications
│       ├── Profile/          # User profile
│       └── Settings/         # App settings
```

### Frontend की Workflow

```
1. USER LOGIN/REGISTER
   ↓
   AuthContext में stored (localStorage में भी)
   ↓
   JWT Token generate होता है
   ↓
   Future API calls में Authorization header में जाता है

2. PAGE LOAD
   ↓
   Component mount होता है
   ↓
   Service call → API endpoint
   ↓
   Data receive → State update
   ↓
   UI render

3. USER INTERACTION (e.g., Create Ticket)
   ↓
   Form submit
   ↓
   TicketService.createTicket() call
   ↓
   POST /api/tickets → Backend
   ↓
   Response आता है
   ↓
   localStorage update + notification trigger
   ↓
   UI refresh
```

---

## 🔙 Backend Architecture

**Technology**: Spring Boot 4.1.0 + Spring Data JPA + Spring Security + MySQL

### Backend Dependencies (Key Libraries)

```
pom.xml में include:
├─ spring-boot-starter-data-jpa          # Database ORM (Hibernate)
├─ spring-boot-starter-security          # Authentication & Authorization
├─ spring-boot-starter-web               # REST API framework
├─ spring-boot-starter-validation        # Data validation (@Valid)
├─ mysql-connector-j                     # MySQL driver
├─ io.jsonwebtoken (JWT)                 # JWT token generation/validation
├─ lombok                                # Reduce boilerplate code
└─ spring-boot-devtools                  # Hot reload during development
```

### Backend Project Structure

```
backend/helpdesk-backend/
├── src/main/java/com/helpdesk/
│   ├── HelpdeskBackendApplication.java  # Main Spring Boot entry point
│   │
│   ├── config/                          # Configuration classes
│   │   ├── SecurityConfig.java          # JWT + Spring Security setup
│   │   ├── CorsConfig.java              # CORS settings
│   │   └── ...                          # Other configs
│   │
│   ├── controller/                      # REST API endpoints
│   │   ├── AuthController.java          # /api/auth/* (login, register, logout)
│   │   ├── TicketController.java        # /api/tickets/* (CRUD operations)
│   │   ├── UserController.java          # /api/users/* (user management)
│   │   ├── NotificationController.java  # /api/notifications/*
│   │   ├── DashboardController.java     # /api/dashboard/* (stats)
│   │   └── ...
│   │
│   ├── service/                         # Business logic layer
│   │   ├── AuthService.java             # Auth logic (login, register)
│   │   ├── TicketService.java           # Ticket operations
│   │   ├── UserService.java             # User operations
│   │   ├── NotificationService.java     # Notification handling
│   │   ├── SLAService.java              # SLA enforcement
│   │   └── ...
│   │
│   ├── entity/                          # JPA entities (Database models)
│   │   ├── Tenant.java                  # Company/Organization
│   │   ├── User.java                    # System users
│   │   ├── Ticket.java                  # Support tickets
│   │   ├── Comment.java                 # Ticket comments
│   │   ├── Notification.java            # User notifications
│   │   ├── SLAPolicy.java               # SLA rules
│   │   └── ...
│   │
│   ├── dto/                             # Data Transfer Objects
│   │   ├── LoginRequest.java            # Login request payload
│   │   ├── LoginResponse.java           # Login response payload
│   │   ├── TicketDTO.java               # Ticket DTO
│   │   ├── UserDTO.java                 # User DTO
│   │   └── ...                          # Other DTOs
│   │
│   ├── repository/                      # JPA repositories (Database access)
│   │   ├── UserRepository.java          # User queries
│   │   ├── TicketRepository.java        # Ticket queries
│   │   ├── TenantRepository.java        # Tenant queries
│   │   └── ...
│   │
│   └── security/                        # Security utilities
│       ├── JwtTokenProvider.java        # JWT generation/validation
│       ├── JwtAuthenticationFilter.java # JWT interceptor
│       └── CustomUserDetailsService.java # User details loading

├── src/main/resources/
│   ├── application.properties           # Configuration (DB, port, etc.)
│   ├── application-dev.properties       # Development specific
│   └── ...
│
├── src/test/java/                       # Unit & Integration tests
│
├── pom.xml                              # Maven dependencies
└── mvnw / mvnw.cmd                      # Maven wrapper scripts
```

### Backend की Architecture Pattern

```
Request आता है:
    ↓
Controller receives request
    ↓
Validate input (DTOs + @Valid)
    ↓
Service layer → Business logic execute
    ↓
Repository → Database query
    ↓
JPA → Entity to/from database
    ↓
Response return to Frontend
```

---

## 💾 Database Architecture

**Technology**: MySQL 8

### Database Concept: Multi-Tenancy

```
Database में एक MASTER table है जिसमें सभी companies/tenants हैं:

TENANTS TABLE (Master)
├── id (Primary Key)
├── company_name
├── company_code (unique)
└── created_at

फिर अन्य सभी tables में TENANT_ID foreign key है जो data को isolate करती है:

USERS TABLE
├── id
├── tenant_id (Foreign Key → TENANTS)
├── name
├── email
├── role (TENANT_ADMIN, AGENT, CUSTOMER)
└── ...

TICKETS TABLE
├── id
├── tenant_id (Foreign Key → TENANTS)
├── title
├── description
├── status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
├── priority (LOW, MEDIUM, HIGH, URGENT)
├── assignee_id (FK → USERS)
├── creator_id (FK → USERS)
└── ...

यह ensure करता है कि:
✅ Company ABC के users company XYZ के tickets नहीं देख सकते
✅ Complete data isolation
✅ Secure multi-tenancy
```

### Database Schema Overview

```
Tentative Database Tables:

1. TENANTS
   - id (PK)
   - company_name
   - company_code (UNIQUE)
   - subscription_plan
   - created_at
   - is_active

2. USERS
   - id (PK)
   - tenant_id (FK)
   - name
   - email (UNIQUE)
   - password_hash
   - role (TENANT_ADMIN, AGENT, CUSTOMER)
   - status (ACTIVE, INACTIVE)
   - created_at

3. TICKETS
   - id (PK)
   - tenant_id (FK)
   - title
   - description
   - status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
   - priority (LOW, MEDIUM, HIGH, URGENT)
   - category
   - assignee_id (FK → USERS)
   - creator_id (FK → USERS)
   - created_at
   - updated_at
   - resolved_at

4. COMMENTS
   - id (PK)
   - ticket_id (FK)
   - user_id (FK)
   - comment_text
   - created_at

5. NOTIFICATIONS
   - id (PK)
   - user_id (FK)
   - type (TICKET_ASSIGNED, TICKET_UPDATED, etc.)
   - message
   - read_status
   - created_at

6. SLA_POLICIES
   - id (PK)
   - tenant_id (FK)
   - name
   - response_time_hours
   - resolution_time_hours
   - escalation_level

7. AUDIT_LOG
   - id (PK)
   - tenant_id (FK)
   - action
   - performed_by (FK → USERS)
   - timestamp
```

---

## 🔄 Complete Data Flow

### Scenario 1: New Company Registration

```
FRONTEND (React)
    ↓ 
User fills registration form (Company, Name, Email, Password)
    ↓
Register Page → AuthContext.register() → AuthService call
    ↓
POST /api/auth/register
    ↓
BACKEND (Spring Boot)
    ↓
AuthController.register(RegisterRequest)
    ↓
AuthService.register()
    ├─ Validate email uniqueness
    ├─ Create new Tenant (company) in DB
    └─ Create Tenant Admin User in DB
    ↓
JwtTokenProvider.generateToken() → JWT token create होता है
    ↓
Response: { token, userId, name, email, role, tenantId, company }
    ↓
FRONTEND
    ↓
localStorage.setItem('bd_token', token)
localStorage.setItem('bd_current_user', userPayload)
AuthContext update
    ↓
Redirect to Dashboard
```

### Scenario 2: User Creates a Ticket

```
FRONTEND
    ↓
User: Dashboard → "Create Ticket" button
    ↓
CreateTicket page loads
User fills: Title, Description, Priority, Category
    ↓
Form Submit → TicketService.createTicket()
    ↓
POST /api/tickets/create
Headers: { Authorization: "Bearer JWT_TOKEN" }
Body: { title, description, priority, category }
    ↓
BACKEND
    ↓
JwtAuthenticationFilter intercepts request
    ├─ Extract JWT token from header
    ├─ Validate token
    └─ Load user details (tenant_id भी extract होता है)
    ↓
TicketController.createTicket(TicketRequest)
    ↓
TicketService.createTicket()
    ├─ Get current user's tenant_id
    ├─ Create new Ticket entity with:
    │   ├─ tenant_id (current user's tenant)
    │   ├─ title, description, priority
    │   ├─ status = "OPEN"
    │   ├─ creator_id = current user
    │   └─ created_at = now()
    ├─ Save to Ticket table (via TicketRepository)
    ├─ Create notification for ticket creator
    └─ Return TicketDTO
    ↓
Response: { id: "T-1001", title, status: "OPEN", ... }
    ↓
FRONTEND
    ↓
TicketService response received
    ├─ Update localStorage (notifications)
    ├─ Show success toast: "Ticket created successfully!"
    └─ Redirect to Tickets page or TicketDetails
```

### Scenario 3: Ticket Assignment & SLA Trigger

```
AGENT (or Admin) looking at Tickets
    ↓
Unassigned ticket देखता है
    ↓
"Assign to me" button click
    ↓
FRONTEND
    ↓
PUT /api/tickets/{ticketId}/assign
Body: { assigneeId: current_user_id }
    ↓
BACKEND
    ↓
TicketController.assignTicket()
    ↓
TicketService.assignTicket()
    ├─ Verify current user belongs to same tenant as ticket
    ├─ Update ticket: assignee_id = selected agent
    ├─ Update ticket: status = "IN_PROGRESS"
    ├─ Create audit log entry
    ├─ Create notification for assigned agent
    ├─ TRIGGER SLA ENFORCEMENT:
    │   └─ SLAService.startSLATimer(ticketId)
    │       ├─ Get tenant's SLA policy
    │       ├─ Calculate: response_deadline = now + policy.response_time_hours
    │       ├─ Calculate: resolution_deadline = now + policy.resolution_time_hours
    │       ├─ Store deadlines in Ticket entity
    │       └─ Setup background job to check deadlines
    └─ Return updated Ticket
    ↓
FRONTEND
    ↓
Ticket status बदल जाता है "IN_PROGRESS" में
Assignee name दिखाई देता है
SLA timer start होता है (UI में visible)
```

### Scenario 4: Notification to Agent

```
BACKEND (Background Process)
    ↓
Scheduled Job (हर 5 minutes चलता है): CheckSLABreaches
    ↓
Scan all tickets for breaches
    ↓
IF ticket.response_deadline < now() AND not responded:
    ├─ Create escalation notification
    ├─ Assign to senior agent
    ├─ Mark as "ESCALATED"
    └─ Send email/SMS alert
    ↓
Store notification in NOTIFICATIONS table with:
    ├─ user_id = agent's id
    ├─ type = "SLA_BREACH_WARNING"
    └─ message = "Ticket T-1001 SLA response time exceeded!"
    ↓
FRONTEND (Real-time)
    ↓
Agent's browser polls: GET /api/notifications/unread
    ↓
Backend returns new notifications
    ↓
Red badge on NotificationBell component
    ↓
Agent clicks bell → Notifications page
    ↓
Shows: "Ticket T-1001 response time exceeded - Escalate?"
```

---

## 🛠️ Technology Stack

### Frontend Stack
```
┌─────────────────────────────────────┐
│ React 18.x (UI Library)            │
├─────────────────────────────────────┤
│ Vite (Build tool - Lightning fast)  │
├─────────────────────────────────────┤
│ React Router (Client-side routing)  │
├─────────────────────────────────────┤
│ Axios (HTTP client for API calls)   │
├─────────────────────────────────────┤
│ Context API (State management)      │
├─────────────────────────────────────┤
│ CSS (Styling)                       │
└─────────────────────────────────────┘
```

### Backend Stack
```
┌──────────────────────────────────────────┐
│ Spring Boot 4.1.0 (Framework)           │
├──────────────────────────────────────────┤
│ Spring Data JPA (ORM - Hibernate)       │
├──────────────────────────────────────────┤
│ Spring Security (Auth & Authorization)  │
├──────────────────────────────────────────┤
│ JWT (JSON Web Tokens)                   │
├──────────────────────────────────────────┤
│ MySQL 8 (Database)                      │
├──────────────────────────────────────────┤
│ Lombok (Code reduction)                 │
└──────────────────────────────────────────┘
```

### DevOps/Infrastructure
```
┌──────────────────────────────────────┐
│ Docker (Containerization)           │
├──────────────────────────────────────┤
│ Docker Compose (Multi-container)    │
├──────────────────────────────────────┤
│ MySQL 8 (Database container)        │
├──────────────────────────────────────┤
│ Spring Boot (App container)         │
└──────────────────────────────────────┘
```

---

## ⭐ Key Features & Purpose

### 1. **Multi-Tenancy** 🏢
**Purpose**: हर business को अपना isolated environment मिले
- Tenant table से company-level data separation
- Foreign keys सभी tables में tenant_id रखते हैं
- Users कभी दूसरे tenant का data नहीं देख सकते
- Cost-effective (एक infrastructure सभी के लिए)

### 2. **Ticket Management System** 🎫
**Purpose**: Customer issues को systematically track करना
- Create, Read, Update, Delete tickets
- Status tracking: OPEN → IN_PROGRESS → RESOLVED → CLOSED
- Priority levels: LOW, MEDIUM, HIGH, URGENT
- Assignment to specific agents
- Comment history

### 3. **Authentication & Authorization** 🔐
**Purpose**: सही users को सही access देना
- JWT tokens (Stateless authentication)
- Role-based access: TENANT_ADMIN, AGENT, CUSTOMER
- Protected routes in frontend
- Spring Security filters in backend
- Password hashing

### 4. **SLA Management** ⏱️
**Purpose**: Service level agreements enforce करना
- Response time limits (e.g., 1 hour)
- Resolution time limits (e.g., 24 hours)
- Automatic escalation on breach
- Audit trails

### 5. **Notification System** 🔔
**Purpose**: Users को real-time updates देना
- Ticket assignments
- Status changes
- SLA breaches
- Comments on tickets
- Unread notification count

### 6. **Dashboard & Analytics** 📊
**Purpose**: Business metrics और performance tracking
- Open tickets count
- Average resolution time
- SLA compliance %
- Agent performance stats
- Tenant analytics

### 7. **User Management** 👥
**Purpose**: Team members को manage करना
- User creation (admin function)
- Role assignment
- User activation/deactivation
- Profile management

---

## 🚀 How Everything Works Together

```
COMPLETE FLOW:

┌──────────────────┐
│  React Frontend  │
│   (Vite + Axios) │
└────────┬─────────┘
         │ HTTP/REST API calls
         │ (JWT in headers)
         ↓
┌──────────────────────────────────────┐
│  Spring Boot Backend                 │
│  ├─ Controllers (Routes)             │
│  ├─ Services (Business Logic)        │
│  ├─ Repositories (Database Access)   │
│  └─ Security (JWT + Spring Security) │
└────────┬─────────────────────────────┘
         │ SQL Queries (Hibernate ORM)
         ↓
┌──────────────────┐
│  MySQL Database  │
│  (Multi-tenant)  │
└──────────────────┘

Request Path:
Frontend Form → Axios Call → Backend Controller → Service → Repository → Database
Response Path:
Database → JPA Entity → Service → DTO → Controller → JSON Response → Frontend Update

Security:
- Frontend: localStorage में JWT token stored
- Each API request में token भेजा जाता है
- Backend: JwtAuthenticationFilter validate करता है
- Database: Tenant ID से isolation
```

---

## 📝 Key Points Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React + Vite | User interface |
| **API Client** | Axios | HTTP requests |
| **State** | Context API + localStorage | User & auth state |
| **Backend** | Spring Boot | REST APIs |
| **Auth** | JWT + Spring Security | Secure access |
| **Database** | MySQL + JPA | Data persistence |
| **Multi-tenancy** | Tenant ID foreign keys | Data isolation |
| **Notifications** | Polling + Database | Real-time updates |
| **SLA** | Scheduled jobs | Automated escalations |

---

## 🔍 File Flow Example: Creating a Ticket

```
1. frontend-react/src/pages/CreateTicket/CreateTicket.jsx
   └─ User fills form → Submit

2. frontend-react/src/services/TicketService.js
   └─ TicketService.createTicket(data) → Axios POST

3. Axios Interceptor (api.js)
   └─ Add Authorization header with JWT token

4. Network Request
   └─ POST http://backend:8080/api/tickets/create

5. Backend: backend/helpdesk-backend/src/main/java/com/helpdesk/controller/TicketController.java
   └─ @PostMapping("/create") → createTicket()

6. Backend: com/helpdesk/service/TicketService.java
   └─ createTicket() → Business logic

7. Backend: com/helpdesk/repository/TicketRepository.java
   └─ save(ticket) → JPA method

8. Hibernate ORM
   └─ INSERT INTO tickets (...) VALUES (...)

9. Database: MySQL
   └─ Record stored

10. Response travels back through same stack
    └─ Frontend receives JSON → Updates UI

11. frontend-react/src/services/mockData.js or localStorage
    └─ Local state updated
```

---

## ✅ Complete Architecture Summary

```
LAYERS:

┌─────────────────────────────────────────────────┐
│             FRONTEND LAYER                      │
│  (React Components, Pages, Services)            │
│  └─ User Interface & Business Logic             │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ REST API (JSON over HTTP)
                 │
┌─────────────────────────────────────────────────┐
│             API LAYER                           │
│  (Spring Boot Controllers & REST Endpoints)     │
│  └─ Request/Response handling                   │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ Service methods
                 │
┌─────────────────────────────────────────────────┐
│         BUSINESS LOGIC LAYER                    │
│  (Spring Boot Services)                         │
│  └─ Authentication, Ticket Management, SLA etc. │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ Repository methods
                 │
┌─────────────────────────────────────────────────┐
│         DATA ACCESS LAYER                       │
│  (Spring Data JPA Repositories)                 │
│  └─ Database queries                            │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ SQL Queries (Hibernate ORM)
                 │
┌─────────────────────────────────────────────────┐
│         DATABASE LAYER                          │
│  (MySQL - Multi-tenant with isolation)          │
│  └─ Data persistence                            │
└─────────────────────────────────────────────────┘
```

---

**Created for**: Multi-Tenant SaaS Helpdesk & Ticketing System  
**Last Updated**: 2026-06-30  
**Status**: Architecture Ready for Development
