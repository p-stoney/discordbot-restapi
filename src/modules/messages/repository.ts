import { Database } from '../../database';
import { baseRepository } from '../common/baseRepository';
import { InsertableMessageData } from './schema';

/**
 * Extends the baseRepository to provide message-specific data access methods.
 * @param {Database} db - The database connection instance.
 * @returns An object containing functions to interact with the messages table.
 */
export const messagesRepository = (db: Database) => {
  const repository = baseRepository(db, 'messages');

  return {
    ...repository,

    /**
     * Finds all messages associated with a user's userId.
     * @param {number} userId - The unique userId of a user.
     * @throws {MessageNotFound} If no messages are found.
     * @returns {Promise<Array>} A promise that resolves with the found messages.
     */
    findByUserId: async (userId: number) =>
      db
        .selectFrom('messages')
        .selectAll()
        .where('userId', '=', userId)
        .execute(),

    /**
     * Finds all messages associated with a sprint's sprintId.
     * @param {number} sprintId - The unique sprintId of a sprint.
     * @throws {MessageNotFound} If no messages are found.
     * @returns {Promise<Array>} A promise that resolves with the found messages.
    */
    findBySprintId: async (sprintId: number) =>
      db
        .selectFrom('messages')
        .selectAll()
        .where('sprintId', '=', sprintId)
        .execute(),

    /**
     * Creates a new message with the provided data.
     * @param {InsertableMessageData} messageData - The data to create a new message.
     * @returns {Promise<ReturnType<typeof repository.create>>} A promise resolved with the newly created message.
     * @throws {MessageNotFound} If the message with the specified id is not found.
     */
    create: async (messageData: InsertableMessageData) =>
      db
        .insertInto('messages')
        .values(messageData)
        .returningAll()
        .executeTakeFirst(),
  };
};

export default messagesRepository;
