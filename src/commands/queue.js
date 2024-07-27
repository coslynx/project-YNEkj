const { SlashCommandBuilder } = require('discord.js');
const { music } = require('../../utils/music');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Displays the current music queue'),
  async execute(interaction) {
    if (!interaction.member.voice.channel) {
      return interaction.reply({ content: 'You must be in a voice channel to use this command.', ephemeral: true });
    }

    const queue = music.getQueue();

    if (!queue || queue.length === 0) {
      return interaction.reply({ content: 'There are no songs in the queue.', ephemeral: true });
    }

    const embed = {
      title: 'Music Queue',
      description: queue.map((song, index) => `${index + 1}. ${song.title}`).join('\n'),
      color: 0x0099ff,
    };

    await interaction.reply({ embeds: [embed] });
  },
};