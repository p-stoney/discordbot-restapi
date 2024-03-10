import { Kysely } from 'kysely';
import createTestDatabase from '@/modules/common/tests/createTestDatabase';
import { usersRepository } from '@/modules/users/repository';
import { createUsersFactory } from './usersHelpers';
import { DB } from '@/database/types';

describe('Users Repository', () => {
  let db: Kysely<DB>;
  let repository: ReturnType<typeof usersRepository>;
  let usersFactory: ReturnType<typeof createUsersFactory>;

  beforeAll(async () => {
    db = await createTestDatabase();
    repository = usersRepository(db);
    usersFactory = createUsersFactory(db);
  });

  beforeEach(async () => {
    await db.deleteFrom('users').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should create and retrieve users', async () => {
    const newUser = await usersFactory.create({
      username: 'testuser',
      discordId: '123456789012345678',
    });
    const newUser2 = await usersFactory.create({
      username: 'testuser2',
      discordId: '123456789012322678',
    });

    const users = await repository.findAll();

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ discordId: newUser.discordId }),
        expect.objectContaining({ discordId: newUser2.discordId }),
      ])
    );
  });

  it('findById should retrieve a specific user', async () => {
    const newUser = await usersFactory.create({
      username: 'testuser',
      discordId: '123456789012345678',
    });

    const foundUser = await repository.findById(newUser.id);

    expect(foundUser).toMatchObject({
      id: newUser.id,
      username: newUser.username,
      discordId: newUser.discordId,
    });
  });

  it('update should modify an existing user', async () => {
    const newUser = await usersFactory.create({
      username: 'testuser',
      discordId: '123456789012345678',
    });
    const updatedUserData = { username: 'updateduser' };
    const updatedUser = await repository.update(newUser.id, updatedUserData);

    expect(updatedUser).toMatchObject({
      ...updatedUserData,
      id: newUser.id,
    });
  });

  it('remove should delete a user', async () => {
    const newUser = await usersFactory.create({
      username: 'testuser',
      discordId: '123456789012345678',
    });

    await repository.remove(newUser.id);
    const dbUser = await repository.findById(newUser.id);

    expect(dbUser).toBeUndefined();
  });
});
