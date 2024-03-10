import { Kysely } from 'kysely';
import { DB } from '@/database';

/**
 * Inserts predefined users into the `users` table.
 * @param {Kysely<DB>} db - The Kysely database instance.
 */
export async function up(db: Kysely<DB>) {
  db.insertInto('users')
    .values({ username: 'pstone', discordId: '579742104050335755' })
    .execute();
}

/**
 * Removes the seeded users from the `users` table.
 * @param {Kysely<DB>} db - The Kysely database instance.
 */
export async function down(db: Kysely<DB>) {
  await db
    .deleteFrom('users')
    .where('discordId', '=', '579742104050335755')
    .execute();
}
