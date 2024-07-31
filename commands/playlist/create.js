const { SlashCommandBuilder } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create')
    .setDescription('Create a new playlist')
    .addStringOption((option) =>
      option
        .setName('playlist_name')
        .setDescription('The name of the playlist')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('playlist_name');

    try {
      const success = await musicUtils.createPlaylist(interaction.guild, playlistName);

      if (success) {
        interaction.reply({
          content: `Playlist '${playlistName}' created successfully.`,
        });
      } else {
        interaction.reply({
          content: `A playlist with that name already exists.`,
        });
      }
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};