import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as schema from './schema';
import { parseUsername } from '@/modules/users/schema';
import { parseCode } from '@/modules/sprints/schema';
import { jsonRoute } from '@/middleware/jsonRoute';
import { Database } from '@/database';
import { MessageService } from './messageService';
import { client } from '@/bot';
import BotService from '@/bot/botService';

/**
 * Creates and configures routes for message-related operations.
 *
 * Provides endpoints for fetching all messages, fetching a single message by ID,
 * creating a new message, updating an existing message, deleting a message, and
 * sending a congratulatory message using the bot service.
 *
 * @param {Database} db - The database instance for accessing the message service.
 * @returns {Router} Configured router instance for message-related operations.
 */
const messagesController = (db: Database) => {
  const router = Router();
  const messageService = new MessageService(db);
  const botService = new BotService(client, db);

  router
    .route('/')
    .get(
      jsonRoute(async (req) => {
        const { username, sprint } = req.query;

        if (username) {
          const validatedUsername = parseUsername(username);
          return messageService.findByUsername(validatedUsername);
        }

        if (sprint) {
          const validatedSprint = parseCode(sprint);
          return messageService.findBySprintCode(validatedSprint);
        }

        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = parseInt(req.query.offset as string, 10) || 0;
        const records = await messageService.findAll(limit, offset);

        return records;
      })
    )
    .post(
      jsonRoute(async (req) => {
        const validatedData = schema.parseInsertable(req.body);
        const newMessage = await messageService.createMessage(validatedData);

        return newMessage;
      }, StatusCodes.CREATED)
    );

  router
    .route('/:id(\\d+)')
    .get(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        const message = await messageService.findById(validatedId);

        return message;
      })
    )
    .patch(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        const validatedData = schema.parseUpdateable(req.body);
        const updatedMessage = await messageService.updateMessage(
          validatedId,
          validatedData
        );

        return updatedMessage;
      }, StatusCodes.NO_CONTENT)
    )
    .delete(
      jsonRoute(async (req) => {
        const validatedId = schema.parseId(req.params.id);
        await messageService.removeMessage(validatedId);

        return {};
      }, StatusCodes.NO_CONTENT)
    );

  router.route('/send').post(
    jsonRoute(async (req) => {
      const { username, code } = req.body;
      const validatedUsername = parseUsername(username);
      const validatedCode = parseCode(code);
      const channelId: string = process.env.CHANNEL_ID || '';
      const apiKey: string = process.env.GIPHY_API_KEY || '';
      await botService.sendCongratulatoryMessage(
        validatedUsername,
        validatedCode,
        channelId,
        apiKey
      );

      return { message: 'Congratulatory message sent successfully.' };
    }, StatusCodes.OK)
  );

  return router;
};

export default messagesController;
