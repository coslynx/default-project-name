const { SlashCommandBuilder } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');
const SoundCloud = require('soundcloud-downloader');
const Spotify = require('spotify-web-api-node');
const { default: fetch } = require('node-fetch');

const spotifyApi = new Spotify({
  id: process.env.SPOTIFY_CLIENT_ID,
  secret: process.env.SPOTIFY_CLIENT_SECRET,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play music from YouTube, SoundCloud, or Spotify')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('The song or playlist to play')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('query');

    try {
      let track;
      let source;

      // Check if the query is a YouTube URL
      if (ytdl.validateURL(query)) {
        source = 'youtube';
        track = await musicUtils.searchTrack(query);
      } else if (query.includes('soundcloud.com')) {
        source = 'soundcloud';
        track = await musicUtils.searchTrack(query);
      } else if (query.includes('open.spotify.com')) {
        source = 'spotify';
        const spotifyTrack = await getSpotifyTrack(query);
        track = await musicUtils.searchTrack(spotifyTrack.external_urls.spotify);
      } else {
        // Search for the query on YouTube
        const searchResults = await ytsr(query);

        if (searchResults.items.length === 0) {
          return interaction.reply({
            content: 'No results found for your query.',
          });
        }

        source = 'youtube';
        track = await musicUtils.searchTrack(
          searchResults.items[0].url
        );
      }

      if (!track) {
        return interaction.reply({
          content: 'An error occurred while searching for the track.',
        });
      }

      musicUtils.addToQueue(interaction.guild, track);

      if (musicUtils.queueIsEmpty(interaction.guild)) {
        await musicUtils.playTrack(interaction.guild, track);
        interaction.reply({
          content: `Now playing: ${track.title}`,
        });
      } else {
        interaction.reply({
          content: `Added to queue: ${track.title}`,
        });
      }
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};

async function getSpotifyTrack(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.track;
  } catch (error) {
    console.error('Error getting Spotify track:', error);
    return null;
  }
}