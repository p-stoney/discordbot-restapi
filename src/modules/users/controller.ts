import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as schema from './schema';
import { jsonRoute } from '@/middleware/jsonRoute';
import { Database } from '@/database';
import { UserService } from './userService';

/**
 * Creates and configures routes for user-related operations.
 *
 * Provides endpoints for fetching all users, fetching a single user by ID,
 * creating a new user, updating an existing user, and deleting a user.
 *
 * @param {Database} db - The database instance for accessing the user service.
 * @returns {Router} Configured router instance for user-related operations.
 */
const usersController = (db: Database) => {
  const router = Router();
  const userService = new UserService(db);

  router
    .route('/')
    .get(
      jsonRoute(async (req) => {
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;
        const records = await userService.findAll(limit, offset);

        return records;
      })
    )
    .post(
      jsonRoute(async (req) => {
        const validatedData = schema.parseInsertable(req.body);
        const newUser = await userService.createUser(validatedData);

        return newUser;
      }, StatusCodes.CREATED)
    );

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        const user = await userService.findById(validatedId);

        return user;
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        const validatedData = schema.parseUpdateable(req.body);
        const updatedUser = await userService.updateUser(
          validatedId,
          validatedData
        );

        return updatedUser;
      }, StatusCodes.NO_CONTENT)
    )
    .delete(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        await userService.removeUser(validatedId);

        return {};
      }, StatusCodes.NO_CONTENT)
    );

  router.route('/username/:username').get(
    jsonRoute(async (req) => {
      const validatedUsername = schema.parseUsername(req.params.username);
      const user = await userService.findByName(validatedUsername);

      return user;
    })
  );

  router.route('/discordId/:discordId').get(
    jsonRoute(async (req) => {
      const validateddiscordId = schema.parsediscordId(req.params.discordId);
      const user = await userService.findBydiscordId(validateddiscordId);

      return user;
    })
  );

  return router;
};

export default usersController;
