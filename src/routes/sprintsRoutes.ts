import { Router } from 'express';
import { Database } from '../database';
import sprintsController from '../modules/sprints/controller';

/**
 * Configures and returns sprint-related routes.
 *
 * @param {Database} db - The database instance to be used by the sprints controller.
 * @returns {Router} Configured router instance for sprint-related routes.
 */
const sprintsRoutes = (db: Database) => {
  const router = Router();

  router.use('/', sprintsController(db));

  return router;
};

export default sprintsRoutes;
