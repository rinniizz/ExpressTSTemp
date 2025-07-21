import Database from '../database/connection';
import { User, CreateUserDto, UpdateUserDto, UserRole } from '../types';
import { AuthUtils } from '../utils/helpers';
import { AppError } from '../types';
import logger from '../utils/logger';

export class UserService {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  async createUser(userData: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      // Hash password
      const hashedPassword = await AuthUtils.hashPassword(userData.password);

      // Create user
      const sql = `
        INSERT INTO users (email, password, firstName, lastName, role, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, true, NOW(), NOW())
      `;

      const result = await this.db.execute(sql, [
        userData.email,
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.role || UserRole.USER,
      ]);

      // Get created user
      const createdUser = await this.getUserById(result.insertId);
      if (!createdUser) {
        throw new AppError('Failed to create user', 500);
      }

      const { password, ...userWithoutPassword } = createdUser;
      return userWithoutPassword;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const sql = 'SELECT * FROM users WHERE id = ?';
      const users = await this.db.query(sql, [id]);
      return users.length > 0 ? (users[0] as User) : null;
    } catch (error) {
      logger.error('Error getting user by ID:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const sql = 'SELECT * FROM users WHERE email = ?';
      const users = await this.db.query(sql, [email]);
      return users.length > 0 ? (users[0] as User) : null;
    } catch (error) {
      logger.error('Error getting user by email:', error);
      throw error;
    }
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const updateFields: string[] = [];
      const updateValues: any[] = [];

      if (userData.email) {
        updateFields.push('email = ?');
        updateValues.push(userData.email);
      }
      if (userData.firstName) {
        updateFields.push('firstName = ?');
        updateValues.push(userData.firstName);
      }
      if (userData.lastName) {
        updateFields.push('lastName = ?');
        updateValues.push(userData.lastName);
      }
      if (userData.role) {
        updateFields.push('role = ?');
        updateValues.push(userData.role);
      }
      if (userData.isActive !== undefined) {
        updateFields.push('isActive = ?');
        updateValues.push(userData.isActive);
      }

      if (updateFields.length === 0) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }

      updateFields.push('updatedAt = NOW()');
      updateValues.push(id);

      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
      await this.db.execute(sql, updateValues);

      const updatedUser = await this.getUserById(id);
      if (!updatedUser) {
        throw new AppError('Failed to update user', 500);
      }

      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const user = await this.getUserById(id);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const sql = 'DELETE FROM users WHERE id = ?';
      const result = await this.db.execute(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      logger.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: UserRole,
    isActive?: boolean
  ): Promise<{ users: Omit<User, 'password'>[]; total: number }> {
    try {
      let whereConditions: string[] = [];
      let queryParams: any[] = [];

      if (search) {
        whereConditions.push('(firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)');
        const searchPattern = `%${search}%`;
        queryParams.push(searchPattern, searchPattern, searchPattern);
      }

      if (role) {
        whereConditions.push('role = ?');
        queryParams.push(role);
      }

      if (isActive !== undefined) {
        whereConditions.push('isActive = ?');
        queryParams.push(isActive);
      }

      const whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}` 
        : '';

      // Get total count
      const countSql = `SELECT COUNT(*) as total FROM users ${whereClause}`;
      const countResult = await this.db.query(countSql, queryParams);
      const total = countResult[0].total as number;

      // Get paginated users
      const offset = (page - 1) * limit;
      const usersSql = `
        SELECT id, email, firstName, lastName, role, isActive, createdAt, updatedAt 
        FROM users ${whereClause} 
        ORDER BY createdAt DESC 
        LIMIT ? OFFSET ?
      `;
      
      const users = await this.db.query(usersSql, [...queryParams, limit, offset]);

      return {
        users: users as Omit<User, 'password'>[],
        total,
      };
    } catch (error) {
      logger.error('Error getting users:', error);
      throw error;
    }
  }

  async authenticateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user || !user.isActive) {
        return null;
      }

      const isValidPassword = await AuthUtils.comparePassword(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw error;
    }
  }
}
