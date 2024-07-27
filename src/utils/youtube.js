const { google } = require('googleapis');
const { YOUTUBE_API_KEY } = require('../config');

const youtube = google.youtube('v3');
youtube.key = YOUTUBE_API_KEY;

module.exports = {
  /**
   * Fetches video information from YouTube based on the provided URL or search query.
   *
   * @param {string} query The YouTube URL or search query.
   * @returns {Promise<object|null>} An object containing video information, or null if the video is not found.
   */
  async getVideoInfo(query) {
    try {
      let response;
      if (query.startsWith('https://www.youtube.com') || query.startsWith('https://youtu.be')) {
        // Extract video ID from URL
        const videoId = query.split('v=')[1] || query.split('/')[query.split('/').length - 1];
        response = await youtube.videos.list({
          part: 'snippet,contentDetails',
          id: videoId,
        });
      } else {
        // Search for video by query
        response = await youtube.search.list({
          part: 'snippet',
          q: query,
          type: 'video',
        });
      }

      if (response.data.items.length > 0) {
        const video = response.data.items[0];
        return {
          title: video.snippet.title,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          thumbnail: video.snippet.thumbnails.default.url,
          duration: video.contentDetails.duration,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching YouTube video information:', error);
      return null;
    }
  },
};