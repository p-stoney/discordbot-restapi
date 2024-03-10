import { Client } from 'discord.js';
import { Database } from '@/database';
import { UserService } from '@/modules/users/userService';
import { SprintService } from '@/modules/sprints/sprintService';
import { TemplateService } from '@/modules/templates/templateService';
import { MessageService } from '@/modules/messages/messageService';
import { fetchRandomGif } from '@/bot/utils/fetchRandomGif';
import type { InsertableMessageData } from '@/modules/messages/schema';

/**
 * Service for interacting with Discord for sending messages and handling bot functionality.
 */
class BotService {
  private client: Client;

  private db: Database;

  private userService: UserService;

  private sprintService: SprintService;

  private templateService: TemplateService;

  private messageService: MessageService;

  /**
   * Constructs the BotService with necessary services and database.
   * @param {Client} client - The Discord client.
   * @param {Database} db - The database connection.
   */
  constructor(client: Client, db: Database) {
    this.client = client;
    this.db = db;
    this.userService = new UserService(db);
    this.sprintService = new SprintService(db);
    this.templateService = new TemplateService(db);
    this.messageService = new MessageService(db);
  }

  /**
   * Sends a congratulatory message to a specified Discord channel.
   * @param {string} username - The username to congratulate.
   * @param {string} code - The code identifying the sprint.
   * @param {string} channelId - The Discord channel ID to send the message to.
   * @param {string} apiKey - The API key for external services, like Giphy.
   * @returns {Promise<void>} A promise that resolves when the message is sent, or logs an error.
   */
  async sendCongratulatoryMessage(
    username: string,
    code: string,
    channelId: string,
    apiKey: string
  ): Promise<void> {
    try {
      const user = await this.userService.findByName(username);
      const sprint = await this.sprintService.findByCode(code);
      const template = await this.templateService.findRandomTemplate();

      if (!user || !sprint || !template)
        throw new Error('One or more resources not found.');

      const url = await fetchRandomGif(apiKey);
      if (!url) throw new Error('Failed to fetch GIF URL.');

      const messageContent = template.template
        .replace('{user}', `<@${user.discordId}>`)
        .replace('{sprint}', sprint.title);
      await this.sendMessageToChannel(channelId, messageContent, url);

      await this.persistMessage(user.id, sprint.id, messageContent, url, 200);
    } catch (error) {
      console.error('Failed to send congratulatory message:', error);
    }
  }

  /**
   * Sends a message to a specified Discord channel.
   * @param {string} channelId - The Discord channel ID.
   * @param {string} message - The message content to send.
   * @param {string} gifUrl - The URL of a GIF to send after the message.
   * @returns {Promise<void>} A promise that resolves when the messages are sent.
   */
  private async sendMessageToChannel(
    channelId: string,
    message: string,
    gif_url: string
  ): Promise<void> {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      console.error(
        `The channel with ID ${channelId} was not found or is not text-based.`
      );
      return;
    }

    await channel.send(message);
    await channel.send(gif_url);
  }

  /**
   * Persists the message details to the database.
   * @param {number} userId - The ID of the user to associate the message with.
   * @param {number} sprintId - The ID of the sprint to associate the message with.
   * @param {string} message - The message content.
   * @param {string} gifUrl - The URL of the GIF associated with the message.
   * @param {number} status - The status code of the message sending operation.
   * @returns {Promise<void>} A promise that resolves when the message is saved.
   */
  private async persistMessage(
    userId: number,
    sprintId: number,
    message: string,
    gifUrl: string,
    status: number
  ): Promise<void> {
    const messageData: InsertableMessageData = {
      userId,
      sprintId,
      message,
      gifUrl,
      status,
    };

    const savedMessage = await this.messageService.createMessage(messageData);
    if (!savedMessage) {
      console.error('Failed to save message to database.');
    }
  }
}

export default BotService;
