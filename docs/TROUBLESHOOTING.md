# 🔧 Express TypeScript Enterprise Template - คู่มือการแก้ไขปัญหา

## 🚨 ปัญหาที่พบบ่อยและวิธีแก้ไข

### 1. **ปัญหาการเชื่อมต่อฐานข้อมูล**

#### ❌ **Error: connect ECONNREFUSED**

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**สาเหตุ:**

- MySQL server ไม่ได้เปิดใช้งาน
- Port 3306 ถูกใช้งานโดยโปรแกรมอื่น
- ค่า configuration ใน .env ไม่ถูกต้อง

**วิธีแก้ไข:**

```bash
# ตรวจสอบสถานะ MySQL
# Windows:
net start mysql

# macOS/Linux:
brew services start mysql
# หรือ
sudo systemctl start mysql

# ตรวจสอบ port
netstat -an | findstr :3306

# ทดสอบการเชื่อมต่อ
node test-db-simple.js
```

#### ❌ **Error: ER_ACCESS_DENIED_ERROR**

```
Error: Access denied for user 'root'@'localhost'
```

**วิธีแก้ไข:**

```bash
# รีเซ็ต MySQL password
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
FLUSH PRIVILEGES;

# หรือสร้าง user ใหม่
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON expressts_db.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;
```

---

### 2. **ปัญหา TypeScript & Build**

#### ❌ **Error: Cannot find module**

```
Error: Cannot find module '@/config'
```

**วิธีแก้ไข:**

```bash
# ติดตั้ง dependencies ใหม่
npm install

# Build TypeScript
npm run build

# ตรวจสอบ tsconfig.json paths
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### ❌ **ESLint Errors**

```
'@typescript-eslint/no-unused-vars': error
```

**วิธีแก้ไข:**

```bash
# Fix lint issues automatically
npm run lint:fix

# หรือแก้ไขใน .eslintrc.js
{
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
```

---

### 3. **ปัญหา Authentication & JWT**

#### ❌ **Error: invalid signature**

```
JsonWebTokenError: invalid signature
```

**สาเหตุ:**

- JWT_SECRET ใน .env เปลี่ยนแปลง
- Token ถูก tamper

**วิธีแก้ไข:**

```javascript
// ตรวจสอบ JWT_SECRET ใน .env
JWT_SECRET=your-super-secret-jwt-key-that-should-be-very-long-and-random

// สร้าง secret ใหม่
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### ❌ **Error: Token expired**

```
TokenExpiredError: jwt expired
```

**วิธีแก้ไข:**

```javascript
// เพิ่มระยะเวลา token expiration
const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: "7d", // เพิ่มจาก 1d เป็น 7d
});

// หรือ implement refresh token mechanism
```

---

### 4. **ปัญหา Server & Port**

#### ❌ **Error: EADDRINUSE**

```
Error: listen EADDRINUSE: address already in use :::3000
```

**วิธีแก้ไข:**

```bash
# หา process ที่ใช้ port 3000
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# หรือเปลี่ยน port ใน .env
PORT=3001
```

---

### 5. **ปัญหา Docker**

#### ❌ **Container ไม่ start**

```bash
# ดู logs
docker logs <container_id>

# ตรวจสอบ docker-compose
docker-compose logs

# Rebuild image
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### ❌ **Database connection ใน Docker**

```yaml
# ตรวจสอบ docker-compose.yml
services:
  app:
    environment:
      - DB_HOST=mysql # ต้องเป็นชื่อ service ไม่ใช่ localhost
```

---

### 6. **ปัญหา PM2**

#### ❌ **PM2 ไม่ start**

```bash
# ดู PM2 logs
pm2 logs

# Restart PM2
pm2 restart all

# Delete และ start ใหม่
pm2 delete all
pm2 start ecosystem.config.js
```

---

## 🔍 การ Debug และ Monitoring

### **1. Debug Mode**

```bash
# Start ใน debug mode
npm run dev

# หรือใช้ VS Code debugger
# กด F5 หรือใช้ configuration "Debug TypeScript"
```

### **2. Logging Analysis**

```bash
# ดู logs แบบ real-time
tail -f logs/combined.log

# ค้นหา errors
grep "ERROR" logs/combined.log

# ดู logs ตาม timestamp
grep "2024-01-01" logs/combined.log
```

### **3. Database Debugging**

```sql
-- ดู active connections
SHOW PROCESSLIST;

-- ดู table status
SHOW TABLE STATUS FROM expressts_db;

-- Analyze query performance
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

### **4. Performance Monitoring**

```bash
# ใช้ PM2 monitoring
pm2 monit

# หรือ htop สำหรับ system resources
htop

# Memory usage
node --max-old-space-size=512 dist/server.js
```

---

## 🛠️ การ Maintenance

### **1. Database Maintenance**

```sql
-- Cleanup expired sessions
DELETE FROM sessions WHERE expires_at < NOW();

-- Optimize tables
OPTIMIZE TABLE users, sessions;

-- Backup database
mysqldump -u root -p expressts_db > backup_$(date +%Y%m%d).sql
```

### **2. Log Rotation**

```bash
# ใช้ logrotate (Linux)
# /etc/logrotate.d/expressts-api
/path/to/app/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    copytruncate
    notifempty
}
```

### **3. Dependencies Update**

```bash
# ตรวจสอบ outdated packages
npm outdated

# Update dependencies
npm update

# Security audit
npm audit
npm audit fix
```

---

## ⚡ Performance Optimization

### **1. Database Optimization**

```sql
-- เพิ่ม indexes
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_sessions_user_expires ON sessions(user_id, expires_at);

-- Query optimization
-- แทนที่
SELECT * FROM users WHERE email = 'test@example.com';
-- ใช้
SELECT id, email, name, role FROM users WHERE email = 'test@example.com' LIMIT 1;
```

### **2. Application Optimization**

```javascript
// Connection pooling
const pool = mysql.createPool({
  connectionLimit: 20, // เพิ่มจาก 10
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
});

// Response compression
import compression from "compression";
app.use(compression());

// Static file caching
app.use(
  express.static("public", {
    maxAge: "1d",
    etag: true,
  })
);
```

### **3. Memory Management**

```javascript
// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");

  // Close database connections
  await Database.getInstance().close();

  // Stop HTTP server
  server.close(() => {
    console.log("Process terminated");
    process.exit(0);
  });
});

// Memory monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();
  console.log("Memory usage:", {
    rss: Math.round(memUsage.rss / 1024 / 1024) + "MB",
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + "MB",
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + "MB",
  });
}, 30000); // ทุก 30 วินาที
```

---

## 🔒 Security Checklist

### **✅ การตรวจสอบความปลอดภัย**

1. **Environment Variables**

   - [ ] JWT_SECRET ยาวมากกว่า 32 ตัวอักษร
   - [ ] Database password ปลอดภัย
   - [ ] ไม่มี sensitive data ใน .env.example

2. **Dependencies Security**

   ```bash
   # ตรวจสอบ vulnerabilities
   npm audit

   # Install security updates
   npm audit fix
   ```

3. **Database Security**

   - [ ] ใช้ prepared statements
   - [ ] Input validation ทุก endpoint
   - [ ] Database user มี permissions จำกัด

4. **API Security**

   - [ ] Rate limiting active
   - [ ] CORS configured properly
   - [ ] Security headers (Helmet)
   - [ ] Input sanitization

5. **Production Security**
   - [ ] HTTPS enabled
   - [ ] Security monitoring
   - [ ] Regular backups
   - [ ] Log monitoring

---

## 📋 Deployment Checklist

### **🚀 Pre-deployment**

1. **Code Quality**

   - [ ] All tests passing
   - [ ] ESLint clean
   - [ ] TypeScript compiled
   - [ ] No console.log statements

2. **Configuration**

   - [ ] Production .env file
   - [ ] Database production setup
   - [ ] SSL certificates
   - [ ] Domain configuration

3. **Performance**
   - [ ] Database indexed
   - [ ] Connection pooling optimized
   - [ ] Compression enabled
   - [ ] Static assets optimized

### **🔧 Post-deployment**

1. **Monitoring**

   - [ ] Health check working
   - [ ] Logs rotating properly
   - [ ] PM2/Docker monitoring
   - [ ] Database monitoring

2. **Testing**
   - [ ] API endpoints responding
   - [ ] Authentication working
   - [ ] Database connectivity
   - [ ] SSL certificates valid

---

## 📞 การขอความช่วยเหลือ

### **🐛 Bug Reports**

```markdown
## Bug Description

- What happened?
- What was expected?
- Steps to reproduce

## Environment

- Node.js version:
- NPM version:
- Database version:
- OS:

## Logs
```

Please attach relevant logs

```

```

### **💡 Feature Requests**

```markdown
## Feature Description

- What feature would you like?
- Why is this feature needed?
- How should it work?

## Use Case

- Describe your use case
- Provide examples if possible
```

### **📚 Documentation**

- เอกสารครบถ้วนใน `/docs` folder
- Swagger UI: `http://localhost:3000/api-docs`
- Code comments ในไฟล์ source code

---

## 🎯 Best Practices Summary

1. **Always validate input data**
2. **Use prepared statements for database queries**
3. **Implement proper error handling**
4. **Keep dependencies updated**
5. **Monitor system resources**
6. **Use semantic versioning**
7. **Write comprehensive tests**
8. **Document API changes**
9. **Regular security audits**
10. **Backup regularly**

---

ระบบนี้ได้รับการออกแบบให้ใช้งานง่าย แต่หากพบปัญหาใดๆ สามารถใช้คู่มือนี้เป็นแนวทางในการแก้ไขได้ครับ! 🚀
