import { config } from '../src/config/index';
import Database from '../src/database/connection';
import logger from '../src/utils/logger';

async function checkDatabaseConnection(): Promise<void> {
  try {
    logger.info('Testing database connection...');
    
    const db = Database.getInstance();
    const isConnected = await db.testConnection();
    
    if (isConnected) {
      logger.info('✅ Database connection successful');
      
      // Show database info
      const dbInfo = await db.query('SELECT VERSION() as version');
      logger.info(`📊 MySQL Version: ${dbInfo[0].version}`);
      
      // Show current database
      const currentDb = await db.query('SELECT DATABASE() as current_db');
      logger.info(`🗄️  Current Database: ${currentDb[0].current_db || 'None'}`);
      
    } else {
      logger.error('❌ Database connection failed');
    }
    
  } catch (error) {
    logger.error('❌ Database connection test failed:', error);
  } finally {
    const db = Database.getInstance();
    await db.close();
  }
}

checkDatabaseConnection();
