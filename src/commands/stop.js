const { SlashCommandBuilder } = require('discord.js');
const { music } = require('../../utils/music');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops the music and disconnects the bot'),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
    }

    try {
      await music.stop();
      await interaction.reply({ content: 'Stopped the music.' });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while stopping the music.', ephemeral: true });
    }
  },
};