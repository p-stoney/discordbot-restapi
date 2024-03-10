import { Database } from '@/database';
import { templatesRepository } from './repository';
import { TemplateNotFound } from './errors';
import type { InsertableTemplateData, UpdateableTemplateData } from './schema';

/**
 * Provides high-level operations for managing templates in the application,
 * including CRUD operations and business logic encapsulation.
 */
export class TemplateService {
  private db: Database;

  private templatesRepo: ReturnType<typeof templatesRepository>;

  /**
   * Constructs a new TemplateService instance with a database connection.
   *
   * @param {Database} db - The database connection instance.
   */
  constructor(db: Database) {
    this.db = db;
    this.templatesRepo = templatesRepository(db);
  }

  /**
   * Finds all templates with optional pagination.
   *
   * @param {number} limit - The maximum number of templates to return.
   * @param {number} offset - The number of templates to skip before starting to collect the result set.
   * @throws {TemplateNotFound} If no templates are found.
   * @returns {Promise<Array>} A promise that resolves with the found templates.
   */
  async findAll(limit: number = 10, offset: number = 0) {
    const records = await this.templatesRepo.findAll(limit, offset);
    if (records.length === 0) {
      throw new TemplateNotFound(`No templates found`);
    }
    return records;
  }

  /**
   * Finds a single template by its ID.
   *
   * @param {number} id - The unique ID of the template.
   * @throws {TemplateNotFound} If the template with the specified ID is not found.
   * @returns {Promise<Object>} A promise that resolves with the found template.
   */
  async findById(id: number) {
    const template = await this.templatesRepo.findById(id);
    if (!template) {
      throw new TemplateNotFound(`Template with ID ${id} not found`);
    }
    return template;
  }

  /**
   * Finds a single template by its name.
   *
   * @param {string} name - The unique name of the template.
   * @throws {TemplateNotFound} If the template with the specified name is not found.
   * @returns {Promise<Object>} A promise that resolves with the found template.
   */
  async findRandomTemplate() {
    const template = await this.templatesRepo.findRandom();
    if (!template) {
      throw new Error(`No template found.`);
    }
    return template;
  }

  /**
   * Creates a new template.
   *
   * @param {InsertableTemplateData} templateData - The data to create the template with.
   * @throws {TemplateNotFound} If the template could not be created.
   * @returns {Promise<Object>} A promise that resolves with the newly created template.
   */
  async createTemplate(templateData: InsertableTemplateData) {
    const newTemplate = await this.templatesRepo.create(templateData);
    if (!newTemplate) {
      throw new TemplateNotFound(`Failed to create new template`);
    }
    return newTemplate;
  }

  /**
   * Updates an existing template by its ID.
   *
   * @param {number} id - The unique ID of the template to update.
   * @param {UpdateableTemplateData} templateData - The data to update the template with.
   * @throws {TemplateNotFound} If the template could not be updated.
   * @returns {Promise<Object>} A promise that resolves with the updated template.
   */
  async updateTemplate(id: number, templateData: UpdateableTemplateData) {
    const updatedTemplate = await this.templatesRepo.update(id, templateData);
    if (!updatedTemplate) {
      throw new TemplateNotFound(`Failed to update template with ID ${id}`);
    }
    return updatedTemplate;
  }

  /**
   * Removes a template by its ID.
   *
   * @param {number} id - The unique ID of the template to remove.
   * @returns {Promise<Object>} A promise that resolves to a confirmation of the deletion.
   */
  async removeTemplate(id: number) {
    await this.templatesRepo.remove(id);
    return { message: `Template with ID ${id} successfully deleted` };
  }
}
