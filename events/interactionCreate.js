const { Client, IntentsBitField, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Player } = require('lavalink');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType } = require('@discordjs/voice');
const { readdirSync } = require('fs');
const { resolve } = require('path');

require('dotenv').config();

const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildVoiceStates, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent] });

// Global variables
client.commands = new Collection();
client.queue = new Map();
client.player = new Player();

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

// Load commands
const commandsPath = resolve(__dirname, 'commands');
readdirSync(commandsPath).forEach(folder => {
    const commandFiles = readdirSync(`${commandsPath}/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`${commandsPath}/${folder}/${file}`);
        client.commands.set(command.data.name, command);
    }
});

// Lavalink setup
client.player.on('playerCreate', player => {
    player.once('connectionClosed', () => {
        const serverQueue = client.queue.get(player.guild.id);
        if (serverQueue) {
            serverQueue.player.destroy();
            client.queue.delete(player.guild.id);
        }
    });
});

client.player.on('trackStart', track => {
    const serverQueue = client.queue.get(track.guild.id);
    if (serverQueue) {
        serverQueue.connection.state.subscription.player.play(createAudioResource(track.track, { inputType: StreamType.Arbitrary, inlineVolume: true }));
    }
});

// Load events
const eventsPath = resolve(__dirname, 'events');
readdirSync(eventsPath).forEach(file => {
    const event = require(`${eventsPath}/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, (...args) => event.execute(...args, client));
});

// Register commands
(async () => {
    try {
        console.log(`Started refreshing application (/) commands.`);

        const commands = [];
        client.commands.forEach(command => {
            commands.push(command.data.toJSON());
        });

        const data = await rest.put(
            Routes.applicationCommands(client.application.id),
            { body: commands },
        );

        console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

client.login(process.env.DISCORD_TOKEN);