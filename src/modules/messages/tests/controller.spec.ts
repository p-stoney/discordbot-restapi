import { Kysely } from 'kysely';
import supertest from 'supertest';
import createApp from '@/app';
import { createTestDatabase } from '@/modules/common/tests/createTestDatabase';
import { DB } from '@/database/types';
import { MessageService } from '../messageService';
import { messagesRepository } from '../repository';
import {
  messageMatcher,
  setupTestEntities,
} from '@/modules/messages/tests/messagesHelpers';

describe('Messages Controller', () => {
  let db: Kysely<DB>;
  let request: supertest.SuperTest<supertest.Test>;
  let repository: ReturnType<typeof messagesRepository>;
  let messageService: MessageService;

  beforeAll(async () => {
    db = await createTestDatabase();
    const app = createApp(db);
    request = supertest(app);
    repository = messagesRepository(db);
    messageService = new MessageService(db);
    await setupTestEntities(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('messages').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('GET /messages should return a list of messages', async () => {
    const message1 = await messageService.createMessage({
      userId: 1,
      sprintId: 1,
      status: 200,
      gifUrl: 'https://example.com/gif.gif',
      message: 'test',
    });
    const message2 = await messageService.createMessage({
      userId: 2,
      sprintId: 2,
      status: 200,
      gifUrl: 'https://example.com/gif.gif',
      message: 'test',
    });

    const response = await request.get('/messages').expect(200);

    expect(response.body).toEqual(
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

  it('GET /messages/:id should return a specific message', async () => {
    const newMessage = await messageService.createMessage({
      userId: 1,
      sprintId: 1,
      status: 200,
      gifUrl: 'https://example.com/gif.gif',
      message: 'test',
    });

    const response = await request
      .get(`/messages/${newMessage.id}`)
      .expect(200);

    expect(response.body).toMatchObject(messageMatcher());
  });

  it('POST /messages should create a new message', async () => {
    const newMessageData = {
      userId: 1,
      sprintId: 1,
      status: 200,
      gifUrl: 'https://example.com/gif.gif',
      message: 'test',
    };

    const response = await request
      .post('/messages')
      .send(newMessageData)
      .expect(201);

    expect(response.body).toMatchObject(messageMatcher(newMessageData));
  });

  it('PATCH /messages/:id should update a specific message', async () => {
    const message = await messageService.createMessage({
      userId: 1,
      sprintId: 1,
      status: 200,
      gifUrl: 'https://example.com/gif.gif',
      message: 'test',
    });
    const updatedMessageData = {
      userId: 2,
      status: 400,
      gifUrl: 'https://example.com/gif.gif',
      message: 'test',
    };

    await request
      .patch(`/messages/${message.id}`)
      .send(updatedMessageData)
      .expect(204);
    const dbMessage = await repository.findById(message.id);

    expect(dbMessage).toMatchObject(updatedMessageData);
  });

  it('DELETE /messages/:id should delete a message', async () => {
    const message = await messageService.createMessage({
      userId: 1,
      sprintId: 1,
      status: 200,
      gifUrl: 'https://example.com/gif.gif',
      message: 'test',
    });

    await request.delete(`/messages/${message.id}`).expect(204);
    const dbMessage = await repository.findById(message.id);

    expect(dbMessage).toBeUndefined();
  });
});
