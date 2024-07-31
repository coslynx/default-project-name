const { SlashCommandBuilder } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),
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

      queue.player.stop();
      interaction.reply({
        content: `Skipped ${track.title}`,
      });
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};