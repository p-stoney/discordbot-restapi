import { Kysely } from 'kysely';
import { DB } from '@/database';

/**
 * Inserts predefined templates into the `templates` table.
 * @param {Kysely<DB>} db - The Kysely database instance.
 */
export async function up(db: Kysely<DB>) {
  const templates = [
    'Congratulations {user} for completing {sprint}!',
    'Great job {user} for completing {sprint}!',
    'Well done {user} on completing {sprint}!',
  ];
  templates.map((templateText) =>
    // @ts-ignore
    db
      .insertInto('templates')
      .values({
        template: templateText,
        is_active: '1',
      })
      .execute()
  );
}

/**
 * Removes all active templates from the `templates` table.
 * @param {Kysely<DB>} db - The Kysely database instance.
 */
export async function down(db: Kysely<DB>) {
  // @ts-ignore
  await db.deleteFrom('templates').where('is_active', '=', '1').execute();
}
