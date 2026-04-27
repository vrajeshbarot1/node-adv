# 🚀 Advanced Microservices Task Management System

A high-performance, scalable, and secure task management platform built with a microservices architecture using Node.js, TypeScript, RabbitMQ, Redis, and PostgreSQL.

## 🌟 Key Features
- **Microservices Architecture**: 6 decoupled services communicating via REST and RabbitMQ.
- **Async Messaging**: Event-driven notifications using RabbitMQ.
- **High Performance**: Redis caching for frequently accessed data.
- **Enterprise Security**: JWT, OAuth2 (Google), 2FA, and RBAC.
- **Scalable Storage**: File uploads managed via Multer and AWS S3.
- **Benchmarking**: Built-in performance testing with Autocannon and Clinic.js.

## 📁 Project Structure
- `apps/`: Contains all microservices.
- `scripts/`: Benchmarking and utility scripts.
- `docker-compose.yml`: Full stack orchestration.

## 📖 Comprehensive Guide
For a detailed breakdown of all endpoints, architecture decisions, and tips on how to showcase this project to an interviewer, check out the:
### 👉 [Project Guide (MD)](./project_guide.md)

## 🚦 Quick Start
1. **Clone & Install**:
   ```bash
   npm install
   ```
2. **Start Infrastructure**:
   ```bash
   docker-compose up -d
   ```
3. **Seed Database**:
   ```bash
   node seed.js
   ```
4. **Access API**: Gateway is running at `http://localhost:3000/v1`.

---

## 🛠️ Performance Testing
Run the benchmark script to see the system's throughput:
```bash
npm run bench
```
Generate a performance profile:
```bash
npm run profile:auth
```
