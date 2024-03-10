import express, { Express } from 'express';
import { Database } from './database';
import jsonErrorHandler from './middleware/jsonErrors';
import usersRoutes from './routes/usersRoutes';
import sprintsRoutes from './routes/sprintsRoutes';
import messagesRoutes from './routes/messagesRoutes';
import templatesRoutes from './routes/templatesRoutes';
import { auditLog } from './middleware/auditLog';

/**
 * Creates and configures an Express application.
 * Sets up middleware for JSON parsing, audit logging, route handling for different modules,
 * and error handling for JSON responses.
 *
 * @param {Database} db - The database instance used throughout the application.
 * @returns {Express} An instance of the configured Express application.
 */
const createApp = (db: Database): Express => {
  const app = express();

  app.use(express.json());

  app.use(auditLog);

  app.use('/users', usersRoutes(db));
  app.use('/sprints', sprintsRoutes(db));
  app.use('/messages', messagesRoutes(db));
  app.use('/templates', templatesRoutes(db));

  app.use(jsonErrorHandler);

  return app;
};

export default createApp;
