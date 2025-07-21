// Simple database connection test
require('dotenv').config();

const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || ''
    });

    console.log('✅ Database connection successful!');
    
    // Test query
    const [rows] = await connection.execute('SELECT VERSION() as version');
    console.log('📊 MySQL Version:', rows[0].version);
    
    // Check current database
    const [dbRows] = await connection.execute('SELECT DATABASE() as current_db');
    console.log('🗄️  Current Database:', dbRows[0].current_db || 'None');
    
    // List tables if database is selected
    if (dbRows[0].current_db) {
      const [tables] = await connection.execute('SHOW TABLES');
      console.log('📋 Tables:', tables.length > 0 ? tables.map(t => Object.values(t)[0]) : 'No tables found');
    }
    
    await connection.end();
    console.log('🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
