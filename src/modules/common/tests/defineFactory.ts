import { Kysely, InsertObject, sql } from 'kysely';

type InsertedRecord = {
  id: number;
};

/**
 * Defines a generic factory function for creating and inserting records into a database table.
 * Allows setting default values for the record and overriding them as needed.
 * @template DB The database schema type.
 * @template TableName The name of the table in the database.
 * @template RowType The type of the row being inserted into the table.
 * @param {Kysely<DB>} db The Kysely database instance.
 * @param {TableName} table The name of the table to insert records into.
 * @param {InsertObject<DB, TableName>} defaultData Default values for the record.
 * @returns An object containing a 'create' method that inserts a record into the specified table.
 */
export function defineFactory<DB, TableName extends keyof DB & string, RowType>(
  db: Kysely<DB>,
  table: TableName,
  defaultData: InsertObject<DB, TableName>
) {
  return {
    create: async (overrides?: Partial<RowType>) => {
      const insertedData = { ...defaultData, ...overrides } as InsertObject<
        DB,
        TableName
      >;

      const newRecord = (await db
        .insertInto(table)
        .values(insertedData)
        .returning(() => [sql`id`.as('id')])
        .executeTakeFirstOrThrow()) as InsertedRecord;

      if (!newRecord) {
        throw new Error('Failed to create new record');
      }

      const fullRecord = (await db
        .selectFrom(table)
        .selectAll()
        .where(sql`id`, '=', newRecord.id)
        .executeTakeFirst()) as RowType & { id: number };

      if (!fullRecord) {
        throw new Error('Failed to fetch newly created record');
      }

      return fullRecord;
    },
  };
}
