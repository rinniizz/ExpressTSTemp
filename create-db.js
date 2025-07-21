// Create database script
require('dotenv').config();

const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    console.log('🗄️  Creating database...');
    
    // Connect without database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    const dbName = process.env.DB_NAME || 'express_typescript_app';
    
    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' created/verified successfully!`);
    
    // Switch to the database
    await connection.query(`USE \`${dbName}\``);
    console.log(`🔄 Switched to database '${dbName}'`);
    
    await connection.end();
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Database creation failed:', error.message);
    process.exit(1);
  }
}

createDatabase();
