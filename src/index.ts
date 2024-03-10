import 'dotenv/config';
import createApp from './app';
import createDatabase from './database';
import { initializeBot } from './bot';

/**
 * Initializes and starts the server.
 * Connects to the database, sets up the Express application, initializes the Discord bot (if token provided),
 * and starts listening on the specified port. Exits on failure to start.
 */
async function startServer() {
  const { DATABASE_URL, DISCORD_BOT_TOKEN } = process.env;
  const PORT = process.env.PORT || 3000;

  if (!DATABASE_URL) {
    throw new Error(
      'DATABASE_URL must be provided in your environment variables.'
    );
  }

  const db = createDatabase(DATABASE_URL);
  const app = createApp(db);

  if (DISCORD_BOT_TOKEN) {
    initializeBot(DISCORD_BOT_TOKEN);
  } else {
    console.warn('Discord bot token not provided.');
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start the server:', error);
  process.exit(1);
});
