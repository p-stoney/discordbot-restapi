import { type ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

const { NODE_ENV } = process.env;
const isTest = NODE_ENV === 'test';

/**
 * Reports error in a simple structured JSON format.
 * Taken from wd-3-2-4-starter.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const jsonErrors: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = getErrorStatusCode(error);

  if (!isTest) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      message: error.message ?? 'Internal server error',
      ...error,
    },
  });
};

function getErrorStatusCode(error: Error) {
  if ('status' in error && typeof error.status === 'number') {
    return error.status;
  }

  if (error instanceof ZodError) return StatusCodes.BAD_REQUEST;

  return StatusCodes.INTERNAL_SERVER_ERROR;
}

export default jsonErrors;
