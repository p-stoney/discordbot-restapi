import { Router } from 'express';
import { Database } from '../database';
import usersController from '../modules/users/controller';

/**
 * Configures and returns user-related routes.
 *
 * @param {Database} db - The database instance to be used by the users controller.
 * @returns {Router} Configured router instance for user-related routes.
 */
const usersRoutes = (db: Database) => {
  const router = Router();

  router.use('/', usersController(db));

  return router;
};

export default usersRoutes;
