import { FileMigrationProvider, Kysely, SqliteDialect, Migrator } from 'kysely';
import 'dotenv/config';
import path from 'path';
import fs from 'fs/promises';
import SQLite from 'better-sqlite3';
import { DB } from '../types';
import { migrateToLatest } from '.';

export const MIGRATIONS_PATH = '../migrations';

/**
 * Migrates the database to the latest version using the provided migration provider.
 * Logs the results of each migration attempt.
 * @param {Kysely<DB>} db - The Kysely database instance.
 * @param {FileMigrationProvider} nodeProvider - The migration provider to use for migration files.
 */
export const migrateDefault = async (
  db: Kysely<DB>,
  nodeProvider: FileMigrationProvider
) => {
  try {
    const { results, error } = await migrateToLatest(nodeProvider, db);

    results?.forEach((it) => {
      if (it.status === 'Success') {
        console.log(
          `Migration "${it.migrationName}" was executed successfully.`
        );
      } else if (it.status === 'Error') {
        console.error(`Failed to execute migration "${it.migrationName}".`);
      }
    });

    if (error) {
      console.error('Failed to migrate.');
      throw error instanceof Error ? error : new Error(String(error));
    }
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
};

/**
 * Reverts the last applied migration in the database.
 * Logs success or failure of the migration revert attempt.
 * @param {Kysely<DB>} db - The Kysely database instance.
 * @param {FileMigrationProvider} nodeProvider - The migration provider to use for migration files.
 */
export const revertLastMigration = async (
  db: Kysely<DB>,
  nodeProvider: FileMigrationProvider
) => {
  const migrator = new Migrator({ db, provider: nodeProvider });

  try {
    const { error, results } = await migrator.migrateDown();

    if (error) {
      console.error('Failed to revert the last migration:', error);
      throw error instanceof Error ? error : new Error(String(error));
    } else {
      console.log('Successfully reverted the last migration.');
      results?.forEach((result) => {
        console.log(`Reverted migration: ${result.migrationName}`);
      });
    }
  } catch (error) {
    console.error('Failed to revert the last migration:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
};

if (require.main === module) {
  const { DATABASE_URL } = process.env;

  if (!DATABASE_URL) {
    throw new Error('Provide DATABASE_URL in your environment variables.');
  }

  const db = new Kysely<DB>({
    dialect: new SqliteDialect({
      database: new SQLite(DATABASE_URL),
    }),
  });

  const nodeProvider = new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, MIGRATIONS_PATH),
  });

  const action = process.argv[2];
  if (action === 'down') {
    revertLastMigration(db, nodeProvider).catch(console.error);
  } else {
    migrateDefault(db, nodeProvider).catch(console.error);
  }
}
