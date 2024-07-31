const { SlashCommandBuilder } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Resume the currently paused music'),
  async execute(interaction) {
    try {
      const queue = musicUtils.getQueue(interaction.guild);

      if (!queue) {
        return interaction.reply({
          content: 'There is no music playing in this server.',
        });
      }

      if (!queue.player.paused) {
        return interaction.reply({
          content: 'The music player is already playing.',
        });
      }

      queue.player.resume();
      interaction.reply({
        content: 'Resumed the music player.',
      });
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};