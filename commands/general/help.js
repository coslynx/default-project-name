const { SlashCommandBuilder } = require('discord.js');
const { commands } = require('../../config.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands'),
  async execute(interaction) {
    const commandList = commands.map((command) => `- \`${command.name}\`: ${command.description}`).join('\n');

    await interaction.reply({
      content: `**Available Commands:**\n${commandList}`,
    });
  },
};