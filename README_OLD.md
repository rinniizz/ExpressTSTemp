# Express TypeScript Template

Enterprise-grade Express.js application template with TypeScript, MySQL, and comprehensive features for large-scale applications.

## Features

- **TypeScript** - Full TypeScript support with strict configuration
- **Express.js** - Fast, unopinionated web framework
- **MySQL** - Robust relational database with connection pooling
- **Authentication** - JWT-based authentication with bcrypt password hashing
- **Authorization** - Role-based access control (RBAC)
- **Validation** - Request validation with express-validator
- **Security** - Helmet, CORS, rate limiting, and more
- **Logging** - Winston logger with file and console output
- **Error Handling** - Centralized error handling with custom error types
- **Testing** - Jest testing framework setup
- **Linting** - ESLint with TypeScript rules
- **API Documentation** - Structured API with standardized responses

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── database/         # Database connection and migrations
├── middlewares/      # Custom middleware functions
├── models/          # Database models (if using ORM)
├── routes/          # Route definitions
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and helpers
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd express-typescript-template
```

2. Install dependencies:

```bash
npm install
```

3. Setup environment variables:

```bash
cp .env.example .env
```

Edit `.env` file with your database credentials and other configurations.

4. Setup database:

```bash
# Create your database first, then run migrations
npm run migrate

# Optionally seed with sample data
npm run seed
```

5. Start development server:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get user profile (authenticated)
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Users (Admin only)

- `GET /api/v1/users` - Get all users (paginated)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### User Profile

- `GET /api/v1/users/me/profile` - Get current user profile
- `PUT /api/v1/users/me/profile` - Update current user profile

### System

- `GET /api/v1/health` - Health check endpoint

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# API
API_PREFIX=/api/v1
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **admin** - Full access to all endpoints
- **moderator** - Limited administrative access
- **user** - Basic user access

## Database Schema

### Users Table

- `id` - Primary key
- `email` - Unique email address
- `password` - Hashed password
- `firstName` - User's first name
- `lastName` - User's last name
- `role` - User role (user, admin, moderator)
- `isActive` - Account status
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Error Handling

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Security Features

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Configurable Cross-Origin Resource Sharing
- **Rate Limiting** - Prevents abuse with configurable limits
- **Input Validation** - Request validation with express-validator
- **Password Hashing** - bcrypt for secure password storage
- **JWT Authentication** - Stateless authentication
- **SQL Injection Prevention** - Parameterized queries

## Testing

The project uses Jest for testing. Test files should be placed next to the source files with `.test.ts` or `.spec.ts` extension.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with the compiled JavaScript files.

### Start Production Server

```bash
npm start
```

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment, especially:

- `NODE_ENV=production`
- `JWT_SECRET` - Use a strong, unique secret
- Database credentials
- CORS settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
