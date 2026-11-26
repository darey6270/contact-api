import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  console.error('Application error:', error.message);

  res.status(500).json({
    success: false,
    message: 'Something went wrong while processing your request.'
  });
};
