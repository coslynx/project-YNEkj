const Genius = require('genius-lyrics');
const { GENIUS_ACCESS_TOKEN } = require('../config');

const genius = new Genius.Client(GENIUS_ACCESS_TOKEN);

module.exports = {
  /**
   * Fetches lyrics for the given song title from Genius.
   *
   * @param {string} songTitle The title of the song to retrieve lyrics for.
   * @returns {Promise<string|null>} The lyrics for the song, or null if lyrics are not found.
   */
  async getLyrics(songTitle) {
    try {
      const searchResults = await genius.search(songTitle);
      if (searchResults.hits.length > 0) {
        const song = searchResults.hits[0].result;
        const lyrics = await genius.getLyrics(song.id);
        return lyrics;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching lyrics for ${songTitle}:`, error);
      return null;
    }
  },
};