import mysql from 'mysql2/promise';
import { config } from '../config/index';
import logger from '../utils/logger';

class Database {
  private static instance: Database;
  private pool: mysql.Pool;

  private constructor() {
    this.pool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.name,
      connectionLimit: config.database.connectionLimit,
      charset: 'utf8mb4',
      // Modern MySQL2 options
      idleTimeout: 60000,
      queueLimit: 0,
    } as mysql.PoolOptions);
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getPool(): mysql.Pool {
    return this.pool;
  }

  public async query(sql: string, params?: unknown[]): Promise<mysql.RowDataPacket[]> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows as mysql.RowDataPacket[];
    } catch (error) {
      logger.error('Database query error:', error);
      throw error;
    }
  }

  public async execute(sql: string, params?: unknown[]): Promise<mysql.ResultSetHeader> {
    try {
      const [result] = await this.pool.execute(sql, params);
      return result as mysql.ResultSetHeader;
    } catch (error) {
      logger.error('Database execute error:', error);
      throw error;
    }
  }

  public async transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      logger.error('Transaction error:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      const [rows] = await this.pool.execute('SELECT 1 as test');
      logger.info('Database connection successful');
      return Array.isArray(rows) && rows.length > 0;
    } catch (error) {
      logger.error('Database connection failed:', error);
      return false;
    }
  }

  public async close(): Promise<void> {
    try {
      await this.pool.end();
      logger.info('Database connection pool closed');
    } catch (error) {
      logger.error('Error closing database connection pool:', error);
    }
  }
}

export default Database;
