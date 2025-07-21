import Database from '../connection';
import logger from '@utils/logger';
import { AuthUtils } from '@utils/helpers';
import { UserRole } from '../../types';

async function seedDatabase(): Promise<void> {
  try {
    const db = Database.getInstance();
    
    // Test connection
    const isConnected = await db.testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }
    
    // Create sample categories
    const categories = [
      { name: 'Technology', description: 'Technology related posts' },
      { name: 'Science', description: 'Science and research posts' },
      { name: 'Business', description: 'Business and finance posts' },
      { name: 'Health', description: 'Health and wellness posts' },
    ];
    
    for (const category of categories) {
      await db.execute(
        'INSERT IGNORE INTO categories (name, description) VALUES (?, ?)',
        [category.name, category.description]
      );
    }
    
    // Create sample users
    const users = [
      {
        email: 'user@example.com',
        password: await AuthUtils.hashPassword('User123!'),
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.USER,
      },
      {
        email: 'moderator@example.com',
        password: await AuthUtils.hashPassword('Moderator123!'),
        firstName: 'Jane',
        lastName: 'Smith',
        role: UserRole.MODERATOR,
      },
    ];
    
    for (const user of users) {
      await db.execute(
        'INSERT IGNORE INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
        [user.email, user.password, user.firstName, user.lastName, user.role]
      );
    }
    
    // Get user IDs for creating posts
    const userRows = await db.query('SELECT id, email FROM users WHERE email IN (?, ?)', [
      'user@example.com',
      'moderator@example.com'
    ]);
    
    if (userRows.length > 0) {
      const posts = [
        {
          title: 'Getting Started with TypeScript',
          content: 'TypeScript is a powerful superset of JavaScript that adds static typing...',
          authorId: userRows[0].id,
          isPublished: true,
        },
        {
          title: 'Building REST APIs with Express',
          content: 'Express.js is a minimal and flexible Node.js web application framework...',
          authorId: userRows[1] ? userRows[1].id : userRows[0].id,
          isPublished: true,
        },
        {
          title: 'Database Design Best Practices',
          content: 'When designing a database, there are several key principles to follow...',
          authorId: userRows[0].id,
          isPublished: false,
        },
      ];
      
      for (const post of posts) {
        await db.execute(
          'INSERT IGNORE INTO posts (title, content, authorId, isPublished) VALUES (?, ?, ?, ?)',
          [post.title, post.content, post.authorId, post.isPublished]
        );
      }
    }
    
    logger.info('✅ Database seeding completed successfully');
    
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
