import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as schema from './schema';
import { jsonRoute } from '@/middleware/jsonRoute';
import { Database } from '@/database';
import { SprintService } from './sprintService';

/**
 * Creates and configures routes for sprint-related operations.
 *
 * Provides endpoints for fetching all sprints, fetching a single sprint by ID,
 * creating a new sprint, updating an existing sprint, and deleting a sprint.
 *
 * @param {Database} db - The database instance for accessing the sprint service.
 * @returns {Router} Configured router instance for sprint-related operations.
 */
const sprintsController = (db: Database) => {
  const router = Router();
  const sprintService = new SprintService(db);

  router
    .route('/')
    .get(
      jsonRoute(async (req) => {
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;
        const records = await sprintService.findAll(limit, offset);

        return records;
      })
    )
    .post(
      jsonRoute(async (req) => {
        const validatedData = schema.parseInsertable(req.body);
        const newSprint = await sprintService.createSprint(validatedData);

        return newSprint;
      }, StatusCodes.CREATED)
    );

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        const sprint = await sprintService.findById(validatedId);

        return sprint;
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        const validatedData = schema.parseUpdateable(req.body);
        const updatedSprint = await sprintService.updateSprint(
          validatedId,
          validatedData
        );

        return updatedSprint;
      }, StatusCodes.NO_CONTENT)
    )
    .delete(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        await sprintService.removeSprint(validatedId);

        return {};
      }, StatusCodes.NO_CONTENT)
    );

  router.route('/course/:course').get(
    jsonRoute(async (req) => {
      const validatedCourse = schema.parseCourse(req.params.course);
      const records = await sprintService.findByCourse(validatedCourse);

      return records;
    })
  );

  return router;
};

export default sprintsController;
