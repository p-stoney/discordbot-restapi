import { NextFunction, Request, Response } from 'express';

/**
 * Middleware to log request details and execution time.
 * Logs the HTTP method, request URL, response status code, and duration.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 */
export const auditLog = (req: Request, res: Response, next: NextFunction) => {
  const startTime = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const duration = seconds * 1000 + nanoseconds / 1e6;

    console.log({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
    });
  });

  next();
};
