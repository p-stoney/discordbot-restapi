import { Kysely } from 'kysely';
import { createTestDatabase } from '@/modules/common/tests/createTestDatabase';
import { createMessagesFactory, setupTestEntities } from './messagesHelpers';
import {
  parse,
  parseInsertable,
  parseUpdateable,
} from '@/modules/messages/schema';
import { DB } from '@/database/types';

describe('messagesSchema validation', () => {
  let db: Kysely<DB>;
  let messagesFactory: ReturnType<typeof createMessagesFactory>;

  beforeAll(async () => {
    db = await createTestDatabase();
    messagesFactory = createMessagesFactory(db);
    await setupTestEntities(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('messages').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('parses a valid message object with all fields', async () => {
    const message = await messagesFactory.create();

    expect(parse(message)).toEqual(message);
  });

  it('throws an error for missing required fields', async () => {
    const messageWithMissingFields = {
      userId: 1,
      sprintId: 1,
      status: 200,
    };

    expect(() => parse(messageWithMissingFields)).toThrow(/gifUrl/i);
  });

  it('allows creating a message without id and timestamp', () => {
    const messageData = {
      userId: 1,
      sprintId: 1,
      status: 200,
      gifUrl: 'https://example.com/gif.gif',
      message: 'A valid message',
    };

    expect(() => parseInsertable(messageData)).not.toThrow();
  });

  it('allows updating a message with partial fields', () => {
    const partialUpdateData = {
      status: 201,
    };

    expect(() => parseUpdateable(partialUpdateData)).not.toThrow();
  });
});
