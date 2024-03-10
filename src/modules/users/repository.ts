import { Database } from '../../database';
import { baseRepository } from '../common/baseRepository';
import { InsertableUserData } from './schema';

/**
 * Extends the baseRepository to provide user-specific data access methods.
 * @param {Database} db - The database connection instance.
 * @returns An object containing functions to interact with the users table.
 */
export const usersRepository = (db: Database) => {
  const repository = baseRepository(db, 'users');

  return {
    ...repository,

    /**
     * Creates a new user with the provided data.
     * @param {InsertableUserData} userData - The data to create a new user.
     * @returns {Promise<ReturnType<typeof repository.create>>} A promise resolved with the newly created user.
     * @throws {UserNotFound} If the user with the specified username is not found.
     */
    create: async (userData: InsertableUserData) =>
      db.insertInto('users').values(userData).returningAll().executeTakeFirst(),

    /**
     * Finds a user by their username.
     * @param {string} username - The unique username of the user.
     * @returns {Promise<ReturnType<typeof repository.findByName>>} A promise resolved with the found user.
     * @throws {UserNotFound} If the user with the specified username is not found.
     */
    findByName: async (username: string) =>
      db
        .selectFrom('users')
        .selectAll()
        .where('username', '=', username)
        .executeTakeFirst(),

    /**
     * Finds a user by their Discord ID.
     * @param {string} discordId - The unique Discord ID of the user.
     * @returns {Promise<ReturnType<typeof repository.findBydiscordId>>} A promise resolved with the found user.
     * @throws {UserNotFound} If the user with the specified Discord ID is not found.
     */
    findBydiscordId: async (discordId: string) =>
      db
        .selectFrom('users')
        .selectAll()
        .where('discordId', '=', discordId)
        .executeTakeFirst(),
  };
};

export default usersRepository;
