import { request } from 'undici';

/**
 * Fetches a random GIF URL from the Giphy API based on a given tag.
 *
 * This function constructs a request to the Giphy API's random endpoint, using the provided API key,
 * and attempts to fetch a random GIF URL tagged with 'celebration'. If the request is successful,
 * it returns the URL of the GIF. If the request fails, it logs an error and returns null.
 *
 * @param {string} apiKey - The Giphy API key to authenticate the request.
 * @returns {Promise<string | null>} A promise that resolves to the URL of a random celebration GIF,
 * or null if the request fails.
 */
export async function fetchRandomGif(apiKey: string): Promise<string | null> {
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=celebration&rating=g`;

  try {
    const response = await request(url);
    const json = (await response.body.json()) as { data: { url: string } };
    return json.data.url;
  } catch (error) {
    console.error('Failed to fetch random GIF:', error);
    return null;
  }
}
