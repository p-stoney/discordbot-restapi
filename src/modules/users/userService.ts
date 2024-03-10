import { Database } from '@/database';
import { usersRepository } from './repository';
import { UserNotFound } from './errors';
import type { InsertableUserData, UpdateableUserData } from './schema';

/**
 * Provides high-level operations for managing users in the application,
 * including CRUD operations and business logic encapsulation.
 */
export class UserService {
  private db: Database;

  private usersRepo: ReturnType<typeof usersRepository>;

  /**
   * Constructs a new UserService instance with a database connection.
   *
   * @param {Database} db - The database connection instance.
   */
  constructor(db: Database) {
    this.db = db;
    this.usersRepo = usersRepository(db);
  }

  /**
   * Finds all users with optional pagination.
   *
   * @param {number} limit - The maximum number of users to return.
   * @param {number} offset - The number of users to skip before starting to collect the result set.
   * @throws {UserNotFound} If no users are found.
   * @returns {Promise<Array>} A promise that resolves with the found users.
   */
  async findAll(limit: number = 10, offset: number = 0) {
    const records = await this.usersRepo.findAll(limit, offset);
    if (records.length === 0) {
      throw new UserNotFound(`No users found`);
    }
    return records;
  }

  /**
   * Finds a single user by their username.
   *
   * @param {string} username - The unique username of the user.
   * @throws {UserNotFound} If the user with the specified username is not found.
   * @returns {Promise<Object>} A promise that resolves with the found user.
   */
  async findByName(username: string) {
    const user = await this.usersRepo.findByName(username);
    if (!user) {
      throw new UserNotFound(`User not found: ${username}`);
    }
    return user;
  }

  /**
   * Finds a single user by their ID.
   *
   * @param {number} id - The unique ID of the user.
   * @throws {UserNotFound} If the user with the specified ID is not found.
   * @returns {Promise<Object>} A promise that resolves with the found user.
   */
  async findById(id: number) {
    const user = await this.usersRepo.findById(id);
    if (!user) {
      throw new UserNotFound(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Finds a single user by their Discord ID.
   *
   * @param {string} discordId - The unique Discord ID of the user.
   * @throws {UserNotFound} If the user with the specified Discord ID is not found.
   * @returns {Promise<Object>} A promise that resolves with the found user.
   */
  async findBydiscordId(discordId: string) {
    const user = await this.usersRepo.findBydiscordId(discordId);
    if (!user) {
      throw new UserNotFound(`User with Discord ID ${discordId} not found`);
    }
    return user;
  }

  /**
   * Creates a new user.
   *
   * @param {InsertableUserData} userData - The data to create the user with.
   * @throws {UserNotFound} If the user could not be created.
   * @returns {Promise<Object>} A promise that resolves with the newly created user.
   */
  async createUser(userData: InsertableUserData) {
    const newUser = await this.usersRepo.create(userData);
    if (!newUser) {
      throw new UserNotFound(`Failed to create new user`);
    }
    return newUser;
  }

  /**
   * Updates an existing user by their ID.
   *
   * @param {number} id - The unique ID of the user to update.
   * @param {UpdateableUserData} userData - The data to update the user with.
   * @throws {UserNotFound} If the user could not be updated.
   * @returns {Promise<Object>} A promise that resolves with the updated user.
   */
  async updateUser(id: number, userData: UpdateableUserData) {
    const updatedUser = await this.usersRepo.update(id, userData);
    if (!updatedUser) {
      throw new UserNotFound(`Failed to update user with ID ${id}`);
    }
    return updatedUser;
  }

  /**
   * Removes a user by their ID.
   *
   * @param {number} id - The unique ID of the user to remove.
   * @returns {Promise<Object>} A promise that resolves to a confirmation of the deletion.
   */
  async removeUser(id: number) {
    await this.usersRepo.remove(id);
    return { message: `User with ID ${id} successfully deleted` };
  }
}
