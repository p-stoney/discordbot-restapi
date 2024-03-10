import { Database } from '../../database';
import { baseRepository } from '../common/baseRepository';
import { InsertableSprintData } from './schema';

/**
 * Extends the baseRepository to provide sprint-specific data access methods.
 * @param {Database} db - The database connection instance.
 * @returns An object containing functions to interact with the sprints table.
 */
export const sprintsRepository = (db: Database) => {
  const repository = baseRepository(db, 'sprints');

  return {
    ...repository,

    /**
     * Creates a new sprint with the provided data.
     * @param {InsertableSprintData} sprintData - The data to create a new sprint.
     * @returns {Promise<ReturnType<typeof repository.create>>} A promise resolved with the newly created sprint.
     * @throws {SprintNotFound} If the sprint with the specified code is not found.
     */
    create: async (sprintData: InsertableSprintData) =>
      db
        .insertInto('sprints')
        .values(sprintData)
        .returningAll()
        .executeTakeFirst(),

    /**
     * Finds a sprint by its code.
     * @param {string} Code - The unique code of the sprint.
     * @returns {Promise<ReturnType<typeof repository.findByCode>>} A promise resolved with the found sprint.
     * @throws {SprintNotFound} If the sprint with the specified code is not found.
     */
    findByCode: async (Code: string) =>
      db
        .selectFrom('sprints')
        .selectAll()
        .where('code', '=', Code)
        .executeTakeFirst(),

    /**
     * Finds all sprints by their course.
     * @param {string} course - The unique course of the sprint.
     * @returns {Promise<ReturnType<typeof repository.findByCourse>>} A promise resolved with the found sprints.
     * @throws {SprintNotFound} If no sprints with the specified course are found.
     */
    findByCourse: async (course: string) =>
      db
        .selectFrom('sprints')
        .selectAll()
        .where('course', '=', course)
        .execute(),
  };
};

export default sprintsRepository;
