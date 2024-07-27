const { SlashCommandBuilder } = require('discord.js');
const { music } = require('../../utils/music');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pauses the currently playing song'),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
    }

    if (!music.isPlaying()) {
      return interaction.reply({ content: 'There is no song currently playing.', ephemeral: true });
    }

    try {
      await music.pause();
      await interaction.reply({ content: 'Paused the song.' });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while pausing the song.', ephemeral: true });
    }
  },
};