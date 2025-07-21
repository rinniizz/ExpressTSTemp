import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

import { config } from './config/index';
import Database from './database/connection';
import routes from './routes/index';
import { errorHandler, notFound } from './middlewares/error';
import logger from './utils/logger';
import { swaggerUi, specs } from './config/swagger';

class App {
  public app: express.Application;
  private db: Database;

  constructor() {
    this.app = express();
    this.db = Database.getInstance();
    
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());
    
    // CORS
    this.app.use(cors(config.cors));
    
    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
    });
    this.app.use(limiter);
    
    // Compression
    this.app.use(compression());
    
    // Logging
    if (config.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Trust proxy
    this.app.set('trust proxy', 1);
  }

  private initializeSwagger(): void {
    // Swagger UI setup
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Express TypeScript API Documentation',
      swaggerOptions: {
        persistAuthorization: true,
      },
    }));

    // Redirect /docs to /api-docs for convenience
    this.app.get('/docs', (req, res) => {
      res.redirect('/api-docs');
    });

    // API docs JSON endpoint
    this.app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(specs);
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use(config.apiPrefix, routes);
    
    // Root route
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Express TypeScript Template API',
        version: '1.0.0',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFound);
    
    // Global error handler
    this.app.use(errorHandler);
  }

  public async connectDatabase(): Promise<void> {
    try {
      const isConnected = await this.db.testConnection();
      if (isConnected) {
        logger.info('✅ Database connected successfully');
      } else {
        throw new Error('Database connection test failed');
      }
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  public listen(): void {
    this.app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port} in ${config.nodeEnv} mode`);
      logger.info(`📱 API available at http://localhost:${config.port}${config.apiPrefix}`);
    });
  }

  public getServer(): express.Application {
    return this.app;
  }
}

export default App;
