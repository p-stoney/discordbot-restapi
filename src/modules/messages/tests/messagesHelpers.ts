import { Kysely } from 'kysely';
import type { DB, Messages } from '@/database/types';
import { defineFactory } from '@/modules/common/tests/defineFactory';
import { createUsersFactory } from '@/modules/users/tests/usersHelpers';
import { createSprintsFactory } from '@/modules/sprints/tests/sprintsHelpers';

/**
 * Creates a factory for generating message records with default values for testing.
 * Allows overriding default values.
 * @param {Kysely<DB>} db The database instance.
 * @returns A factory function to create message records.
 */
export const createMessagesFactory = (db: Kysely<DB>) =>
  defineFactory<DB, 'messages', Messages>(db, 'messages', {
    userId: 1,
    sprintId: 1,
    timestamp: new Date().toISOString(),
    status: 200,
    gifUrl: 'https://example.com/gif.gif',
    message: 'Test',
  });

/**
 * Creates a matcher for message objects for use in assertions.
 * Allows partial overriding of expected message object properties.
 * @param {Partial<Messages>} overrides Properties to override the default matcher expectations.
 * @returns A matcher object for message objects.
 */
export const messageMatcher = (overrides: Partial<Messages> = {}) => ({
  id: expect.any(Number),
  userId: expect.any(Number),
  sprintId: expect.any(Number),
  timestamp: expect.any(String),
  status: expect.any(Number),
  gifUrl: expect.stringMatching(/https?:\/\/.+/),
  message: expect.any(String),
  ...overrides,
});

/**
 * Sets up test entities required for message tests, including users and sprints.
 * Ensures that there are users and sprints available in the database for messages to reference.
 * @param {Kysely<DB>} db The database instance.
 */
export async function setupTestEntities(db: Kysely<DB>) {
  const usersFactory = createUsersFactory(db);
  const sprintsFactory = createSprintsFactory(db);

  await usersFactory.create({
    username: 'user1',
    discordId: '123456789012345678',
  });
  await usersFactory.create({
    username: 'user2',
    discordId: '123456789012345688',
  });
  await sprintsFactory.create({
    course: 'WD',
    module: 1,
    sprint: 1,
    code: 'WD-1.1',
    title: 'Test',
  });
  await sprintsFactory.create({
    course: 'WD',
    module: 1,
    sprint: 2,
    code: 'WD-1.2',
    title: 'Test',
  });
}
