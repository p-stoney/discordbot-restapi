import { Kysely } from 'kysely';
import type { DB, Templates } from '@/database/types';
import { defineFactory } from '@/modules/common/tests/defineFactory';

/**
 * Creates a factory for generating template records with default values for testing.
 * Allows overriding default values.
 * @param {Kysely<DB>} db The database instance.
 * @returns A factory function to create template records.
 */
export const createTemplatesFactory = (db: Kysely<DB>) =>
  defineFactory<DB, 'templates', Templates>(db, 'templates', {
    template: 'testtemplate',
    isActive: '1',
  });

/**
 * Creates a matcher for template objects for use in assertions.
 * Allows partial overriding of expected template object properties.
 * @param {Partial<Templates>} overrides Properties to override the default matcher expectations.
 * @returns A matcher object for template objects.
 */
export const templateMatcher = (overrides: Partial<Templates> = {}) => ({
  id: expect.any(Number),
  template: expect.any(String),
  isActive: expect.stringMatching(/^[01]$/),
  ...overrides,
});
