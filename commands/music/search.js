const { MessageEmbed } = require('discord.js');
const musicUtils = require('../../utils/musicUtils');
const helper = require('../../utils/helper');
const ytsr = require('ytsr');

module.exports = {
  data: {
    name: 'search',
    description: 'Search for a song or playlist',
    options: [
      {
        name: 'query',
        description: 'The song or playlist to search for',
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction, client) {
    const query = interaction.options.getString('query');

    try {
      const searchResults = await ytsr(query);

      if (searchResults.items.length === 0) {
        return interaction.reply({
          content: 'No results found for your query.',
        });
      }

      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Search Results')
        .setDescription(
          searchResults.items
            .slice(0, 5)
            .map((item, index) => `${index + 1}. ${item.title}`)
            .join('\n'),
        );

      const message = await interaction.reply({
        embeds: [embed],
      });

      const filter = (i) => i.user.id === interaction.user.id && !isNaN(i.customId);
      const collector = message.createMessageComponentCollector({
        filter,
        time: 30000,
      });

      collector.on('collect', async (i) => {
        const choice = parseInt(i.customId);

        const track = await musicUtils.searchTrack(
          searchResults.items[choice - 1].url,
        );

        if (!track) {
          return interaction.editReply({
            content: 'An error occurred while searching for the track.',
          });
        }

        musicUtils.addToQueue(interaction.guild, track);

        if (musicUtils.queueIsEmpty(interaction.guild)) {
          await musicUtils.playTrack(interaction.guild, track);
          interaction.editReply({
            content: `Now playing: ${track.title}`,
          });
        } else {
          interaction.editReply({
            content: `Added to queue: ${track.title}`,
          });
        }
      });

      collector.on('end', () => {
        interaction.editReply({
          content: 'Search timed out.',
        });
      });
    } catch (error) {
      helper.handleError(interaction, error);
    }
  },
};