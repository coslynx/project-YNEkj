const SpotifyWebApi = require('spotify-web-api-node');
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = require('../config');

const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
});

module.exports = {
  /**
   * Fetches song information from Spotify based on the provided URL or search query.
   *
   * @param {string} query The Spotify URL or search query.
   * @returns {Promise<object|null>} An object containing song information, or null if the song is not found.
   */
  async getSongInfo(query) {
    try {
      let response;
      if (query.startsWith('https://open.spotify.com/track')) {
        // Extract track ID from URL
        const trackId = query.split('/track/')[1].split('?')[0];
        response = await spotifyApi.getTrack(trackId);
      } else {
        // Search for track by query
        response = await spotifyApi.searchTracks(query);
      }

      if (response.body.tracks.items.length > 0) {
        const track = response.body.tracks.items[0];
        return {
          title: track.name,
          url: track.external_urls.spotify,
          thumbnail: track.album.images[0].url,
          artists: track.artists.map((artist) => artist.name).join(', '),
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching Spotify song information:', error);
      return null;
    }
  },
};