import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

export function initializeBot(token: string): void {
  client.once('ready', () => {
    console.log(`Bot ready! Logged in as ${client.user?.tag}`);
  });

  client.login(token);
}

export { client };
