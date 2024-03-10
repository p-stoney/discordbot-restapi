import { setGlobalDispatcher, MockAgent } from 'undici';
import { fetchRandomGif } from '../utils/fetchRandomGif';

describe('fetchRandomGif', () => {
  let mockAgent: MockAgent;

  beforeEach(() => {
    mockAgent = new MockAgent();
    mockAgent.disableNetConnect();
    setGlobalDispatcher(mockAgent);
  });

  it('returns a URL when the request is successful', async () => {
    const mockClient = mockAgent.get('https://api.giphy.com');
    const expectedUrl = 'http://example.com/gif';

    // Use a function for dynamic URL matching
    mockClient
      .intercept({
        path: (path) => path.startsWith('/v1/gifs/random'),
        method: 'GET',
      })
      .reply(200, { data: { url: expectedUrl } });

    const url = await fetchRandomGif('dummy-api-key');
    expect(url).toBe(expectedUrl);
  });

  it('returns null when the request fails', async () => {
    const apiKey = 'test-api-key';

    const client = mockAgent.get('https://api.giphy.com');
    client
      .intercept({
        path: '/v1/gifs/random',
        method: 'GET',
      })
      .reply(404, { message: 'Not Found' });

    const url = await fetchRandomGif(apiKey);

    expect(url).toBeNull();
  });
});
