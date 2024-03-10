import { Kysely } from 'kysely';
import type { DB, Sprints } from '@/database/types';
import { defineFactory } from '@/modules/common/tests/defineFactory';

/**
 * Creates a factory for generating sprint records with default values for testing.
 * Allows overriding default values.
 * @param {Kysely<DB>} db The database instance.
 * @returns A factory function to create sprint records.
 */
export const createSprintsFactory = (db: Kysely<DB>) =>
  defineFactory<DB, 'sprints', Sprints>(db, 'sprints', {
    course: 'WD',
    module: 1,
    sprint: 4,
    code: 'WD-1.4',
    title: 'Test',
  });

/**
 * Creates a matcher for sprint objects for use in assertions.
 * Allows partial overriding of expected sprint object properties.
 * @param {Partial<Sprints>} overrides Properties to override the default matcher expectations.
 * @returns A matcher object for sprint objects.
 */
export const sprintMatcher = (overrides: Partial<Sprints> = {}) => ({
  id: expect.any(Number),
  course: expect.stringMatching(/^[A-Z]{2}$/),
  module: expect.any(Number),
  sprint: expect.any(Number),
  code: expect.stringMatching(/^\w{2}-\d\.\d$/),
  title: expect.any(String),
  ...overrides,
});
