import { Kysely } from 'kysely';
import createTestDatabase from '@/modules/common/tests/createTestDatabase';
import { messagesRepository } from '@/modules/messages/repository';
import { createMessagesFactory, setupTestEntities } from './messagesHelpers';
import { DB } from '@/database/types';

describe('Messages Repository', () => {
  let db: Kysely<DB>;
  let repository: ReturnType<typeof messagesRepository>;
  let messagesFactory: ReturnType<typeof createMessagesFactory>;

  beforeAll(async () => {
    db = await createTestDatabase();
    repository = messagesRepository(db);
    messagesFactory = createMessagesFactory(db);
    await setupTestEntities(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('messages').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should create and retrieve messages', async () => {
    const message1 = await messagesFactory.create({ userId: 1, sprintId: 1 });
    const message2 = await messagesFactory.create({ userId: 2, sprintId: 2 });

    const messages = await repository.findAll();

    expect(messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userId: message1.userId,
          sprintId: message1.sprintId,
        }),
        expect.objectContaining({
          userId: message2.userId,
          sprintId: message2.sprintId,
        }),
      ])
    );
  });

  it('findById should retrieve a specific message', async () => {
    const message = await messagesFactory.create({ userId: 1, sprintId: 1 });

    const foundMessage = await repository.findById(message.id);

    expect(foundMessage).toMatchObject({
      id: message.id,
      userId: message.userId,
      sprintId: message.sprintId,
    });
  });

  it('update should modify an existing message', async () => {
    const message = await messagesFactory.create({ userId: 1, sprintId: 1 });
    const updatedMessageData = { userId: 2 };
    const updatedMessage = await repository.update(
      message.id,
      updatedMessageData
    );

    expect(updatedMessage).toMatchObject({
      ...updatedMessageData,
      id: message.id,
    });
  });

  it('remove should delete a message', async () => {
    const message = await messagesFactory.create({ userId: 1, sprintId: 1 });

    await repository.remove(message.id);
    const dbMessage = await repository.findById(message.id);

    expect(dbMessage).toBeUndefined();
  });
});
