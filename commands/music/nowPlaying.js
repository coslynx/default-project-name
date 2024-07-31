const { SlashCommandBuilder } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Display the currently playing track'),
  async execute(interaction) {
    try {
      const queue = musicUtils.getQueue(interaction.guild);

      if (!queue) {
        return interaction.reply({
          content: 'There is no music playing in this server.',
        });
      }

      const track = queue.player.playing;

      if (!track) {
        return interaction.reply({
          content: 'There is no music playing in this server.',
        });
      }

      const trackInfo = `Now playing: **${track.title}** by **${track.author}**`;
      const trackDuration = helper.formatTime(track.duration);
      const timeElapsed = helper.formatTime(queue.player.state.time);

      interaction.reply({
        content: `${trackInfo}\n\nTime elapsed: ${timeElapsed}/${trackDuration}`,
      });
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};