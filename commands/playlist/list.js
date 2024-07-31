const { SlashCommandBuilder } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('List all available playlists')
    .addStringOption((option) =>
      option
        .setName('playlist_name')
        .setDescription('The name of the playlist to list')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('playlist_name');

    try {
      const playlists = await musicUtils.getPlaylists(interaction.guild);

      if (!playlists[playlistName]) {
        return interaction.reply({
          content: `Playlist '${playlistName}' not found.`,
        });
      }

      const playlistSongs = playlists[playlistName];

      if (playlistSongs.length === 0) {
        return interaction.reply({
          content: `Playlist '${playlistName}' is empty.`,
        });
      }

      const playlistContent = playlistSongs
        .map((song, index) => `${index + 1}. ${song.title}`)
        .join('\n');

      interaction.reply({
        content: `**Playlist: ${playlistName}**\n${playlistContent}`,
      });
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};