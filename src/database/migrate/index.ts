import { Kysely, MigrationProvider, Migrator } from 'kysely';

/**
 * Migrates the database to the latest schema version based on the migration files.
 * @param {MigrationProvider} provider - The migration provider that supplies the migration files.
 * @param {Kysely<any>} db - The Kysely database instance.
 * @returns {Promise<{ results?: MigrationResult[]; error?: Error }>} The migration results or error.
 */
const migrateToLatest = async (
  provider: MigrationProvider,
  db: Kysely<any>
) => {
  const migrator = new Migrator({ db, provider });
  return migrator.migrateToLatest();
};

export { migrateToLatest };
