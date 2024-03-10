import { Kysely } from 'kysely';
import supertest from 'supertest';
import createApp from '@/app';
import { createTestDatabase } from '@/modules/common/tests/createTestDatabase';
import { DB } from '@/database/types';
import { UserService } from '../userService';
import { usersRepository } from '../repository';
import { userMatcher } from '@/modules/users/tests/usersHelpers';

describe('Users Controller', () => {
  let db: Kysely<DB>;
  let request: supertest.SuperTest<supertest.Test>;
  let repository: ReturnType<typeof usersRepository>;
  let userService: UserService;

  beforeAll(async () => {
    db = await createTestDatabase();
    const app = createApp(db);
    request = supertest(app);
    repository = usersRepository(db);
    userService = new UserService(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('users').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('GET /users should return a list of users', async () => {
    await userService.createUser({
      username: 'testuser',
      discordId: '123456789012345678',
    });
    await userService.createUser({
      username: 'testuser2',
      discordId: '123456789012345679',
    });

    const response = await request.get('/users').expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: 'testuser',
          discordId: '123456789012345678',
        }),
        expect.objectContaining({
          username: 'testuser2',
          discordId: '123456789012345679',
        }),
      ])
    );
  });

  it('GET /users/:id should return a specific user', async () => {
    const newUser = await userService.createUser({
      username: 'testuser',
      discordId: '123456789012345678',
    });

    const response = await request.get(`/users/${newUser.id}`).expect(200);

    expect(response.body).toMatchObject(userMatcher());
  });

  it('POST /users should create a new user', async () => {
    const newUserData = {
      username: 'testuser',
      discordId: '123456789012345678',
    };

    const response = await request.post('/users').send(newUserData).expect(201);

    expect(response.body).toMatchObject(userMatcher(newUserData));
  });

  it('PATCH /users/:id should update a specific user', async () => {
    const user = await userService.createUser({
      username: 'testuser',
      discordId: '123456789012345678',
    });
    const updatedUserData = { username: 'updateduser' };

    await request.patch(`/users/${user.id}`).send(updatedUserData).expect(204);
    const dbUser = await repository.findById(user.id);

    expect(dbUser).toMatchObject(updatedUserData);
  });

  it('DELETE /users/:id should delete a user', async () => {
    const user = await userService.createUser({
      username: 'testuser',
      discordId: '123456789012345678',
    });

    await request.delete(`/users/${user.id}`).expect(204);
    const dbUser = await repository.findById(user.id);

    expect(dbUser).toBeUndefined();
  });
});
