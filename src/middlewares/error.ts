import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';
import { ResponseUtils } from '../utils/helpers';
import logger from '../utils/logger';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let err = { ...error };
  err.message = error.message;

  // Log error
  logger.error(error);

  // Mongoose bad ObjectId
  if (error.name === 'CastError') {
    const message = 'Resource not found';
    err = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const message = 'Duplicate field value entered';
    err = new AppError(message, 400);
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const message = Object.values(error.errors).map((val: any) => val.message).join(', ');
    err = new AppError(message, 400);
  }

  // MySQL duplicate entry
  if (error.code === 'ER_DUP_ENTRY') {
    const message = 'Duplicate entry';
    err = new AppError(message, 400);
  }

  // MySQL foreign key constraint
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    const message = 'Referenced record does not exist';
    err = new AppError(message, 400);
  }

  ResponseUtils.error(
    res,
    err.message || 'Server Error',
    err.message,
    err.statusCode || 500
  );
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};
