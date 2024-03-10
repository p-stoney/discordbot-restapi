import {
  Insertable,
  Selectable,
  Updateable,
  ExpressionOrFactory,
  SqlBool,
} from 'kysely';
import { DB } from '../../database/types';
import { Database } from '../../database/index';

/**
 * Creates a base repository with common CRUD operations for a given table.
 *
 * @param {Database} db - The database connection instance.
 * @param {keyof DB} table - The table name to create the repository for.
 * @returns An object containing functions to interact with the database.
 */
export const baseRepository = (db: Database, table: keyof DB) => {
  type Table = typeof table;
  type Row = DB[Table];
  type RowWithoutId = Omit<Row, 'id'>;
  type RowSelect = Selectable<Row>;
  type RowInsert = Insertable<RowWithoutId>;
  type RowUpdate = Updateable<RowWithoutId>;

  return {
    /**
     * Finds rows based on the given SQL expression.
     * @param {ExpressionOrFactory<DB, Table, SqlBool>} expression - The condition to filter rows.
     * @returns {Promise<RowSelect[]>} A promise resolved with the found rows.
     */
    find: async (
      expression: ExpressionOrFactory<DB, Table, SqlBool>
    ): Promise<RowSelect[]> =>
      db.selectFrom(table).selectAll().where(expression).execute(),

    /**
     * Finds all rows with optional pagination.
     * @param {number} limit - The maximum number of rows to return.
     * @param {number} offset - The number of rows to skip before starting to collect the result set.
     * @returns {Promise<RowSelect[]>} A promise resolved with the found rows.
     */
    findAll: async (limit = 10, offset = 0): Promise<RowSelect[]> =>
      db.selectFrom(table).selectAll().limit(limit).offset(offset).execute(),

    /**
     * Finds a single row by its ID.
     * @param {number} id - The unique ID of the row.
     * @returns {Promise<RowSelect | undefined>} A promise resolved with the found row, or undefined if not found.
     */
    findById: async (id: number): Promise<RowSelect | undefined> =>
      db.selectFrom(table).selectAll().where('id', '=', id).executeTakeFirst(),

    /**
     * Finds rows by their IDs.
     * @param {number[]} ids - The unique IDs of the rows.
     * @returns {Promise<RowSelect[]>} A promise resolved with the found rows.
     */
    findByIds: async (ids: number[]): Promise<RowSelect[]> =>
      db.selectFrom(table).selectAll().where('id', 'in', ids).execute(),

    /**
     * Creates a new row.
     * @param {RowInsert} record - The data to insert into the table.
     * @returns {Promise<RowSelect | undefined>} A promise resolved with the newly created row, or undefined if not created.
     * @throws {Error} If the row could not be created.
     * @throws {ValidationError} If the data to insert is invalid.
     * @throws {UniqueViolationError} If the data to insert violates a unique constraint.
     */
    create: async (record: RowInsert): Promise<RowSelect | undefined> => {
      const result = await db
        .insertInto(table)
        .values(record)
        .returningAll()
        .executeTakeFirst();
      return result;
    },

    /**
     * Updates an existing row.
     * @param {number} id - The unique ID of the row to update.
     * @param {RowUpdate} partial - The partial data to update the row with.
     * @returns {Promise<RowSelect | undefined>} A promise resolved with the updated row, or undefined if not found.
     * @throws {Error} If the row could not be updated.
     * @throws {ValidationError} If the data to update is invalid.
     * @throws {UniqueViolationError} If the data to update violates a unique constraint.
     */
    update: async (
      id: number,
      partial: RowUpdate
    ): Promise<RowSelect | undefined> => {
      const result = await db
        .updateTable(table)
        .set(partial)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
      return result;
    },

    /**
     * Removes a row by its ID.
     * @param {number} id - The unique ID of the row to remove.
     * @throws {Error} If the row could not be removed.
     */
    remove: async (id: number): Promise<void> => {
      await db.deleteFrom(table).where('id', '=', id).execute();
    },
  };
};

export default baseRepository;
