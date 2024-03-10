import { Router } from 'express';
import { Database } from '../database';
import templatesController from '../modules/templates/controller';

/**
 * Configures and returns template-related routes.
 *
 * @param {Database} db - The database instance to be used by the templates controller.
 * @returns {Router} Configured router instance for template-related routes.
 */
const templatesRoutes = (db: Database) => {
  const router = Router();

  router.use('/', templatesController(db));

  return router;
};

export default templatesRoutes;
