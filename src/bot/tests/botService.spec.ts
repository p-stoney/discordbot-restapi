import { Client, TextChannel, GatewayIntentBits } from 'discord.js';
import BotService from '../botService';
import { UserService } from '@/modules/users/userService';
import { SprintService } from '@/modules/sprints/sprintService';
import { TemplateService } from '@/modules/templates/templateService';
import * as fetchRandomGifModule from '../utils/fetchRandomGif';
import { Database } from '@/database';

vi.mock('@/bot/utils/fetchRandomGif');
vi.mock('@/modules/users/userService');
vi.mock('@/modules/sprints/sprintService');
vi.mock('@/modules/templates/templateService');

function setupMocks() {
  vi.spyOn(fetchRandomGifModule, 'fetchRandomGif').mockResolvedValue(
    'http://example.com/gif'
  );
  vi.spyOn(UserService.prototype, 'findByName').mockResolvedValue({
    id: 1,
    username: 'testuser',
    discordId: '123456789012345678',
  });
  vi.spyOn(SprintService.prototype, 'findByCode').mockResolvedValue({
    id: 1,
    course: 'WD',
    module: 1,
    sprint: 1,
    code: 'WD-1.1',
    title: 'Sprint 1',
  });
  vi.spyOn(TemplateService.prototype, 'findRandomTemplate').mockResolvedValue({
    id: 1,
    template: 'Congratulations {user} for completing {sprint}!',
    isActive: '1',
  });
}

describe('BotService', () => {
  let mockClient: Client;

  beforeEach(() => {
    vi.clearAllMocks();

    mockClient = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    }) as unknown as Client;

    mockClient.channels.fetch = vi.fn().mockResolvedValue({
      send: vi.fn(),
      isTextBased: () => true,
    }) as any;

    setupMocks();
  });

  it('sends a message with the correct content to the specified channel', async () => {
    const botService = new BotService(mockClient, {} as Database);
    const username = 'testuser';
    const code = 'WD-1.1';
    const channelId = '123456789';
    const apiKey = 'dummy-api-key';

    await botService.sendCongratulatoryMessage(
      username,
      code,
      channelId,
      apiKey
    );
    const textChannel = (await mockClient.channels.fetch(
      channelId
    )) as TextChannel;
    expect(textChannel.send).toHaveBeenCalledTimes(2);
    expect(textChannel.send).toHaveBeenCalledWith(
      expect.stringContaining(
        'Congratulations testuser for completing Sprint 1!'
      ) && expect.stringContaining('http://example.com/gif')
    );
  });
});

describe('BotService - Error Handling', () => {
  let mockClient: Client;

  beforeEach(() => {
    vi.clearAllMocks();

    mockClient = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    }) as unknown as Client;

    mockClient.channels.fetch = vi.fn().mockResolvedValue({
      send: vi.fn(),
      isTextBased: () => true,
    }) as any;
  });

  it('does not send a message if the user is not found', async () => {
    const channelId = '123456789';
    vi.spyOn(UserService.prototype, 'findByName').mockResolvedValue({
      id: 0,
      username: '',
      discordId: '',
    });

    const textChannel = (await mockClient.channels.fetch(
      channelId
    )) as TextChannel;
    expect(textChannel.send).not.toHaveBeenCalled();
  });

  it('does not send a message if the sprint is not found', async () => {
    const channelId = '123456789';

    vi.spyOn(SprintService.prototype, 'findByCode').mockResolvedValue({
      id: 0,
      course: '',
      module: 0,
      sprint: 0,
      code: '',
      title: '',
    });

    const textChannel = (await mockClient.channels.fetch(
      channelId
    )) as TextChannel;
    expect(textChannel.send).not.toHaveBeenCalled();
  });
});

describe('BotService - Discord Error Handling', () => {
  let mockClient: Client;

  beforeEach(() => {
    vi.clearAllMocks();

    mockClient = new Client({
      intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    }) as unknown as Client;
  });

  it('does not send a message if the Discord channel is not found', async () => {
    const botService = new BotService(mockClient, {} as Database);
    const username = 'testuser';
    const code = 'WD-1.1';
    const channelId = 'nonexistentChannel';
    const apiKey = 'dummy-api-key';

    mockClient.channels.fetch = vi.fn().mockResolvedValue(null);

    setupMocks();

    await botService.sendCongratulatoryMessage(
      username,
      code,
      channelId,
      apiKey
    );

    expect(mockClient.channels.fetch).toHaveBeenCalledWith(channelId);
  });

  it('does not send a message if the Discord channel is not text-based', async () => {
    const botService = new BotService(mockClient, {} as Database);
    const username = 'testuser';
    const code = 'WD-1.1';
    const channelId = 'notTextBasedChannel';
    const apiKey = 'dummy-api-key';

    mockClient.channels.fetch = vi.fn().mockResolvedValue({
      send: vi.fn(),
      isTextBased: () => false,
    });

    setupMocks();

    await botService.sendCongratulatoryMessage(
      username,
      code,
      channelId,
      apiKey
    );

    const textChannel = (await mockClient.channels.fetch(
      channelId
    )) as TextChannel;
    expect(textChannel.send).not.toHaveBeenCalled();
  });
});
