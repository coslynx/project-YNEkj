const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const { youtube } = require('./youtube');

const queue = [];
let connection;
let player;

let isPlaying = false;
let isPaused = false;
let currentSong;

module.exports = {
  /**
   * Plays a song from YouTube or Spotify.
   *
   * @param {import('discord.js').Interaction} interaction The Discord interaction object.
   * @param {string} query The song URL or search query.
   */
  async play(interaction, query) {
    try {
      // Get the user's voice channel.
      const voiceChannel = interaction.member.voice.channel;

      // Join the voice channel if not already connected.
      if (!connection) {
        connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: interaction.guild.id,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
      }

      // Create a new audio player if one doesn't exist.
      if (!player) {
        player = createAudioPlayer({
          behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
          },
        });
      }

      // Fetch song information from YouTube or Spotify.
      let song;
      if (query.startsWith('https://www.youtube.com') || query.startsWith('https://youtu.be')) {
        song = await youtube.getVideoInfo(query);
      } 

      // Add the song to the queue.
      queue.push(song);

      // Start playback if not already playing.
      if (!isPlaying) {
        this.playNextSong();
      }

      // Listen for the player's finish event.
      player.on(AudioPlayerStatus.Idle, () => {
        this.playNextSong();
      });

      // Subscribe the player to the voice connection.
      connection.subscribe(player);

      // Handle player errors.
      player.on('error', (error) => {
        console.error('Player error:', error);
        interaction.reply({ content: 'There was an error playing the song.', ephemeral: true });
      });
    } catch (error) {
      console.error('Error playing song:', error);
      interaction.reply({ content: 'There was an error playing the song.', ephemeral: true });
    }
  },

  /**
   * Plays the next song in the queue.
   */
  async playNextSong() {
    // If the queue is empty, stop playback.
    if (queue.length === 0) {
      this.stop();
      return;
    }

    // Get the next song from the queue.
    currentSong = queue.shift();

    // Fetch the audio stream.
    const stream = ytdl(currentSong.url, { filter: 'audioonly', quality: 'highestaudio' });

    // Create an audio resource from the stream.
    const resource = createAudioResource(stream, { inlineVolume: true, inputType: StreamType.Opus });

    // Play the song.
    player.play(resource);

    // Set playing state to true.
    isPlaying = true;
    isPaused = false;
  },

  /**
   * Pauses the currently playing song.
   */
  async pause() {
    if (isPlaying && !isPaused) {
      player.pause();
      isPaused = true;
    }
  },

  /**
   * Resumes the paused song.
   */
  async resume() {
    if (isPaused) {
      player.unpause();
      isPaused = false;
    }
  },

  /**
   * Skips the current song and plays the next song.
   */
  async skip() {
    player.stop();
  },

  /**
   * Stops the music and disconnects the bot from the voice channel.
   */
  async stop() {
    if (connection) {
      connection.disconnect();
      connection = null;
      player = null;
      isPlaying = false;
      isPaused = false;
      queue.length = 0;
      currentSong = null;
    }
  },

  /**
   * Returns true if the bot is currently playing music.
   *
   * @returns {boolean} True if playing, false otherwise.
   */
  isPlaying() {
    return isPlaying;
  },

  /**
   * Returns true if the bot is currently paused.
   *
   * @returns {boolean} True if paused, false otherwise.
   */
  isPaused() {
    return isPaused;
  },

  /**
   * Returns the title of the currently playing song.
   *
   * @returns {string|null} The song title, or null if no song is playing.
   */
  getCurrentSongTitle() {
    return currentSong ? currentSong.title : null;
  },

  /**
   * Returns the music queue.
   *
   * @returns {Array<object>} The music queue.
   */
  getQueue() {
    return queue;
  },
};