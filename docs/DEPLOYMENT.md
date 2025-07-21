# Deployment Guide

This guide covers how to deploy the Express TypeScript template to various platforms.

## Prerequisites

- Node.js 18 or higher
- MySQL 8.0 or higher
- Git
- PM2 (for production process management)

## Environment Setup

### 1. Environment Variables

Create a `.env` file in your production environment with the following variables:

```env
NODE_ENV=production
PORT=3000

# Database Configuration
DB_HOST=your_production_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_secure_db_password
DB_NAME=your_production_db_name

# JWT Secret (IMPORTANT: Use a strong, unique secret)
JWT_SECRET=your_super_secure_jwt_secret_at_least_64_characters_long_unique_key
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# API Configuration
API_PREFIX=/api/v1
```

### 2. Database Setup

1. Create a production MySQL database
2. Update the `.env` file with your database credentials
3. Run migrations:
   ```bash
   npm run migrate
   ```
4. Optionally seed the database:
   ```bash
   npm run seed
   ```

## Manual Deployment

### 1. Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install MySQL (if not using external database)
sudo apt install mysql-server -y
sudo mysql_secure_installation
```

### 2. Application Deployment

```bash
# Clone the repository
git clone <your-repository-url>
cd express-typescript-template

# Install dependencies
npm ci --production

# Build the application
npm run build

# Setup environment
cp .env.example .env
# Edit .env with your production values

# Create logs directory
mkdir -p logs

# Setup database
npm run migrate

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. PM2 Configuration

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: "express-api",
      script: "dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time: true,
      max_restarts: 10,
      min_uptime: "10s",
      watch: false,
      ignore_watch: ["node_modules", "logs"],
      merge_logs: true,
    },
  ],
};
```

### 4. Nginx Configuration

Install and configure Nginx as a reverse proxy:

```bash
# Install Nginx
sudo apt install nginx -y

# Create server configuration
sudo nano /etc/nginx/sites-available/express-api
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/express-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Docker Deployment

### 1. Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Create logs directory
RUN mkdir -p logs && chown -R nodeuser:nodejs logs

USER nodeuser

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Docker Compose

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - mysql
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mysql_data:
```

### 3. Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# Run migrations
docker-compose exec app npm run migrate

# View logs
docker-compose logs -f app
```

## Cloud Platform Deployment

### Heroku

1. Install Heroku CLI
2. Create `Procfile`:
   ```
   web: npm start
   ```
3. Deploy:
   ```bash
   heroku create your-app-name
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret
   heroku addons:create cleardb:ignite
   git push heroku main
   ```

### AWS EC2

1. Launch an EC2 instance
2. Follow manual deployment steps
3. Configure security groups to allow HTTP/HTTPS
4. Use AWS RDS for MySQL database

### DigitalOcean

1. Create a Droplet
2. Follow manual deployment steps
3. Use DigitalOcean Managed Database for MySQL

### Google Cloud Platform

1. Create a Compute Engine instance
2. Follow manual deployment steps
3. Use Cloud SQL for MySQL

## Monitoring and Maintenance

### 1. Monitoring with PM2

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart express-api

# Update application
git pull
npm ci --production
npm run build
pm2 restart express-api
```

### 2. Health Checks

Set up automated health checks:

```bash
# Add to crontab
*/5 * * * * curl -f http://localhost:3000/api/v1/health || pm2 restart express-api
```

### 3. Database Backups

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://your-backup-bucket/
rm backup_$DATE.sql
```

### 4. Log Rotation

Configure log rotation for application logs:

```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/express-api
```

```
/path/to/your/app/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 0644 nodeuser nodejs
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **JWT Secret**: Use a strong, unique secret for production
3. **Database Security**: Use strong passwords and restrict access
4. **Rate Limiting**: Configure appropriate rate limits
5. **HTTPS**: Always use SSL/TLS in production
6. **Updates**: Keep dependencies and system packages updated
7. **Firewall**: Configure firewall to allow only necessary ports
8. **Monitoring**: Set up monitoring and alerting

## Troubleshooting

### Common Issues

1. **Database Connection**: Check credentials and network connectivity
2. **Port Already in Use**: Use different port or kill existing process
3. **Permission Errors**: Check file permissions and user ownership
4. **Memory Issues**: Monitor memory usage and configure appropriate limits

### Useful Commands

```bash
# Check application status
pm2 status

# View error logs
pm2 logs express-api --err

# Restart with new environment
pm2 restart express-api --update-env

# Check database connection
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME

# Test API endpoint
curl http://localhost:3000/api/v1/health
```
