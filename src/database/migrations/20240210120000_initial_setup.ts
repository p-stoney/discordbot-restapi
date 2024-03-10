import { Kysely, sql } from 'kysely';
import { type DB } from '@/database';

/**
 * Migration script for setting up the initial database structure.
 * It defines the schema for users, sprints, templates, and messages tables.
 * @param {Kysely<DB>} db - The Kysely database instance.
 */
export async function up(db: Kysely<DB>) {
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('username', 'text', (col) => col.unique().notNull())
    .addColumn('discord_id', 'text', (col) => col.unique().notNull())
    .execute();

  await db.schema
    .createTable('sprints')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('course', 'text', (col) => col.notNull())
    .addColumn('module', 'integer', (col) => col.notNull())
    .addColumn('sprint', 'integer', (col) => col.notNull())
    .addColumn('code', 'text', (col) => col.unique().notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('templates')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('template', 'text', (col) => col.notNull())
    .addColumn('is_active', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('messages')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').notNull()
    )
    .addColumn('sprint_id', 'integer', (col) =>
      col.references('sprints.id').notNull()
    )
    .addColumn('timestamp', 'datetime', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn('status', 'integer', (col) => col.notNull())
    .addColumn('gif_url', 'text', (col) => col.notNull())
    .addColumn('message', 'text', (col) => col.notNull())
    .execute();
}

/**
 * Reverts the migration, dropping the tables created by the `up` function.
 * @param {Kysely<DB>} db - The Kysely database instance.
 */
export async function down(db: Kysely<DB>) {
  await db.schema.dropTable('messages').ifExists().execute();
  await db.schema.dropTable('templates').ifExists().execute();
  await db.schema.dropTable('sprints').ifExists().execute();
  await db.schema.dropTable('users').ifExists().execute();
}
