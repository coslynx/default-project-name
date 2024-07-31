const { SlashCommandBuilder } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the music player and clear the queue'),
  async execute(interaction) {
    try {
      const queue = musicUtils.getQueue(interaction.guild);

      if (!queue) {
        return interaction.reply({
          content: 'There is no music playing in this server.',
        });
      }

      queue.player.stop();
      interaction.reply({
        content: 'Stopped the music player and cleared the queue.',
      });
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};