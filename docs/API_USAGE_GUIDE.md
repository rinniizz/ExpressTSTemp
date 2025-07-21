# 🌐 Express TypeScript Enterprise API - คู่มือการใช้งาน API

## 📋 ข้อมูลเบื้องต้น

### **Base URL**

```
Development: http://localhost:3000/api/v1
Production: https://api.yourdomain.com/api/v1
```

### **Content-Type**

```
Content-Type: application/json
```

### **Authentication**

```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Authentication Endpoints

### **1. สมัครสมาชิก (Register)**

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Validation Rules:**

- `email`: รูปแบบ email ที่ถูกต้อง
- `password`: อย่างน้อย 8 ตัวอักษร ประกอบด้วย A-Z, a-z, 0-9, และอักขระพิเศษ
- `name`: 2-50 ตัวอักษร เฉพาะตัวอักษรและช่องว่าง

**Response (201 Created):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

```json
// 400 Bad Request - Validation Error
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "value": "invalid-email"
    }
  ]
}

// 409 Conflict - Email already exists
{
  "success": false,
  "message": "Email already registered"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

---

### **2. เข้าสู่ระบบ (Login)**

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "is_active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

```json
// 401 Unauthorized - Invalid credentials
{
  "success": false,
  "message": "Invalid email or password"
}

// 401 Unauthorized - Account deactivated
{
  "success": false,
  "message": "Account is deactivated"
}
```

**cURL Example:**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

---

### **3. ดูข้อมูลโปรไฟล์ (Get Profile)**

**Endpoint:** `GET /auth/profile`

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "is_active": true,
      "email_verified_at": null,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**

```json
// 401 Unauthorized - Missing token
{
  "success": false,
  "message": "Access token required"
}

// 401 Unauthorized - Invalid token
{
  "success": false,
  "message": "Invalid token"
}

// 401 Unauthorized - Expired token
{
  "success": false,
  "message": "Token expired"
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 👥 User Management Endpoints

### **1. ดูรายการผู้ใช้ (Get Users List)**

**Endpoint:** `GET /users`

**Headers Required:**

```
Authorization: Bearer <admin_jwt_token>
```

**Query Parameters (Optional):**

```
?page=1&limit=10&role=user&search=john
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user",
        "is_active": true,
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "limit": 10
    }
  }
}
```

**cURL Example:**

```bash
curl -X GET "http://localhost:3000/api/v1/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### **2. ดูข้อมูลผู้ใช้รายคน (Get User by ID)**

**Endpoint:** `GET /users/:id`

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "success": false,
  "message": "User not found"
}

// 403 Forbidden - Access to other user's data
{
  "success": false,
  "message": "Access denied"
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:3000/api/v1/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### **3. แก้ไขข้อมูลผู้ใช้ (Update User)**

**Endpoint:** `PUT /users/:id`

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "johnsmith@example.com",
      "name": "John Smith",
      "role": "user",
      "is_active": true,
      "updated_at": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

**cURL Example:**

```bash
curl -X PUT http://localhost:3000/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "John Smith",
    "email": "johnsmith@example.com"
  }'
```

---

### **4. ลบผู้ใช้ (Delete User)**

**Endpoint:** `DELETE /users/:id`

**Headers Required:**

```
Authorization: Bearer <admin_jwt_token>
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**cURL Example:**

```bash
curl -X DELETE http://localhost:3000/api/v1/users/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 🏥 Health Check Endpoint

### **ตรวจสอบสถานะระบบ (Health Check)**

**Endpoint:** `GET /health`

**Response (200 OK):**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600,
  "services": {
    "database": "connected",
    "memory": {
      "used": "85MB",
      "total": "512MB",
      "percentage": 17
    },
    "cpu": {
      "usage": 15
    }
  },
  "version": "2.0.0",
  "environment": "development"
}
```

**Response (503 Service Unavailable):**

```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600,
  "services": {
    "database": "disconnected",
    "memory": {
      "used": "450MB",
      "total": "512MB",
      "percentage": 88
    }
  },
  "version": "2.0.0",
  "environment": "production"
}
```

**cURL Example:**

```bash
curl -X GET http://localhost:3000/api/v1/health
```

---

## 📚 Swagger API Documentation

### **เข้าถึง Swagger UI**

**URL:** `http://localhost:3000/api-docs`

**Features:**

- 🔍 Interactive API exploration
- 🧪 Test API endpoints directly
- 📖 Complete API documentation
- 🔐 JWT authentication testing
- 📋 Request/Response examples

---

## 🔒 JWT Token Management

### **Token Structure**

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": 1,
    "email": "user@example.com",
    "role": "user",
    "iat": 1640995200,
    "exp": 1641599999,
    "iss": "expressts-api",
    "aud": "web-client"
  }
}
```

### **Token Expiration**

- **Default:** 7 days
- **Production:** แนะนำ 1-24 ชั่วโมง
- **Refresh:** ควรมี refresh token mechanism

### **Token Validation**

```javascript
// ตัวอย่างการใช้ token ใน JavaScript
const token = localStorage.getItem("token");

fetch("/api/v1/auth/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data));
```

---

## 🚨 Error Handling

### **Standard Error Response Format**

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "field_name",
      "message": "Field specific error message",
      "value": "invalid_value"
    }
  ],
  "code": "ERROR_CODE"
}
```

### **HTTP Status Codes**

| Status Code | Description           | Example                  |
| ----------- | --------------------- | ------------------------ |
| 200         | OK                    | Successful GET/PUT       |
| 201         | Created               | Successful POST          |
| 400         | Bad Request           | Validation errors        |
| 401         | Unauthorized          | Invalid/missing token    |
| 403         | Forbidden             | Insufficient permissions |
| 404         | Not Found             | Resource not found       |
| 409         | Conflict              | Duplicate entry          |
| 422         | Unprocessable Entity  | Business logic error     |
| 429         | Too Many Requests     | Rate limit exceeded      |
| 500         | Internal Server Error | Server error             |

---

## 🔄 Rate Limiting

### **Authentication Endpoints**

- **Limit:** 5 requests per 15 minutes
- **Scope:** Per IP address
- **Reset:** Rolling window

### **General API Endpoints**

- **Limit:** 100 requests per 15 minutes
- **Scope:** Per authenticated user
- **Reset:** Fixed window

### **Rate Limit Headers**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640999999
```

---

## 🧪 Testing Examples

### **JavaScript/Node.js**

```javascript
const axios = require("axios");

const baseURL = "http://localhost:3000/api/v1";

// Register user
async function registerUser() {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, {
      email: "test@example.com",
      password: "Test123!@#",
      name: "Test User",
    });

    console.log("Registration successful:", response.data);
    return response.data.data.token;
  } catch (error) {
    console.error("Registration failed:", error.response.data);
  }
}

// Get profile
async function getProfile(token) {
  try {
    const response = await axios.get(`${baseURL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Profile:", response.data);
  } catch (error) {
    console.error("Get profile failed:", error.response.data);
  }
}

// Usage
registerUser().then((token) => {
  if (token) {
    getProfile(token);
  }
});
```

### **Python**

```python
import requests
import json

base_url = 'http://localhost:3000/api/v1'

# Register user
def register_user():
    url = f'{base_url}/auth/register'
    data = {
        'email': 'test@example.com',
        'password': 'Test123!@#',
        'name': 'Test User'
    }

    response = requests.post(url, json=data)

    if response.status_code == 201:
        result = response.json()
        print('Registration successful:', result)
        return result['data']['token']
    else:
        print('Registration failed:', response.json())
        return None

# Get profile
def get_profile(token):
    url = f'{base_url}/auth/profile'
    headers = {
        'Authorization': f'Bearer {token}'
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        print('Profile:', response.json())
    else:
        print('Get profile failed:', response.json())

# Usage
token = register_user()
if token:
    get_profile(token)
```

### **PHP**

```php
<?php
$baseUrl = 'http://localhost:3000/api/v1';

// Register user
function registerUser($baseUrl) {
    $url = $baseUrl . '/auth/register';
    $data = [
        'email' => 'test@example.com',
        'password' => 'Test123!@#',
        'name' => 'Test User'
    ];

    $options = [
        'http' => [
            'header' => "Content-Type: application/json\r\n",
            'method' => 'POST',
            'content' => json_encode($data)
        ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result !== false) {
        $response = json_decode($result, true);
        echo "Registration successful: " . print_r($response, true);
        return $response['data']['token'];
    } else {
        echo "Registration failed\n";
        return null;
    }
}

// Get profile
function getProfile($baseUrl, $token) {
    $url = $baseUrl . '/auth/profile';

    $options = [
        'http' => [
            'header' => "Authorization: Bearer $token\r\n",
            'method' => 'GET'
        ]
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result !== false) {
        $response = json_decode($result, true);
        echo "Profile: " . print_r($response, true);
    } else {
        echo "Get profile failed\n";
    }
}

// Usage
$token = registerUser($baseUrl);
if ($token) {
    getProfile($baseUrl, $token);
}
?>
```

---

## 🔧 Development Tools Integration

### **Postman Collection**

```json
{
  "info": {
    "name": "Express TypeScript API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Test123!@#\",\n  \"name\": \"Test User\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        }
      ]
    }
  ]
}
```

### **VS Code REST Client**

```http
### Variables
@baseUrl = http://localhost:3000/api/v1
@token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

### Register User
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!@#",
  "name": "Test User"
}

### Login User
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!@#"
}

### Get Profile
GET {{baseUrl}}/auth/profile
Authorization: Bearer {{token}}

### Health Check
GET {{baseUrl}}/health
```

---

## 📊 API Performance

### **Response Times**

- **Health Check:** < 10ms
- **Authentication:** < 100ms
- **User Operations:** < 50ms
- **Database Queries:** < 20ms

### **Throughput**

- **Development:** 100+ requests/second
- **Production:** 1000+ requests/second (with clustering)

### **Caching**

```javascript
// Example caching implementation
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

// Cache middleware
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached) {
      return res.json(cached);
    }

    res.sendResponse = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      res.sendResponse(body);
    };

    next();
  };
};
```

---

## 🎯 Best Practices

### **1. API Design**

- ใช้ RESTful conventions
- Consistent response format
- Proper HTTP status codes
- Clear error messages

### **2. Security**

- Always validate input
- Use HTTPS in production
- Implement rate limiting
- Regular security audits

### **3. Performance**

- Implement pagination
- Use appropriate indexes
- Cache frequently accessed data
- Monitor response times

### **4. Documentation**

- Keep API docs updated
- Provide clear examples
- Document error scenarios
- Version your API

---

## 🆘 Support

### **Documentation**

- **Swagger UI:** http://localhost:3000/api-docs
- **GitHub:** Repository documentation
- **Postman:** Import collection for testing

### **Common Issues**

- Check `docs/TROUBLESHOOTING.md` for solutions
- Verify environment variables
- Ensure database connectivity
- Check JWT token validity

### **Contact**

- **Email:** api-support@yourdomain.com
- **GitHub Issues:** Create an issue for bugs
- **Documentation:** Contribute to improve docs

---

ยินดีต้อนรับสู่ Express TypeScript Enterprise API! 🚀 หวังว่าคู่มือนี้จะช่วยให้คุณใช้งาน API ได้อย่างมีประสิทธิภาพ
