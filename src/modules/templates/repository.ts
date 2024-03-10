import { sql } from 'kysely';
import { Database } from '../../database';
import { baseRepository } from '../common/baseRepository';
import { InsertableTemplateData } from './schema';

/**
 * Extends the baseRepository to provide template-specific data access methods.
 * @param {Database} db - The database connection instance.
 * @returns An object containing functions to interact with the templates table.
 */
export const templatesRepository = (db: Database) => {
  const repository = baseRepository(db, 'templates');

  return {
    ...repository,

    /**
     * Creates a new template with the provided data.
     * @param {InsertableTemplateData} templateData - The data to create a new template.
     * @returns {Promise<ReturnType<typeof repository.create>>} A promise resolved with the newly created template.
     * @throws {TemplateNotFound} If the template with the specified id is not found.
     */
    create: async (templateData: InsertableTemplateData) =>
      db
        .insertInto('templates')
        .values(templateData)
        .returningAll()
        .executeTakeFirst(),

    /**
     * Finds a random template.
     * @returns {Promise<ReturnType<typeof repository.findRandom>>} A promise resolved with the found template.
     * @throws {TemplateNotFound} If no template is found.
     */
    findRandom: async () =>
      db
        .selectFrom('templates')
        .selectAll()
        .orderBy(sql`random()`)
        .limit(1)
        .executeTakeFirst(),
  };
};

export default templatesRepository;
