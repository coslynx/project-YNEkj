const { music } = require('../../utils/music');

module.exports = {
  onVoiceStateUpdate: async (oldState, newState) => {
    // If the bot is alone in the voice channel, disconnect
    if (newState.member.user.id === newState.client.user.id && newState.channel && newState.channel.members.size === 1) {
      music.stop();
      newState.channel.leave();
    }
  },
};