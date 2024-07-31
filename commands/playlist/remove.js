const { SlashCommandBuilder } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a song from a playlist')
    .addStringOption((option) =>
      option
        .setName('playlist_name')
        .setDescription('The name of the playlist')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('song_title')
        .setDescription('The title of the song to remove')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('playlist_name');
    const songTitle = interaction.options.getString('song_title');

    try {
      const success = await musicUtils.removeSongFromPlaylist(
        interaction.guild,
        playlistName,
        songTitle
      );

      if (success) {
        interaction.reply({
          content: `Removed song '${songTitle}' from playlist '${playlistName}'.`,
        });
      } else {
        interaction.reply({
          content: `Song '${songTitle}' not found in playlist '${playlistName}'.`,
        });
      }
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};