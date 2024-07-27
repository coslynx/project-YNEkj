const { Client, IntentsBitField, Collection } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const {
  PREFIX,
  DISCORD_TOKEN,
  DEFAULT_THUMBNAIL_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  GENIUS_ACCESS_TOKEN,
  YOUTUBE_API_KEY,
} = require('dotenv').config().parsed;
const ytdl = require('ytdl-core');
const SpotifyWebApi = require('spotify-web-api-node');
const Genius = require('genius-lyrics');
const { google } = require('googleapis');
const { queueCommand, lyricsCommand, playCommand, stopCommand, resumeCommand, skipCommand, pauseCommand, setControlChannelCommand } = require('./src/commands');
const { music } = require('./src/utils/music');
const { youtube } = require('./src/utils/youtube');
const { spotify } = require('./src/utils/spotify');
const { genius } = require('./src/utils/genius');

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_CLIENT_ID,
  clientSecret: SPOTIFY_CLIENT_SECRET,
});

// Initialize Genius API client
const geniusClient = new Genius.Client(GENIUS_ACCESS_TOKEN);

// Initialize YouTube API client
const youtubeClient = new google.youtube('v3');
youtubeClient.key = YOUTUBE_API_KEY;

// Command handler
const commands = new Collection();
client.commands = commands;

// Set up command handlers
commands.set('play', playCommand);
commands.set('pause', pauseCommand);
commands.set('resume', resumeCommand);
commands.set('skip', skipCommand);
commands.set('stop', stopCommand);
commands.set('queue', queueCommand);
commands.set('lyrics', lyricsCommand);
commands.set('setcontrolchannel', setControlChannelCommand);

client.on('ready', () => {
  console.log(`${client.user.tag} is ready!`);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      return interaction.reply({ content: 'Invalid command!', ephemeral: true });
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    await message.reply('There was an error while executing this command!');
  }
});

client.on('voiceStateUpdate', (oldState, newState) => {
  // If the bot is alone in the voice channel, disconnect
  if (newState.member.user.id === client.user.id && newState.channel && newState.channel.members.size === 1) {
    music.stop();
    newState.channel.leave();
  }
});

client.login(DISCORD_TOKEN);