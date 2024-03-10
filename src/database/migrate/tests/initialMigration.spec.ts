import path from 'path';
import fs from 'fs/promises';
import { Kysely, FileMigrationProvider, Migrator } from 'kysely';
import createTestDatabase from '@/modules/common/tests/createTestDatabase';
import { DB } from '@/database/types';
import { MIGRATIONS_PATH } from '@/database/migrate/bin';

describe('Initial Migration', () => {
  let db: Kysely<DB>;
  let provider: FileMigrationProvider;

  beforeAll(async () => {
    db = await createTestDatabase();
    provider = new FileMigrationProvider({
      fs,
      path,
      migrationFolder: MIGRATIONS_PATH,
    });
    await db.deleteFrom('messages').execute();
    await db.deleteFrom('sprints').execute();
    await db.deleteFrom('templates').execute();
    await db.deleteFrom('users').execute();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should create the database schema on up migration', async () => {
    const migrator = new Migrator({ db, provider });
    const { results } = await migrator.migrateToLatest();

    results?.forEach((result) => {
      expect(result.status).toBe('Success');
    });

    const usersTable = await db.selectFrom('users').select('id').execute();

    expect(usersTable).toEqual([]);
  });

  it('should drop the database schema on down migration', async () => {
    const migrator = new Migrator({ db, provider });
    const { results } = await migrator.migrateDown();

    results?.forEach((result) => {
      expect(result.status).toBe('Success');
    });

    try {
      await db.selectFrom('users').select('id').execute();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
