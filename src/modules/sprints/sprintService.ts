import { Database } from '@/database';
import { sprintsRepository } from './repository';
import { SprintNotFound } from './errors';
import type { InsertableSprintData, UpdateableSprintData } from './schema';

/**
 * Provides high-level operations for managing sprints in the application,
 * including CRUD operations and business logic encapsulation.
 */
export class SprintService {
  private db: Database;

  private sprintsRepo: ReturnType<typeof sprintsRepository>;

  /**
   * Constructs a new SprintService instance with a database connection.
   *
   * @param {Database} db - The database connection instance.
   */
  constructor(db: Database) {
    this.db = db;
    this.sprintsRepo = sprintsRepository(db);
  }

  /**
   * Finds all sprints with optional pagination.
   *
   * @param {number} limit - The maximum number of sprints to return.
   * @param {number} offset - The number of sprints to skip before starting to collect the result set.
   * @throws {SprintNotFound} If no sprints are found.
   * @returns {Promise<Array>} A promise that resolves with the found sprints.
   */
  async findAll(limit: number = 10, offset: number = 0) {
    const records = await this.sprintsRepo.findAll(limit, offset);
    if (records.length === 0) {
      throw new SprintNotFound(`No sprints found`);
    }
    return records;
  }

  /**
   * Finds a single sprint by its ID.
   *
   * @param {number} id - The unique ID of the sprint.
   * @throws {SprintNotFound} If the sprint with the specified ID is not found.
   * @returns {Promise<Object>} A promise that resolves with the found sprint.
   */
  async findById(id: number) {
    const sprint = await this.sprintsRepo.findById(id);
    if (!sprint) {
      throw new SprintNotFound(`Sprint with ID ${id} not found`);
    }
    return sprint;
  }

  /**
   * Finds a single sprint by its code.
   *
   * @param {string} code - The unique code of the sprint.
   * @throws {SprintNotFound} If the sprint with the specified code is not found.
   * @returns {Promise<Object>} A promise that resolves with the found sprint.
   */
  async findByCode(code: string) {
    const sprint = await this.sprintsRepo.findByCode(code);
    if (!sprint) {
      throw new Error(`Sprint not found: ${code}`);
    }
    return sprint;
  }

  /**
   * Finds all sprints by their course.
   *
   * @param {string} course - The unique course of the sprint.
   * @throws {SprintNotFound} If no sprints with the specified course are found.
   * @returns {Promise<Array>} A promise that resolves with the found sprints.
   */
  async findByCourse(course: string) {
    const records = await this.sprintsRepo.findByCourse(course);
    if (records.length === 0) {
      throw new SprintNotFound(`Sprints with course ${course} not found`);
    }
    return records;
  }

  /**
   * Creates a new sprint.
   *
   * @param {InsertableSprintData} sprintData - The data to create the sprint with.
   * @throws {SprintNotFound} If the sprint could not be created.
   * @returns {Promise<Object>} A promise that resolves with the newly created sprint.
   */
  async createSprint(sprintData: InsertableSprintData) {
    const newSprint = await this.sprintsRepo.create(sprintData);
    if (!newSprint) {
      throw new SprintNotFound(`Failed to create new sprint`);
    }
    return newSprint;
  }

  /**
   * Updates an existing sprint by its ID.
   *
   * @param {number} id - The unique ID of the sprint to update.
   * @param {UpdateableSprintData} sprintData - The data to update the sprint with.
   * @throws {SprintNotFound} If the sprint could not be updated.
   * @returns {Promise<Object>} A promise that resolves with the updated sprint.
   */
  async updateSprint(id: number, sprintData: UpdateableSprintData) {
    const updatedSprint = await this.sprintsRepo.update(id, sprintData);
    if (!updatedSprint) {
      throw new SprintNotFound(`Failed to update sprint with ID ${id}`);
    }
    return updatedSprint;
  }

  /**
   * Removes a sprint by its ID.
   *
   * @param {number} id - The unique ID of the sprint to remove.
   * @throws {SprintNotFound} If the sprint could not be removed.
   * @returns {Promise<Object>} A promise that resolves with the removed sprint.
   */
  async removeSprint(id: number) {
    await this.sprintsRepo.remove(id);
    return { message: `Sprint with ID ${id} successfully deleted` };
  }
}
