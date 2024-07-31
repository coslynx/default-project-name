const { SlashCommandBuilder } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a song to a playlist')
    .addStringOption((option) =>
      option
        .setName('playlist_name')
        .setDescription('The name of the playlist')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('song_title')
        .setDescription('The title of the song to add')
        .setRequired(true)
    ),
  async execute(interaction) {
    const playlistName = interaction.options.getString('playlist_name');
    const songTitle = interaction.options.getString('song_title');

    try {
      const success = await musicUtils.addSongToPlaylist(
        interaction.guild,
        playlistName,
        songTitle
      );

      if (success) {
        interaction.reply({
          content: `Added song '${songTitle}' to playlist '${playlistName}'.`,
        });
      } else {
        interaction.reply({
          content: `Could not add song '${songTitle}' to playlist '${playlistName}'.`,
        });
      }
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};