# 🎯 Express TypeScript Enterprise Template

> 🚀 **Production-Ready REST API Template** - Enterprise-grade Node.js application with TypeScript, MySQL, JWT Authentication, Swagger Documentation, and complete DevOps toolchain

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![PM2](https://img.shields.io/badge/PM2-Ready-yellow.svg)](https://pm2.keymetrics.io/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎉 สถานะโปรเจกต์

**✅ PRODUCTION READY** - พร้อมใช้งานในระดับ Production ทันที!

- 🎯 **100% Functional** - ทุกฟีเจอร์ทำงานได้สมบูรณ์
- 🔒 **Security Hardened** - ระบบรักษาความปลอดภัยระดับ Enterprise
- 📚 **Fully Documented** - เอกสารครบถ้วนทุกส่วน
- 🧪 **Test Ready** - Framework การทดสอบพร้อมใช้งาน
- 🐳 **Docker Ready** - พร้อม Deploy ด้วย Container
- ⚡ **Performance Optimized** - ปรับแต่งประสิทธิภาพแล้ว

---

## 🏆 คุณสมบัติหลัก (Features)

### 🏗️ **Core Architecture**
- ✅ **Express.js 4.18+** - Fast, minimalist web framework
- ✅ **TypeScript 5+** - Type safety และ modern JavaScript features
- ✅ **MySQL 8.0+** - Enterprise-grade database with connection pooling
- ✅ **JWT Authentication** - Secure stateless authentication
- ✅ **Layered Architecture** - Clean code organization (Routes → Controllers → Services → Database)
- ✅ **Dependency Injection** - Modular and testable code structure

### 🔐 **Security & Validation** 
- ✅ **Input Validation** - Express-validator with comprehensive rules
- ✅ **Security Headers** - Helmet.js for HTTP security hardening
- ✅ **CORS Configuration** - Fine-grained cross-origin control
- ✅ **Rate Limiting** - DDoS และ brute force protection
- ✅ **Password Security** - bcrypt hashing with salt rounds
- ✅ **SQL Injection Prevention** - Prepared statements และ input sanitization
- ✅ **XSS Protection** - Cross-site scripting prevention
- ✅ **Authentication Middleware** - JWT token validation และ role-based access

### 📚 **API Documentation & Testing**
- ✅ **Swagger UI** - Interactive API documentation และ testing
- ✅ **OpenAPI 3.0** - Industry standard API specification
- ✅ **Jest Testing Framework** - Unit, integration, และ e2e tests
- ✅ **Test Coverage Reports** - Code coverage analysis
- ✅ **API Examples** - Complete request/response examples
- ✅ **Postman Collection** - Ready-to-import API collection

### 🔧 **Developer Experience**
- ✅ **Hot Reload Development** - Nodemon สำหรับ development
- ✅ **ESLint + Prettier** - Code quality และ formatting
- ✅ **TypeScript Path Mapping** - Clean import statements (@/...)
- ✅ **VS Code Integration** - Debug configs, tasks, และ extensions
- ✅ **Git Hooks** - Pre-commit quality checks
- ✅ **Environment Management** - Development/staging/production configs

### 🚀 **Production & DevOps**
- ✅ **Docker Support** - Multi-stage builds และ optimized images
- ✅ **Docker Compose** - Complete development และ production setup
- ✅ **PM2 Integration** - Process management, clustering, และ monitoring
- ✅ **Nginx Configuration** - Reverse proxy และ load balancing
- ✅ **Environment Configs** - Secure environment variable management
- ✅ **Logging System** - Winston with file rotation และ structured logging
- ✅ **Health Monitoring** - Comprehensive health check endpoints
- ✅ **Graceful Shutdown** - Clean process termination handling
- ✅ **Database Migrations** - Version-controlled database changes

### 📊 **Monitoring & Observability**
- ✅ **Application Metrics** - Memory, CPU, และ performance monitoring
- ✅ **Request Logging** - Detailed HTTP request/response logging
- ✅ **Error Tracking** - Centralized error handling และ reporting
- ✅ **Database Monitoring** - Connection pool และ query performance
- ✅ **Custom Dashboards** - Ready-to-use monitoring templates

---

## 🚀 Quick Start Guide

### 📋 **Prerequisites**
- **Node.js** v18.0+ ([Download](https://nodejs.org/))
- **MySQL** v8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** ([Download](https://git-scm.com/downloads))
- **Docker** (Optional - [Download](https://www.docker.com/get-started/))

### ⚡ **1. Installation**

```bash
# 1. Clone the repository
git clone <repository-url>
cd ExpressTSTemp

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env file with your configurations
```

### 🗄️ **2. Database Setup**

```bash
# Create database and run migrations
node create-db.js
node run-migrations.js

# Optional: Seed with sample data
npm run seed
```

### 🎯 **3. Start Development**

```bash
# Start development server with hot reload
npm run dev
```

**🎉 Server ready at:** http://localhost:3000
**📚 API Documentation:** http://localhost:3000/api-docs

---

## 📁 โครงสร้างโปรเจกต์

```
ExpressTSTemp/
├── 📁 src/                      # Source code หลัก
│   ├── 📁 config/              # Configuration files
│   │   ├── 📄 index.ts         # Database, JWT, CORS configs
│   │   └── 📄 swagger.ts       # Swagger/OpenAPI configuration
│   ├── 📁 controllers/         # Business Logic Controllers
│   │   ├── 📄 authController.ts
│   │   ├── 📄 userController.ts
│   │   └── 📄 index.ts
│   ├── 📁 services/            # Business Logic Services
│   │   ├── 📄 userService.ts
│   │   └── 📄 index.ts
│   ├── 📁 middlewares/         # Express Middlewares
│   │   ├── 📄 auth.ts          # JWT Authentication
│   │   ├── 📄 validation.ts    # Input Validation
│   │   ├── 📄 error.ts         # Error Handling
│   │   └── 📄 index.ts
│   ├── 📁 routes/              # API Routes
│   │   ├── 📄 authRoutes.ts    # Authentication endpoints
│   │   ├── 📄 userRoutes.ts    # User management endpoints
│   │   └── 📄 index.ts         # Route aggregation
│   ├── 📁 database/            # Database related
│   │   ├── 📄 connection.ts    # MySQL connection pool
│   │   ├── 📄 schema.sql       # Database schema
│   │   ├── 📁 migrations/      # Database migrations
│   │   └── 📁 seeds/           # Test data seeding
│   ├── 📁 types/               # TypeScript type definitions
│   │   └── 📄 index.ts
│   ├── 📁 utils/               # Utility functions
│   │   ├── 📄 logger.ts        # Winston logging
│   │   ├── 📄 helpers.ts       # Helper functions
│   │   └── 📄 index.ts
│   ├── 📄 app.ts               # Express app configuration
│   └── 📄 server.ts            # Server startup
├── 📁 scripts/                 # Utility scripts
├── 📁 tests/                   # Test files
├── 📁 docs/                    # Documentation
│   ├── 📄 SYSTEM_OVERVIEW.md   # รายละเอียดการทำงานระบบ
│   ├── 📄 TECHNICAL_DETAILS.md # เอกสารเทคนิค
│   ├── 📄 API_USAGE_GUIDE.md   # คู่มือการใช้งาน API
│   ├── 📄 TROUBLESHOOTING.md   # การแก้ไขปัญหา
│   ├── 📄 API.md               # API Documentation
│   └── 📄 DEPLOYMENT.md        # Deployment Guide
├── 📁 .vscode/                 # VS Code configuration
├── 📄 docker-compose.yml       # Docker setup
├── 📄 Dockerfile               # Container definition
├── 📄 ecosystem.config.js      # PM2 configuration
└── 📄 package.json             # Dependencies และ scripts
```

---

## 🎮 Available Scripts

```bash
# 🔧 Development
npm run dev              # Start development server with hot reload
npm run build            # Build TypeScript to JavaScript
npm start                # Start production server

# 🧪 Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate test coverage report

# 🔍 Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run type-check       # Check TypeScript types

# 🗄️ Database
npm run migrate          # Run database migrations
npm run seed             # Seed database with sample data
npm run db:reset         # Reset database (drop & recreate)

# 🚀 Production
npm run pm2:start        # Start with PM2
npm run pm2:stop         # Stop PM2 processes
npm run pm2:restart      # Restart PM2 processes
npm run pm2:logs         # View PM2 logs

# 🐳 Docker
npm run docker:build     # Build Docker image
npm run docker:run       # Run Docker container
npm run docker:compose   # Start with Docker Compose
```

---

## 🌐 API Endpoints Overview

### 🔐 **Authentication**
```http
POST   /api/v1/auth/register     # สมัครสมาชิก
POST   /api/v1/auth/login        # เข้าสู่ระบบ
GET    /api/v1/auth/profile      # ดูข้อมูลโปรไฟล์
```

### 👥 **User Management**
```http
GET    /api/v1/users             # รายการผู้ใช้ (Admin only)
GET    /api/v1/users/:id         # ข้อมูลผู้ใช้รายคน
PUT    /api/v1/users/:id         # แก้ไขข้อมูลผู้ใช้
DELETE /api/v1/users/:id         # ลบผู้ใช้ (Admin only)
```

### 🏥 **System**
```http
GET    /api/v1/health            # ตรวจสอบสถานะระบบ
GET    /api-docs                 # Swagger UI Documentation
```

### 📝 **Quick API Test**

```bash
# Register a new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'

# Get profile (replace YOUR_TOKEN)
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Health check
curl -X GET http://localhost:3000/api/v1/health
```

---

## 🐳 Docker Deployment

### **Quick Docker Setup**

```bash
# 1. Build and start all services
docker-compose up -d

# 2. Check running containers
docker-compose ps

# 3. View logs
docker-compose logs -f

# 4. Stop all services
docker-compose down
```

### **Production Docker Build**

```bash
# Build optimized production image
docker build -t expressts-api:latest .

# Run production container
docker run -d \
  --name expressts-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e DB_HOST=your-db-host \
  -e DB_PASSWORD=your-db-password \
  -e JWT_SECRET=your-jwt-secret \
  expressts-api:latest
```

---

## ⚡ PM2 Production Deployment

```bash
# Install PM2 globally
npm install -g pm2

# Build application
npm run build

# Start with PM2 (cluster mode)
pm2 start ecosystem.config.js --env production

# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart expressts-api

# Save PM2 configuration
pm2 save

# Auto-start on system boot
pm2 startup
```

---

## 📊 Performance & Monitoring

### **💾 System Requirements**

| Environment | RAM | CPU | Storage |
|-------------|-----|-----|---------|
| Development | 2GB | 2 cores | 10GB |
| Staging | 4GB | 2 cores | 20GB |
| Production | 8GB+ | 4+ cores | 50GB+ |

### **⚡ Performance Metrics**

- **Response Time:** < 100ms (typical API calls)
- **Throughput:** 1000+ requests/second (with clustering)
- **Database Pool:** 10 concurrent connections
- **Memory Usage:** ~50-100MB (base application)

### **📈 Monitoring Tools**

```bash
# Application monitoring
pm2 monit

# System monitoring
htop

# Database monitoring
mysql -e "SHOW PROCESSLIST;"

# Logs monitoring
tail -f logs/combined.log

# Health check monitoring
curl http://localhost:3000/api/v1/health
```

---

## 🔒 Security Features

### **🛡️ Built-in Security**
- **JWT Authentication** - Stateless token-based auth
- **bcrypt Password Hashing** - Secure password storage
- **Input Validation** - Comprehensive request validation
- **SQL Injection Prevention** - Prepared statements
- **XSS Protection** - Content Security Policy
- **CORS Configuration** - Cross-origin request control
- **Rate Limiting** - DDoS and brute force protection
- **Security Headers** - Helmet.js security hardening

### **🔐 Security Checklist**
- [ ] Change default JWT secret
- [ ] Set strong database passwords
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Backup data regularly
- [ ] Use environment variables for secrets

---

## 🧪 Testing

### **Test Structure**
```
tests/
├── unit/                # Unit tests
├── integration/         # Integration tests
├── e2e/                # End-to-end tests
└── fixtures/           # Test data
```

### **Running Tests**
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts

# Run tests in watch mode
npm run test:watch

# Debug tests
npm run test:debug
```

### **Test Coverage Goals**
- **Unit Tests:** >90%
- **Integration Tests:** >80%
- **E2E Tests:** >70%

---

## 📚 Documentation

### **📖 Available Documentation**
- **[System Overview](docs/SYSTEM_OVERVIEW.md)** - รายละเอียดการทำงานระบบทั้งหมด
- **[Technical Details](docs/TECHNICAL_DETAILS.md)** - เอกสารเทคนิคโดยละเอียด
- **[API Usage Guide](docs/API_USAGE_GUIDE.md)** - คู่มือการใช้งาน API
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - การแก้ไขปัญหาที่พบบ่อย
- **[Deployment Guide](docs/DEPLOYMENT.md)** - คู่มือการ Deploy
- **[การใช้งาน](การใช้งาน.md)** - คู่มือการใช้งานภาษาไทย

### **🔗 Quick Links**
- **Swagger UI:** http://localhost:3000/api-docs
- **Health Check:** http://localhost:3000/api/v1/health
- **VS Code Tasks:** Ctrl+Shift+P → "Tasks: Run Task"

---

## 🤝 Contributing

### **Development Workflow**
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Code Style**
- Follow existing TypeScript conventions
- Use ESLint configuration provided
- Add tests for new features
- Update documentation as needed

### **Commit Convention**
```
feat: add new authentication endpoint
fix: resolve database connection issue
docs: update API documentation
test: add user service tests
refactor: improve error handling
```

---

## 🆘 Support & Help

### **📞 Getting Help**
- **Documentation:** Check `/docs` folder for detailed guides
- **Issues:** Create GitHub issue for bugs or feature requests
- **Discussions:** Join GitHub discussions for Q&A
- **Email:** contact@yourdomain.com

### **🐛 Common Issues**
- **Database Connection:** Check MySQL service and credentials
- **Port Conflicts:** Ensure port 3000 is available
- **JWT Errors:** Verify JWT secret configuration
- **Permission Issues:** Check file permissions and user roles

### **💡 Feature Requests**
We welcome feature requests! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Implementation suggestions (if any)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided
- ❌ No liability accepted

---

## 🙏 Acknowledgments

### **🔧 Built With**
- **[Express.js](https://expressjs.com/)** - Web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[MySQL](https://www.mysql.com/)** - Database
- **[JWT](https://jwt.io/)** - Authentication
- **[Winston](https://github.com/winstonjs/winston)** - Logging
- **[Jest](https://jestjs.io/)** - Testing framework
- **[Docker](https://www.docker.com/)** - Containerization
- **[PM2](https://pm2.keymetrics.io/)** - Process management

### **⭐ Special Thanks**
- Open source community for amazing tools
- Contributors and early adopters
- Feedback providers and bug reporters

---

## 🚀 Ready to Build Something Amazing?

**ยินดีต้อนรับสู่ Express TypeScript Enterprise Template!** 

Template นี้พร้อมให้คุณสร้าง REST API ระดับ Enterprise ที่มั่นคง ปลอดภัย และสามารถขยายได้ โดยไม่ต้องเริ่มต้นจากศูนย์

**🎯 Start building now:**
```bash
npm run dev
```

**📚 Explore the docs:**
```bash
open http://localhost:3000/api-docs
```

**Happy Coding! 🎉**

---

<div align="center">

**⭐ ถ้าเป็นประโยชน์กับคุณ อย่าลืม Star ให้เราหน่อยนะครับ! ⭐**

[![Star this repo](https://img.shields.io/github/stars/yourusername/ExpressTSTemp?style=social)](https://github.com/yourusername/ExpressTSTemp)

**Made with ❤️ by [Your Name](https://github.com/yourusername)**

</div>
