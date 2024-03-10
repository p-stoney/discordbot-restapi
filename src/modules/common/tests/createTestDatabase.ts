import 'dotenv/config';
import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';
import { DB } from '@/database/types';
import ModuleMigrationProvider from '@/database/migrate/tests/ModuleMigrationProvider';
import { migrateToLatest } from '@/database/migrate';

export const DATABASE_FILE = ':memory:';

/**
 * Creates an in-memory database for testing purposes.
 * Applies all migrations using the ModuleMigrationProvider to prepare the database schema.
 * @returns {Promise<Kysely<DB>>} A Kysely database instance with migrations applied.
 */
export async function createTestDatabase() {
  const provider = new ModuleMigrationProvider();

  const database = new Kysely<DB>({
    dialect: new SqliteDialect({ database: new SQLite(DATABASE_FILE) }),
    plugins: [new CamelCasePlugin()],
  });

  const { results, error } = await migrateToLatest(provider, database);

  results
    ?.filter((result) => result.status === 'Error')
    .forEach((result) => {
      console.error(`failed to execute migration "${result.migrationName}"`);
    });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
  }

  return database;
}

export default createTestDatabase;
