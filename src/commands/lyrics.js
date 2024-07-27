const { SlashCommandBuilder } = require('discord.js');
const { genius } = require('../../utils/genius');
const { music } = require('../../utils/music');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Fetches and displays lyrics for the currently playing song'),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
    }

    if (!music.isPlaying()) {
      return interaction.reply({ content: 'There is no song currently playing.', ephemeral: true });
    }

    try {
      const songTitle = music.getCurrentSongTitle();
      const lyrics = await genius.getLyrics(songTitle);

      if (!lyrics) {
        return interaction.reply({ content: 'Lyrics not found for this song.', ephemeral: true });
      }

      const embed = {
        title: `Lyrics for ${songTitle}`,
        description: lyrics,
        color: 0x0099ff,
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while fetching lyrics.', ephemeral: true });
    }
  },
};