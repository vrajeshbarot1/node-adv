# 🚀 Advanced Node.js Microservices Project Guide

This document serves as a comprehensive guide for understanding, exploring, and showcasing this microservices-based task management application.

---

## 🏗️ Architecture Overview

The project is built using a **Microservices Architecture**, where each service is responsible for a specific business domain. Communication between services is handled via **REST APIs** (synchronous) and **RabbitMQ** (asynchronous).

### Key Technologies:
- **Language**: TypeScript
- **Framework**: Express.js
- **Databases**: PostgreSQL (Relational), Redis (Caching)
- **ORM**: Prisma
- **Communication**: RabbitMQ (Pub/Sub for notifications)
- **Containerization**: Docker & Docker Compose
- **Security**: JWT Authentication, 2FA (Speakeasy/QRCode), Role-Based Access Control (RBAC)
- **Benchmarking**: Autocannon, Clinic.js
- **File Handling**: Multer (parsing), AWS SDK (S3 storage)

---

## 🔌 API Endpoints Reference

All endpoints are accessible through the **API Gateway** on port `3000`.

### 🔐 Auth Service (`/v1/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate and receive JWT |
| POST | `/refresh-token` | Obtain a new access token |
| GET | `/google` | Initiate Google OAuth2 flow |
| GET | `/profile` | Get current authenticated user profile |
| POST | `/2fa/setup` | Generate 2FA QR Code |
| POST | `/2fa/verify` | Verify and enable 2FA |
| POST | `/2fa/login` | Complete login using 2FA token |

### 👥 User Service (`/v1/users`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/:id` | Get user profile by ID |
| PATCH | `/:id/promote` | Promote a user to MANAGER or ADMIN |
| POST | `/assign-to-manager`| Assign an employee to a manager |
| GET | `/my-team` | List all employees under the current manager |
| GET | `/all` | List all users (Admin only) |

### 📋 Task Service (`/v1/tasks`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/` | Create a new task (Manager only) |
| GET | `/` | Get tasks (My tasks or Team tasks based on role) |
| PATCH | `/:id/status` | Update task status (PENDING, IN_PROGRESS, COMPLETED) |

### 🔔 Notification Service (`/v1/notifications`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/` | Get notifications for the current user |
| GET | `/all` | Get all system notifications (Admin/Audit) |
| PATCH | `/:id/read` | Mark a notification as read |

### 📁 File Service (`/v1/files`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/upload` | Upload a file to S3 (uses Multer) |

---

## 💡 How to Showcase to an Interviewer

When presenting this project, focus on the **Technical Decisions** and **Advanced Patterns** you implemented.

### 1. The "Microservices Story"
- **Problem**: Monoliths are hard to scale.
- **Solution**: Split logic into Auth, Task, User, and Notification services.
- **Example**: Show how creating a Task in the `task-service` automatically triggers a notification in the `notification-service` via **RabbitMQ**. This decouples the services and improves reliability.

### 2. High-Performance Patterns
- **Redis Caching**: Explain how you used Redis in the `task-service` to cache task lists. Mention the **Cache Invalidation** strategy (invalidating cache on create/update) to ensure data consistency.
- **Benchmarking**: Show the `scripts/benchmark.js` file. Explain how you use **Autocannon** to stress test the system and **Clinic.js** to find bottlenecks.

### 3. Security Excellence
- **2FA Flow**: Demonstrate the 2FA setup. It shows you understand security beyond simple passwords.
- **RBAC**: Explain how you implemented granular permissions (e.g., Managers can only see their team, Admins see everyone).

### 4. Database Integrity
- **Distributed Consistency**: Discuss how the `seed.js` script handles ID consistency across multiple databases by capturing auto-generated UUIDs from the Auth DB and propagating them to the User DB.

### 5. Cloud Native Ready
- **Docker Compose**: Show the orchestration. Point out the use of `env_file` for clean configuration management.
- **Multer & S3**: Explain how you handle file uploads using a streaming approach with AWS S3, ensuring the microservice stays stateless.

---

## 🛠️ Step-by-Step Demo Flow
1. **Start**: `docker-compose up -d`
2. **Seed**: `node seed.js` (Show the clean logs)
3. **Login**: Use Postman to login as `manager1@taskapp.com`.
4. **Create Task**: Assign a task to an employee.
5. **Prove Async**: Immediately check the `notification-service` logs to show the message received from RabbitMQ.
6. **Benchmark**: Run `npm run bench` to show the Req/Sec performance.
7. **Profile**: Run `npm run profile:auth` to show your ability to debug and optimize.
