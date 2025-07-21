import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { ResponseUtils, ValidationUtils } from '../utils/helpers';
import { AppError, UpdateUserDto, UserRole } from '../types';
import logger from '../utils/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page,
        limit,
        search,
        role,
        isActive,
      } = req.query;

      const pagination = ValidationUtils.validatePagination(page as string, limit as string);
      
      const { users, total } = await this.userService.getUsers(
        pagination.page,
        pagination.limit,
        search as string,
        role as UserRole,
        isActive ? isActive === 'true' : undefined
      );

      const totalPages = Math.ceil(total / pagination.limit);

      ResponseUtils.paginated(
        res,
        'Users retrieved successfully',
        users,
        {
          page: pagination.page,
          limit: pagination.limit,
          total,
          totalPages,
        }
      );
    } catch (error: any) {
      logger.error('Get users error:', error);
      ResponseUtils.error(res, error.message || 'Failed to get users', error.message, error.statusCode || 500);
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        throw new AppError('Invalid user ID', 400);
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const { password, ...userWithoutPassword } = user;
      ResponseUtils.success(res, 'User retrieved successfully', userWithoutPassword);
    } catch (error: any) {
      logger.error('Get user by ID error:', error);
      ResponseUtils.error(res, error.message || 'Failed to get user', error.message, error.statusCode || 500);
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        throw new AppError('Invalid user ID', 400);
      }

      const updateData: UpdateUserDto = req.body;

      // Validate email if provided
      if (updateData.email && !ValidationUtils.isValidEmail(updateData.email)) {
        throw new AppError('Invalid email format', 400);
      }

      // Sanitize string inputs
      if (updateData.firstName) {
        updateData.firstName = ValidationUtils.sanitizeString(updateData.firstName);
      }
      if (updateData.lastName) {
        updateData.lastName = ValidationUtils.sanitizeString(updateData.lastName);
      }
      if (updateData.email) {
        updateData.email = updateData.email.toLowerCase();
      }

      const user = await this.userService.updateUser(userId, updateData);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      ResponseUtils.success(res, 'User updated successfully', user);
    } catch (error: any) {
      logger.error('Update user error:', error);
      ResponseUtils.error(res, error.message || 'Failed to update user', error.message, error.statusCode || 500);
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        throw new AppError('Invalid user ID', 400);
      }

      const deleted = await this.userService.deleteUser(userId);
      if (!deleted) {
        throw new AppError('User not found', 404);
      }

      ResponseUtils.success(res, 'User deleted successfully');
    } catch (error: any) {
      logger.error('Delete user error:', error);
      ResponseUtils.error(res, error.message || 'Failed to delete user', error.message, error.statusCode || 500);
    }
  };

  getCurrentUser = async (req: Request & { user?: any }, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const { password, ...userWithoutPassword } = user;
      ResponseUtils.success(res, 'Current user retrieved successfully', userWithoutPassword);
    } catch (error: any) {
      logger.error('Get current user error:', error);
      ResponseUtils.error(res, error.message || 'Failed to get current user', error.message, error.statusCode || 500);
    }
  };

  updateCurrentUser = async (req: Request & { user?: any }, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const updateData: UpdateUserDto = req.body;

      // Don't allow role changes for current user
      delete updateData.role;
      delete updateData.isActive;

      // Validate email if provided
      if (updateData.email && !ValidationUtils.isValidEmail(updateData.email)) {
        throw new AppError('Invalid email format', 400);
      }

      // Sanitize string inputs
      if (updateData.firstName) {
        updateData.firstName = ValidationUtils.sanitizeString(updateData.firstName);
      }
      if (updateData.lastName) {
        updateData.lastName = ValidationUtils.sanitizeString(updateData.lastName);
      }
      if (updateData.email) {
        updateData.email = updateData.email.toLowerCase();
      }

      const user = await this.userService.updateUser(userId, updateData);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      ResponseUtils.success(res, 'Profile updated successfully', user);
    } catch (error: any) {
      logger.error('Update current user error:', error);
      ResponseUtils.error(res, error.message || 'Failed to update profile', error.message, error.statusCode || 500);
    }
  };
}
