import { Database } from '@/database';
import { messagesRepository } from './repository';
import { MessageNotFound } from './errors';
import { InsertableMessageData, UpdateableMessageData } from './schema';

/**
 * Provides high-level operations for managing messages in the application,
 * including CRUD operations and business logic encapsulation.
 */
export class MessageService {
  private db: Database;

  private messagesRepo: ReturnType<typeof messagesRepository>;

  /**
   * Constructs a new MessageService instance with a database connection.
   *
   * @param {Database} db - The database connection instance.
   */
  constructor(db: Database) {
    this.db = db;
    this.messagesRepo = messagesRepository(db);
  }

  /**
   * Finds all messages with optional pagination.
   *
   * @param {number} limit - The maximum number of messages to return.
   * @param {number} offset - The number of messages to skip before starting to collect the result set.
   * @throws {MessageNotFound} If no messages are found.
   * @returns {Promise<Array>} A promise that resolves with the found messages.
   */
  async findAll(limit: number = 10, offset: number = 0) {
    const records = await this.messagesRepo.findAll(limit, offset);
    if (records.length === 0) {
      throw new MessageNotFound(`No messages found`);
    }
    return records;
  }

  /**
   * Finds a single message by its ID.
   *
   * @param {number} id - The unique ID of the message.
   * @throws {MessageNotFound} If the message with the specified ID is not found.
   * @returns {Promise<Object>} A promise that resolves with the found message.
   */
  async findById(id: number) {
    const message = await this.messagesRepo.findById(id);
    if (!message) {
      throw new MessageNotFound(`Message with ID ${id} not found`);
    }
    return message;
  }

  /**
   * Creates a new message.
   *
   * @param {InsertableMessageData} messageData - The data to create the message with.
   * @throws {MessageNotFound} If the message could not be created.
   * @returns {Promise<Object>} A promise that resolves with the newly created message.
   */
  async createMessage(messageData: InsertableMessageData) {
    const newMessage = await this.messagesRepo.create(messageData);
    if (!newMessage) {
      throw new MessageNotFound(`Failed to create new message`);
    }
    return newMessage;
  }

  /**
   * Updates an existing message by its ID.
   *
   * @param {number} id - The unique ID of the message to update.
   * @param {UpdateableMessageData} messageData - The data to update the message with.
   * @throws {MessageNotFound} If the message could not be updated.
   * @returns {Promise<Object>} A promise that resolves with the updated message.
   */
  async updateMessage(id: number, messageData: UpdateableMessageData) {
    const updatedMessage = await this.messagesRepo.update(id, messageData);
    if (!updatedMessage) {
      throw new MessageNotFound(`Failed to update message with ID ${id}`);
    }
    return updatedMessage;
  }

  /**
   * Removes a message by its ID.
   *
   * @param {number} id - The unique ID of the message to remove.
   * @returns {Promise<Object>} A promise that resolves to a confirmation of the deletion.
   */
  async removeMessage(id: number) {
    await this.messagesRepo.remove(id);
    return { message: `User with ID ${id} successfully deleted` };
  }
}
