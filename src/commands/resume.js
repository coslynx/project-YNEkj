const { SlashCommandBuilder } = require('discord.js');
const { music } = require('../../utils/music');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resumes the currently paused song'),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
    }

    if (!music.isPaused()) {
      return interaction.reply({ content: 'The song is not paused.', ephemeral: true });
    }

    try {
      await music.resume();
      await interaction.reply({ content: 'Resumed the song.' });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while resuming the song.', ephemeral: true });
    }
  },
};