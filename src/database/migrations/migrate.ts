import Database from '../connection';
import logger from '@utils/logger';
import fs from 'fs';
import path from 'path';

async function runMigrations(): Promise<void> {
  try {
    const db = Database.getInstance();
    
    // Test connection
    const isConnected = await db.testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, '../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await db.execute(statement.trim());
      }
    }
    
    logger.info('✅ Database migrations completed successfully');
    
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Migrations completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration failed:', error);
      process.exit(1);
    });
}

export default runMigrations;
