import { Kysely } from 'kysely';
import type { DB, Users } from '@/database/types';
import { defineFactory } from '@/modules/common/tests/defineFactory';

/**
 * Creates a factory for generating user records with default values for testing.
 * Allows overriding default values.
 * @param {Kysely<DB>} db The database instance.
 * @returns A factory function to create user records.
 */
export const createUsersFactory = (db: Kysely<DB>) =>
  defineFactory<DB, 'users', Users>(db, 'users', {
    username: 'testuser',
    discordId: '123456789012345678',
  });

/**
 * Creates a matcher for user objects for use in assertions.
 * Allows partial overriding of expected user object properties.
 * @param {Partial<Users>} overrides Properties to override the default matcher expectations.
 * @returns A matcher object for user objects.
 */
export const userMatcher = (overrides: Partial<Users> = {}) => ({
  id: expect.any(Number),
  username: expect.any(String),
  discordId: expect.stringMatching(/^\d{18}$/),
  ...overrides,
});
