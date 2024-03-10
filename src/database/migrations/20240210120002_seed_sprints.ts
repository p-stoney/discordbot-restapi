import { Kysely } from 'kysely';
import { DB } from '@/database';

/**
 * Inserts predefined sprints into the `sprints` table.
 * @param {Kysely<DB>} db - The Kysely database instance.
 */
export async function up(db: Kysely<DB>) {
  const courses = ['DA', 'DE', 'DM', 'DS', 'WD'];
  const modules = [1, 2, 3, 4];
  const sprints = [4];

  courses.flatMap((course) =>
    modules.flatMap((module) =>
      sprints.map((sprint) => {
        const code = `${course}-${module}.${sprint}`;
        const title = `${course} Module ${module} Sprint ${sprint}`;
        return db
          .insertInto('sprints')
          .values({ course, module, sprint, code, title } as any)
          .execute();
      })
    )
  );
}

/**
 * Removes all entries from the `sprints` table.
 * @param {Kysely<DB>} db - The Kysely database instance.
 */
export async function down(db: Kysely<DB>) {
  await db.deleteFrom('sprints').execute();
}
