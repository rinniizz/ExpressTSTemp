import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthUtils, ResponseUtils, ValidationUtils } from '../utils/helpers';
import { AppError, CreateUserDto, LoginDto, AuthResponse } from '../types';
import logger from '../utils/logger';

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName, role }: CreateUserDto = req.body;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        throw new AppError('All fields are required', 400);
      }

      if (!ValidationUtils.isValidEmail(email)) {
        throw new AppError('Invalid email format', 400);
      }

      if (!ValidationUtils.isValidPassword(password)) {
        throw new AppError(
          'Password must be at least 8 characters with uppercase, lowercase, and number',
          400
        );
      }

      // Create user
      const userData: CreateUserDto = {
        email: email.toLowerCase(),
        password,
        firstName: ValidationUtils.sanitizeString(firstName),
        lastName: ValidationUtils.sanitizeString(lastName),
      };

      if (role) {
        userData.role = role;
      }

      const user = await this.userService.createUser(userData);

      // Generate token
      const token = AuthUtils.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const authResponse: AuthResponse = {
        user,
        token,
      };

      ResponseUtils.success(res, 'User registered successfully', authResponse, 201);
    } catch (error: any) {
      logger.error('Register error:', error);
      ResponseUtils.error(res, error.message || 'Registration failed', error.message, error.statusCode || 500);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginDto = req.body;

      // Validate input
      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      // Authenticate user
      const user = await this.userService.authenticateUser(email.toLowerCase(), password);
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate token
      const token = AuthUtils.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const authResponse: AuthResponse = {
        user,
        token,
      };

      ResponseUtils.success(res, 'Login successful', authResponse);
    } catch (error: any) {
      logger.error('Login error:', error);
      ResponseUtils.error(res, error.message || 'Login failed', error.message, error.statusCode || 500);
    }
  };

  getProfile = async (req: Request & { user?: any }, res: Response): Promise<void> => {
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
      ResponseUtils.success(res, 'Profile retrieved successfully', userWithoutPassword);
    } catch (error: any) {
      logger.error('Get profile error:', error);
      ResponseUtils.error(res, error.message || 'Failed to get profile', error.message, error.statusCode || 500);
    }
  };

  refreshToken = async (req: Request & { user?: any }, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new AppError('User not authenticated', 401);
      }

      const user = await this.userService.getUserById(userId);
      if (!user || !user.isActive) {
        throw new AppError('User not found or inactive', 404);
      }

      // Generate new token
      const token = AuthUtils.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      ResponseUtils.success(res, 'Token refreshed successfully', { token });
    } catch (error: any) {
      logger.error('Refresh token error:', error);
      ResponseUtils.error(res, error.message || 'Failed to refresh token', error.message, error.statusCode || 500);
    }
  };
}
