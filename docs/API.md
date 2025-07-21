# API Documentation

## Authentication

### Register User

**POST** `/api/v1/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user" // optional: user, admin, moderator
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Login

**POST** `/api/v1/auth/login`

Authenticate user and get access token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Get Profile

**GET** `/api/v1/auth/profile`

Get current user profile (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Refresh Token

**POST** `/api/v1/auth/refresh-token`

Refresh the access token (requires authentication).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## User Management (Admin Only)

### Get All Users

**GET** `/api/v1/users`

Get paginated list of users (admin only).

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `search` (optional): Search term for name or email
- `role` (optional): Filter by role (user, admin, moderator)
- `isActive` (optional): Filter by active status (true/false)

**Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Get User by ID

**GET** `/api/v1/users/:id`

Get specific user by ID (admin only).

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Parameters:**

- `id`: User ID

**Response:**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Update User

**PUT** `/api/v1/users/:id`

Update user information (admin only).

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Parameters:**

- `id`: User ID

**Request Body:**

```json
{
  "email": "newemail@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "role": "moderator",
  "isActive": false
}
```

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "email": "newemail@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "moderator",
    "isActive": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:01.000Z"
  },
  "timestamp": "2023-01-01T00:00:01.000Z"
}
```

### Delete User

**DELETE** `/api/v1/users/:id`

Delete user (admin only).

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Parameters:**

- `id`: User ID

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## User Profile Management

### Get Current User Profile

**GET** `/api/v1/users/me/profile`

Get current authenticated user's profile.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Current user retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Update Current User Profile

**PUT** `/api/v1/users/me/profile`

Update current authenticated user's profile.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "email": "newemail@example.com",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "newemail@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "user",
    "isActive": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:01.000Z"
  },
  "timestamp": "2023-01-01T00:00:01.000Z"
}
```

## System Endpoints

### Health Check

**GET** `/api/v1/health`

Check API health status.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "uptime": 3600.123,
  "environment": "development"
}
```

## Error Responses

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "error": "Email is required, Password must be at least 8 characters",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Authentication Error

```json
{
  "success": false,
  "message": "Access token is required",
  "error": "Access token is required",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Authorization Error

```json
{
  "success": false,
  "message": "Insufficient permissions",
  "error": "Insufficient permissions",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Not Found Error

```json
{
  "success": false,
  "message": "User not found",
  "error": "User not found",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Server Error

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Something went wrong on the server",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Rate Limit Error

```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

## HTTP Status Codes

- `200` - OK (successful GET, PUT)
- `201` - Created (successful POST)
- `400` - Bad Request (validation errors, malformed requests)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error (server errors)
