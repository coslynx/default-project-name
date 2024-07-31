const { SlashCommandBuilder } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Set the volume of the music player')
    .addNumberOption((option) =>
      option
        .setName('volume')
        .setDescription('The volume to set (0.0 to 1.0)')
        .setRequired(true)
    ),
  async execute(interaction) {
    const volume = interaction.options.getNumber('volume');

    if (volume < 0.0 || volume > 1.0) {
      return interaction.reply({
        content: 'Invalid volume. Please enter a value between 0.0 and 1.0.',
      });
    }

    try {
      const queue = musicUtils.getQueue(interaction.guild);

      if (!queue) {
        return interaction.reply({
          content: 'There is no music playing in this server.',
        });
      }

      queue.player.setVolume(volume);
      interaction.reply({
        content: `Volume set to ${volume * 100}%`,
      });
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};