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
