# Express TypeScript Enterprise Template - รายละเอียดการทำงาน

## 📋 ภาพรวมระบบ

Template นี้เป็น **Enterprise-grade REST API** ที่สร้างด้วย:

- **Node.js + Express.js** - Web Framework
- **TypeScript** - Type Safety และ Modern JavaScript
- **MySQL** - Relational Database
- **JWT Authentication** - User Authentication & Authorization
- **Swagger UI** - API Documentation
- **Docker** - Containerization
- **PM2** - Production Process Management

---

## 🏗️ โครงสร้างโปรเจกต์

```
ExpressTSTemp/
├── src/                     # Source code หลัก
│   ├── config/             # Configuration files
│   │   ├── index.ts        # Database, JWT, CORS configs
│   │   └── swagger.ts      # Swagger/OpenAPI configuration
│   ├── controllers/        # Business Logic Controllers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   └── index.ts
│   ├── services/           # Business Logic Services
│   │   ├── userService.ts
│   │   └── index.ts
│   ├── middlewares/        # Express Middlewares
│   │   ├── auth.ts         # JWT Authentication
│   │   ├── validation.ts   # Input Validation
│   │   ├── error.ts        # Error Handling
│   │   └── index.ts
│   ├── routes/             # API Routes
│   │   ├── authRoutes.ts   # Authentication endpoints
│   │   ├── userRoutes.ts   # User management endpoints
│   │   └── index.ts        # Route aggregation
│   ├── database/           # Database related
│   │   ├── connection.ts   # MySQL connection pool
│   │   ├── schema.sql      # Database schema
│   │   ├── migrations/     # Database migrations
│   │   └── seeds/          # Test data seeding
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── logger.ts       # Winston logging
│   │   ├── helpers.ts      # Helper functions
│   │   └── index.ts
│   ├── app.ts              # Express app configuration
│   └── server.ts           # Server startup
├── scripts/                # Utility scripts
├── tests/                  # Test files
├── docs/                   # Documentation
├── .vscode/                # VS Code configuration
├── docker-compose.yml      # Docker setup
├── Dockerfile              # Container definition
├── ecosystem.config.js     # PM2 configuration
└── package.json            # Dependencies และ scripts
```

---

## 🚀 การเริ่มต้นระบบ (Server Startup Flow)

### 1. **Entry Point: `src/server.ts`**

```typescript
// server.ts - จุดเริ่มต้นของระบบ
async function startServer() {
  try {
    const app = new App(); // สร้าง Express app instance
    await app.connectDatabase(); // เชื่อมต่อฐานข้อมูล MySQL
    app.listen(); // เริ่ม HTTP server

    // Graceful shutdown handlers
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}
```

### 2. **App Configuration: `src/app.ts`**

```typescript
class App {
  constructor() {
    this.app = express();
    this.db = Database.getInstance();
    this.initializeMiddlewares(); // ติดตั้ง middlewares
    this.initializeSwagger(); // ตั้งค่า Swagger UI
    this.initializeRoutes(); // กำหนด API routes
    this.initializeErrorHandling(); // จัดการ errors
  }
}
```

---

## 🔐 Authentication & Authorization System

### **JWT Authentication Flow:**

1. **User Registration** (`POST /api/v1/auth/register`)

   ```typescript
   // Input validation → Password hashing → Store in DB → Generate JWT
   const hashedPassword = await bcrypt.hash(password, 12);
   const user = await userService.createUser({
     ...userData,
     password: hashedPassword,
   });
   const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
   ```

2. **User Login** (`POST /api/v1/auth/login`)

   ```typescript
   // Validate credentials → Generate JWT token
   const isValidPassword = await bcrypt.compare(password, user.password);
   if (isValidPassword) {
     const token = jwt.sign({ userId: user.id }, JWT_SECRET);
     return { user, token };
   }
   ```

3. **Protected Routes** (Middleware: `authenticate`)
   ```typescript
   // Extract token → Verify JWT → Attach user to request
   const token = req.headers.authorization?.replace("Bearer ", "");
   const decoded = jwt.verify(token, JWT_SECRET);
   req.user = await userService.getUserById(decoded.userId);
   next();
   ```

---

## 🗄️ Database Integration (MySQL)

### **Connection Pool Management:**

```typescript
class Database {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
      connectionLimit: 10, // สูงสุด 10 connections
      charset: "utf8mb4",
      idleTimeout: 60000,
      queueLimit: 0,
    });
  }

  async query(sql: string, params?: unknown[]): Promise<any> {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }
}
```

### **Database Schema:**

```sql
-- users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- เพิ่ม indexes สำหรับ performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

---

## ✅ Input Validation System

### **Validation Middleware:**

```typescript
// Registration validation
export const validateRegistration = [
  body("name")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and number"),
];

// Usage in routes
router.post(
  "/register",
  validate(validateRegistration),
  authController.register
);
```

---

## 🛡️ Security Features

### **1. Security Middlewares:**

```typescript
// Helmet - Security headers
app.use(helmet());

// CORS - Cross-Origin Resource Sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Rate Limiting - ป้องกัน DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
```

### **2. Password Security:**

```typescript
// Password hashing with bcrypt (salt rounds: 12)
const hashedPassword = await bcrypt.hash(password, 12);

// Password comparison
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

### **3. JWT Token Security:**

```typescript
// Token generation with expiration
const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
  expiresIn: "7d",
  issuer: "express-ts-template",
});

// Token verification
const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
```

---

## 📝 Logging System (Winston)

### **Logger Configuration:**

```typescript
const logger = winston.createLogger({
  level: config.logging.level || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console logging for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // File logging for production
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});
```

### **Usage Examples:**

```typescript
logger.info("Server started on port 3000");
logger.warn("Deprecated API endpoint used");
logger.error("Database connection failed", { error: error.message });
```

---

## 🚨 Error Handling System

### **Global Error Handler:**

```typescript
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let err = { ...error };

  // Log error
  logger.error(error);

  // MySQL duplicate entry
  if (error.code === "ER_DUP_ENTRY") {
    err = new AppError("Duplicate entry", 400);
  }

  // MySQL foreign key constraint
  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    err = new AppError("Referenced record does not exist", 400);
  }

  // Validation errors
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors)
      .map((val: any) => val.message)
      .join(", ");
    err = new AppError(message, 400);
  }

  // Send error response
  ResponseUtils.error(
    res,
    err.message || "Server Error",
    err.message,
    err.statusCode || 500
  );
};
```

### **Custom Error Classes:**

```typescript
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

---

## 📚 API Documentation (Swagger)

### **Swagger Configuration:**

```typescript
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Express TypeScript Template API",
      version: "1.0.0",
      description: "Enterprise-grade Express.js API template",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};
```

### **API Documentation Endpoints:**

- **Swagger UI**: `http://localhost:3000/api-docs`
- **JSON Spec**: `http://localhost:3000/api-docs.json`
- **Quick Link**: `http://localhost:3000/docs` (redirects to Swagger UI)

---

## 🔄 API Endpoints

### **Authentication Endpoints:**

| Method | Endpoint                | Description            | Auth Required |
| ------ | ----------------------- | ---------------------- | ------------- |
| POST   | `/api/v1/auth/register` | สมัครสมาชิกใหม่        | ❌            |
| POST   | `/api/v1/auth/login`    | เข้าสู่ระบบ            | ❌            |
| GET    | `/api/v1/auth/me`       | ดูข้อมูลผู้ใช้ปัจจุบัน | ✅            |

### **User Management Endpoints:**

| Method | Endpoint            | Description           | Auth Required |
| ------ | ------------------- | --------------------- | ------------- |
| GET    | `/api/v1/users`     | ดูรายการผู้ใช้ทั้งหมด | ✅            |
| GET    | `/api/v1/users/:id` | ดูข้อมูลผู้ใช้ตาม ID  | ✅            |
| PUT    | `/api/v1/users/:id` | แก้ไขข้อมูลผู้ใช้     | ✅            |
| DELETE | `/api/v1/users/:id` | ลบผู้ใช้              | ✅            |

### **Health Check Endpoints:**

| Method | Endpoint         | Description     | Auth Required |
| ------ | ---------------- | --------------- | ------------- |
| GET    | `/`              | API information | ❌            |
| GET    | `/api/v1/health` | Health status   | ❌            |

---

## 🐳 Docker Configuration

### **Dockerfile:**

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### **docker-compose.yml:**

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: express_ts_db
    ports:
      - "3306:3306"
```

---

## 🔧 Development Workflow

### **Available Scripts:**

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "migrate": "ts-node src/database/migrations/migrate.ts",
    "seed": "ts-node src/database/seeds/seed.ts",
    "docs": "echo 'Swagger UI available at http://localhost:3000/api-docs'"
  }
}
```

### **Development Commands:**

```bash
# Development server (auto-reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Production server
npm start

# Run tests
npm test

# Code linting
npm run lint:fix

# Database migration
npm run migrate

# Seed test data
npm run seed
```

---

## 🚀 Production Deployment

### **PM2 Configuration (ecosystem.config.js):**

```javascript
module.exports = {
  apps: [
    {
      name: "express-ts-api",
      script: "dist/server.js",
      instances: "max", // Use all CPU cores
      exec_mode: "cluster", // Cluster mode for load balancing
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time: true,
    },
  ],
};
```

### **Production Deployment Steps:**

```bash
# 1. Build the application
npm run build

# 2. Start with PM2
pm2 start ecosystem.config.js --env production

# 3. Save PM2 configuration
pm2 save

# 4. Setup PM2 startup
pm2 startup
```

---

## 🧪 Testing Strategy

### **Test Structure:**

```
tests/
├── unit/              # Unit tests
│   ├── controllers/
│   ├── services/
│   └── utils/
├── integration/       # Integration tests
│   ├── auth.test.ts
│   └── users.test.ts
└── e2e/              # End-to-end tests
    └── api.test.ts
```

### **Jest Configuration:**

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/server.ts"],
};
```

---

## 📊 Performance & Monitoring

### **Performance Optimizations:**

1. **Connection Pooling** - MySQL connection pool (max 10 connections)
2. **Compression** - Gzip compression สำหรับ HTTP responses
3. **Rate Limiting** - ป้องกัน API abuse
4. **Caching Headers** - HTTP caching strategies
5. **Process Clustering** - PM2 cluster mode

### **Monitoring & Health Checks:**

```typescript
// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    database: {
      status: "connected",
    },
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
  });
});
```

---

## 🔒 Environment Configuration

### **Environment Variables (.env):**

```bash
# Server Configuration
NODE_ENV=development
PORT=3000
API_PREFIX=/api/v1

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=express_ts_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

---

## 🎯 สรุปจุดเด่นของ Template

### **✅ Enterprise-Ready Features:**

1. **Type Safety** - TypeScript ป้องกัน runtime errors
2. **Security** - JWT, bcrypt, helmet, rate limiting
3. **Scalability** - Connection pooling, clustering
4. **Maintainability** - Clean architecture, SOLID principles
5. **Documentation** - Swagger UI auto-generated
6. **Testing** - Jest framework setup
7. **Monitoring** - Winston logging, health checks
8. **DevOps** - Docker, PM2, VS Code integration

### **🚀 Production Benefits:**

- **High Performance** - Optimized for production loads
- **Secure** - Industry-standard security practices
- **Scalable** - Can handle increasing traffic
- **Maintainable** - Clean code structure
- **Monitorable** - Comprehensive logging
- **Deployable** - Docker & PM2 ready

### **👨‍💻 Developer Experience:**

- **Fast Development** - Hot reload, TypeScript intellisense
- **Easy Testing** - Comprehensive test setup
- **Clear Documentation** - API docs, code comments
- **VS Code Integration** - Debugger, tasks, settings
- **Code Quality** - ESLint, Prettier integration

---

**🏆 Template นี้พร้อมสำหรับการพัฒนา API ระดับองค์กรที่ต้องการความเสถียร, ความปลอดภัย, และความสามารถในการขยายตัว!**
