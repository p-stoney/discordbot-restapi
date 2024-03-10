import 'dotenv/config';
import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import SQLite from 'better-sqlite3';
import { DB } from './types';

export type Database = Kysely<DB>;
export type DatabasePartial<T> = Kysely<T>;
export * from './types';

/**
 * Creates and configures a Kysely database instance.
 * @param {string} url - The path to the SQLite database file.
 * @param {Object} options - Optional configuration settings.
 * @param {boolean} options.readonly - Determines if the database should be opened in readonly mode.
 * @returns {Database} A Kysely database instance configured for the application.
 */
const createDatabase = (url: string, { readonly = false } = {}): Database =>
  new Kysely<DB>({
    dialect: new SqliteDialect({
      database: new SQLite(url, { readonly }),
    }),
    plugins: [new CamelCasePlugin()],
  });

export default createDatabase;
