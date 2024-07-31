const { SlashCommandBuilder } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current music queue'),
  async execute(interaction) {
    try {
      const queue = musicUtils.getQueue(interaction.guild);

      if (!queue) {
        return interaction.reply({
          content: 'There is no music playing in this server.',
        });
      }

      if (queue.songs.length === 0) {
        return interaction.reply({
          content: 'The queue is empty.',
        });
      }

      const queueContent = queue.songs
        .map((song, index) => `${index + 1}. ${song.title}`)
        .join('\n');

      interaction.reply({
        content: `**Queue:**\n${queueContent}`,
      });
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};