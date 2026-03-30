# Journal App (Spring Boot Backend)

A secure and scalable RESTful backend application for managing personal journal entries.
Built using **Spring Boot**, following clean architecture principles, with   
**JWT-based authentication**, structured exception handling, and unit testing.

---

## Features

*  JWT Authentication & Authorization
*  User Signup & Login
*  Get current user profile
*  Change password (with old password validation)
*  Full CRUD for journal entries
*  User-specific data access (no cross-user access)
*  DTO + Mapper architecture (no entity exposure)
* ️ Global Exception Handling with structured responses
*  Request validation using annotations
*  Logging using SLF4J
*  Swagger/OpenAPI documentation
*  Basic unit & controller testing

---

## Tech Stack

* **Java 17**
* **Spring Boot**
* **Spring Security**
* **JWT (JSON Web Token)**
* **MongoDB**
* **Maven**
* **Lombok**
* **Springdoc OpenAPI (Swagger)**

---

## Authentication Flow

1. User sends login credentials.
2. Credentials are validated.
3. On success, a **JWT token** is generated.
4. Token is sent in requests via:

```text
Authorization: Bearer <token>
```

5. A custom **JWT filter**:

    * Extracts token
    * Validates it
    * Sets authentication in **SecurityContext**

6. Protected endpoints are accessible only with a valid token.

---

## API Endpoints

### Auth APIs

| Method | Endpoint     | Description       |
| ------ | ------------ | ----------------- |
| POST   | /auth/signup | Register new user |
| POST   | /auth/login  | Login & get JWT   |

---

### User APIs (Protected)

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| GET    | /user/me         | Get current user details |
| POST   | /user/changePass | Change user password     |

---

### Journal APIs (Protected)

| Method | Endpoint             | Description          |
| ------ | -------------------- | -------------------- |
| POST   | /journal/create      | Create journal entry |
| GET    | /journal/getAll      | Get all user entries |
| GET    | /journal/get/{id}    | Get entry by ID      |
| PATCH  | /journal/update/{id} | Partial update entry |
| DELETE | /journal/delete/{id} | Delete entry         |

---

## Security

* Passwords encrypted using **BCrypt**
* Stateless authentication using **JWT**
* Custom **JWT filter** for request validation
* Password change requires **old password verification**
* Proper HTTP responses:

    * `401 Unauthorized` → invalid/missing token
    * `403 Forbidden` → accessing another user’s data

---

## Testing

* ✅ Unit tests using **Mockito**
* ✅ Service layer tested for:
    * Duplicate user signup
    * Invalid login scenarios
    * Password validation logic
* ✅ Controller tests using **MockMvc**
* Focus on business logic and API behavior

---

## API Documentation (Swagger)

* Integrated **Springdoc OpenAPI**
* Interactive API testing via Swagger UI
* Supports JWT authentication using **Authorize button**
* Secured endpoints can be tested directly from UI

---

## Logging

* Implemented using **SLF4J**
* Logging added across:
    * Controllers (request tracking)
    * Services (business logic)
    * Security layer (authentication flow)
* Uses appropriate log levels:
    * `INFO` → important events
    * `DEBUG` → internal flow
    * `WARN` → invalid/suspicious actions
    * `ERROR` → failures

---

##  Exception Handling

Centralized using `@ControllerAdvice`

| Scenario              | Status Code |
| --------------------- | ----------- |
| Validation failure    | 400         |
| Bad request           | 400         |
| Unauthorized          | 401         |
| Forbidden             | 403         |
| Resource not found    | 404         |
| Internal server error | 500         |

---

##  Project Structure

```
src/main/java
└── com.example.legion.journalApp2
    ├── config
    ├── controller
    ├── dto
    │   ├── request
    │   └── response
    ├── entity
    ├── enums
    ├── exception
    ├── mapper
    ├── repository
    ├── security
    ├── service
    └── JournalApp2Application
    
src/test/java 
└── com.example.legion.journalApp2 
    ├── controller 
    └── service
```

---

## Key Design Decisions

* **DTO Pattern** → prevents exposing internal database structure
* **Mapper Layer** → clean transformation logic
* **PATCH over PUT** → supports partial updates
* **Constructor Injection** → improves testability
* **Stateless APIs** → scalable and secure

---

##  Sample Request

```json
POST /journal/create
Authorization: Bearer <token>

{
  "title": "My Day",
  "content": "Today I built a backend like a beast.",
  "sentiment": "HAPPY"
}
```

---

## Future Improvements

* Role-based authorization (RBAC)
* Pagination & sorting
* Refresh tokens
* Rate limiting
* Full integration testing

---

## Learning Outcomes

* Implemented JWT authentication from scratch
* Understood Spring Security filter chain deeply
* Built secure user-specific access control
* Implemented password change with validation
* Learned structured exception handling
* Added API documentation using Swagger
* Implemented logging for better observability
* Wrote unit and controller tests

---

## Author

**Priyanshu Katwal**  
Backend Developer | Java | Spring Boot

