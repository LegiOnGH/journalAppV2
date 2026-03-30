# Journal App (Spring Boot Backend)

A secure RESTful backend application for managing personal journal entries.  
Built using Spring Boot with proper architecture, JWT-based authentication, and user-specific data access.

---

## Features

- **JWT Authentication & Authorization**
- User Signup & Login
- Create, Read, Update, Delete (CRUD) journal entries
- User-specific data access (no cross-user access)
- DTO + Mapper architecture (no direct entity exposure)
- Global Exception Handling (proper HTTP status codes)
- Clean layered architecture (Controller → Service → Repository)

---

## Tech Stack

- **Java**
- **Spring Boot**
- **Spring Security**
- **JWT (JSON Web Token)**
- **MongoDB**
- **Maven**

---

## Authentication Flow

1. User sends login credentials.
2. Credentials are validated using Spring Security.
3. On success, a **JWT token** is generated.
4. Token is sent in every request via:
Authorization: Bearer 
5. JWT filter validates token and sets authentication in Security Context.
6. Only authenticated users can access protected APIs.

---

## API Endpoints

### Auth APIs

| Method | Endpoint      | Description        |
|--------|---------------|--------------------|
| POST   | /auth/signup  | Register new user  |
| POST   | /auth/login   | Login and get JWT  |

---

### Journal APIs (Protected)

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | /journal/create       | Create journal entry           |
| GET    | /journal/getAll       | Get all user entries           |
| GET    | /journal/get/{id}     | Get specific entry             |
| PATCH  | /journal/update/{id}  | Update entry (partial update)  |
| DELETE | /journal/delete/{id}  | Delete entry                   |

---

## Security

- Passwords are encrypted using **BCrypt**
- JWT ensures **stateless authentication**
- Users can only access **their own journal entries**
- Unauthorized access returns:
  - `401 Unauthorized` → invalid/missing token
  - `403 Forbidden` → accessing others' data

---

## Project Structure

src/main/java  
└── com.example.legion.journalApp2  
     ├──config  
     ├──controller  
     ├──dto  
     │      ├──request  
     │      └──response  
     ├── entity  
     ├── enums  
     ├──exception   
     ├──mapper  
     ├──repository   
     ├──security  
     ├──service  
     └──JournalApp2Application

---

## Exception Handling

Handled using `@ControllerAdvice`:

| Scenario               | Status Code |
|------------------------|------------|
| Resource not found     | 404        |
| Unauthorized access    | 401        |
| Forbidden action       | 403        |
| Invalid request        | 400        |
| Internal error         | 500        |

---

## Key Design Decisions

- **DTO Pattern** → prevents exposing internal DB structure
- **Mapper Layer** → clean separation of concerns
- **PATCH over PUT** → supports partial updates
- **Constructor Injection** → better than field injection
- **Stateless APIs** → scalable and secure

---

## Sample Request

### Create Entry

```json
POST /journal
Authorization: Bearer <token>

{
  "title": "My Day",
  "content": "Today I built a backend like a beast."
}
```

---

## Future Improvements
- Role-based authorization
- Pagination & sorting
- Swagger API documentation
- Unit & integration tests

---

## Learning Outcomes
- Implemented JWT authentication from scratch
- Understood Spring Security filter chain
- Learned exception handling deeply
- Built a real-world backend with proper architecture

---

## Author
**Priyanshu Katwal**  
Built as part of backend development and interview preparation.
