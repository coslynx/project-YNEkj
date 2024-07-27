const { SlashCommandBuilder } = require('discord.js');
const { PREFIX } = require('../../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setcontrolchannel')
    .setDescription('Sets the control channel for music requests and playback')
    .addChannelOption((option) =>
      option.setName('channel').setDescription('The channel to set as control').setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const controlChannel = interaction.options.getChannel('channel');

    // Assuming you have a global variable to store the control channel
    global.controlChannel = controlChannel;

    await interaction.reply({ content: `Control channel set to ${controlChannel}`, ephemeral: true });
  },
};