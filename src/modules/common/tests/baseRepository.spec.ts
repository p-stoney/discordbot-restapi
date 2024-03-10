import { Kysely } from 'kysely';
import { createTestDatabase } from './createTestDatabase';
import { baseRepository } from '../baseRepository';
import { createMessagesFactory } from '@/modules/messages/tests/messagesHelpers';
import { createUsersFactory } from '@/modules/users/tests/usersHelpers';
import { createSprintsFactory } from '@/modules/sprints/tests/sprintsHelpers';
import { DB } from '@/database/types';

describe('BaseRepository Integration Tests', () => {
  let db: Kysely<DB>;
  let messagesFactory: ReturnType<typeof createMessagesFactory>;
  let usersFactory: ReturnType<typeof createUsersFactory>;
  let sprintsFactory: ReturnType<typeof createSprintsFactory>;

  beforeAll(async () => {
    db = await createTestDatabase();
    messagesFactory = createMessagesFactory(db);
    usersFactory = createUsersFactory(db);
    sprintsFactory = createSprintsFactory(db);

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
  });

  beforeEach(async () => {
    await db.deleteFrom('messages').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should create a message', async () => {
    const repository = baseRepository(db, 'messages');
    const newMessageData = {
      userId: 1,
      sprintId: 1,
      message: 'Test message',
      status: 200,
      gifUrl: 'http://example.com/gif',
    };
    const newMessage = await repository.create(newMessageData);

    expect(newMessage).toMatchObject(newMessageData);
    expect(newMessage!.id).toBeDefined();
  });

  it('should find a message by ID', async () => {
    const repository = baseRepository(db, 'messages');
    const { id } = await messagesFactory.create({ userId: 1, sprintId: 1 });

    const foundMessage = await repository.findById(id);

    expect(foundMessage).toBeDefined();
    expect(foundMessage!.id).toBe(id);
  });

  it('should update a message', async () => {
    const repository = baseRepository(db, 'messages');
    const { id } = await messagesFactory.create({ userId: 1, sprintId: 1 });
    const updatedMessageData = { message: 'Updated Test message', status: 201 };

    await repository.update(id, updatedMessageData);
    const updatedMessage = await repository.findById(id);

    expect(updatedMessage).toMatchObject(updatedMessageData);
  });

  it('should delete a message', async () => {
    const repository = baseRepository(db, 'messages');
    const { id } = await messagesFactory.create({ userId: 1, sprintId: 1 });

    await repository.remove(id);

    const deletedMessage = await repository.findById(id);
    expect(deletedMessage).toBeUndefined();
  });

  it('should find all messages', async () => {
    const repository = baseRepository(db, 'messages');
    await messagesFactory.create({ userId: 1, sprintId: 1 });
    await messagesFactory.create({ userId: 1, sprintId: 1 });

    const messages = await repository.findAll();
    expect(messages.length).toBeGreaterThanOrEqual(2);
  });
});
