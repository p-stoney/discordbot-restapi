import { Router } from 'express';
import { Database } from '../database';
import messagesController from '../modules/messages/controller';

/**
 * Configures and returns message-related routes.
 *
 * @param {Database} db - The database instance to be used by the messages controller.
 * @returns {Router} Configured router instance for message-related routes.
 */
const messagesRoutes = (db: Database) => {
  const router = Router();

  router.use('/', messagesController(db));

  return router;
};

export default messagesRoutes;
