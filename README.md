# Harmony Discord Music Bot

This is a comprehensive Discord music bot designed to enhance music playback on your servers. Harmony offers a user-friendly experience with features like:

- **Music Playback:** Request songs from YouTube or Spotify.
- **Playback Control:** Pause, resume, skip, and stop music.
- **Music Queue:** View and manage the upcoming songs.
- **Song Information:** See thumbnails, titles, and progress bars.
- **Lyrics Retrieval:** Fetch lyrics from Genius for the current song.
- **Centralized Control:** Manage music in a dedicated control channel.
- **Customization:** Configure command prefix and default thumbnail.

## Getting Started

1. **Create a Discord Bot:**
   - Visit the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
   - Add a bot to your application and copy the bot token.

2. **Invite the Bot to Your Server:**
   - Generate an OAuth2 URL with the necessary permissions.
   - Invite the bot to your server using the generated URL.

3. **Environment Variables:**
   - Create a `.env` file to store bot configuration.
   - Set variables like:
     - `DISCORD_TOKEN` (your bot token)
     - `PREFIX` (optional, default "!")
     - `DEFAULT_THUMBNAIL_URL` (optional, default GIF)
     - `SPOTIFY_CLIENT_ID`
     - `SPOTIFY_CLIENT_SECRET`
     - `GENIUS_ACCESS_TOKEN`
     - `YOUTUBE_API_KEY`

4. **Running the Bot:**
   - Ensure Node.js is installed.
   - Install dependencies: `npm install`
   - Run the bot script: `npm start`

## Commands

- **`!play <URL or search query>` or `/play <URL or search query>`:**
  - Plays a song from the provided URL (YouTube or Spotify).
  - Alternatively, searches for the video on YouTube.
  - Supports playlists, adding all songs to the queue.
  - Creates a new queue if there is no existing queue.

- **`!pause` or `/pause`:**
  - Pauses the currently playing song.

- **`!resume` or `/resume`:**
  - Resumes the paused song.

- **`!skip` or `/skip`:**
  - Skips the current song and stops playback.

- **`!stop` or `/stop`:**
  - Stops the music and disconnects the bot from the voice channel.

- **`!queue` or `/queue`:**
  - Displays the current music queue in the control channel.

- **`!setcontrolchannel <#channel>` or `/setcontrolchannel <#channel>`:**
  - (Admin only) Sets the specified channel as the control center channel.

- **`!lyrics` or `/lyrics`:**
  - Fetches and displays lyrics from Genius.

## Interactive Buttons

- **Play:** Starts playing the next song in the queue.
- **Pause:** Pauses the currently playing song.
- **Stop:** Stops the music and disconnects the bot.
- **Skip:** Skips the current song.
- **Lyrics:** Fetches and displays lyrics from Genius.

## Contributing

Contributions are welcome! Feel free to submit issues, feature requests, or pull requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.