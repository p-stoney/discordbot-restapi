import { Kysely } from 'kysely';
import { createTestDatabase } from '@/modules/common/tests/createTestDatabase';
import { createUsersFactory } from './usersHelpers';
import {
  parse,
  parseInsertable,
  parseUpdateable,
} from '@/modules/users/schema';
import { DB } from '@/database/types';

describe('usersSchema validation', () => {
  let db: Kysely<DB>;
  let usersFactory: ReturnType<typeof createUsersFactory>;

  beforeAll(async () => {
    db = await createTestDatabase();
    usersFactory = createUsersFactory(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('users').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('parses a valid user object with all fields using UserService', async () => {
    const user = await usersFactory.create();

    expect(parse(user)).toEqual(user);
  });

  it('throws an error for missing required fields', async () => {
    const usersWithMissingFields = {
      username: 'testuser',
    };

    expect(() => parse(usersWithMissingFields)).toThrow(/discordId/i);
  });

  it('allows creating a user without id', () => {
    const userData = {
      username: 'testuser',
      discordId: '123456789012345678',
    };

    expect(() => parseInsertable(userData)).not.toThrow();
  });

  it('allows updating a user with partial fields', () => {
    const partialUpdateData = {
      username: 'updateduser',
    };

    expect(() => parseUpdateable(partialUpdateData)).not.toThrow();
  });
});
