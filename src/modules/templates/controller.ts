import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as schema from './schema';
import { jsonRoute } from '@/middleware/jsonRoute';
import { Database } from '@/database';
import { TemplateService } from './templateService';

/**
 * Creates and configures routes for template-related operations.
 *
 * Provides endpoints for fetching all templates, fetching a single template by ID,
 * creating a new template, updating an existing template, and deleting a template.
 *
 * @param {Database} db - The database instance for accessing the template service.
 * @returns {Router} Configured router instance for template-related operations.
 */
const templatesController = (db: Database) => {
  const router = Router();
  const templateService = new TemplateService(db);

  router
    .route('/')
    .get(
      jsonRoute(async (req) => {
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;
        const records = await templateService.findAll(limit, offset);

        return records;
      })
    )
    .post(
      jsonRoute(async (req) => {
        const validatedData = schema.parseInsertable(req.body);
        const newTemplate = await templateService.createTemplate(validatedData);

        return newTemplate;
      }, StatusCodes.CREATED)
    );

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        const template = await templateService.findById(validatedId);

        return template;
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        const validatedData = schema.parseUpdateable(req.body);
        const updatedTemplate = await templateService.updateTemplate(
          validatedId,
          validatedData
        );

        return updatedTemplate;
      }, StatusCodes.NO_CONTENT)
    )
    .delete(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        await templateService.removeTemplate(validatedId);

        return {};
      }, StatusCodes.NO_CONTENT)
    );

  return router;
};

export default templatesController;
