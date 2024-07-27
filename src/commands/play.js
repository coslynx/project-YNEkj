const { SlashCommandBuilder } = require('discord.js');
const { music } = require('../../utils/music');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song from YouTube or Spotify')
    .addStringOption((option) =>
      option.setName('query').setDescription('The song URL or search query').setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
    }

    const query = interaction.options.getString('query');

    try {
      await music.play(interaction, query);
      await interaction.reply({ content: `Playing ${query}` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while playing the song.', ephemeral: true });
    }
  },
};