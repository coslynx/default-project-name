const { MongoClient } = require('mongodb');
const { mongodb } = require('../config');
const logger = require('./logger');

const client = new MongoClient(mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createPlaylist(guild, playlistName) {
  try {
    await client.connect();
    const db = client.db('discord-music-bot');
    const playlistsCollection = db.collection('playlists');
    const existingPlaylist = await playlistsCollection.findOne({
      guildId: guild.id,
      name: playlistName,
    });

    if (existingPlaylist) {
      return false;
    }

    await playlistsCollection.insertOne({
      guildId: guild.id,
      name: playlistName,
      songs: [],
    });
    return true;
  } catch (error) {
    logger.error(`Error creating playlist: ${error}`);
    return false;
  } finally {
    await client.close();
  }
}

async function addSongToPlaylist(guild, playlistName, songTitle) {
  try {
    await client.connect();
    const db = client.db('discord-music-bot');
    const playlistsCollection = db.collection('playlists');
    const result = await playlistsCollection.updateOne(
      { guildId: guild.id, name: playlistName },
      { $push: { songs: { title: songTitle } } }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    logger.error(`Error adding song to playlist: ${error}`);
    return false;
  } finally {
    await client.close();
  }
}

async function removeSongFromPlaylist(guild, playlistName, songTitle) {
  try {
    await client.connect();
    const db = client.db('discord-music-bot');
    const playlistsCollection = db.collection('playlists');
    const result = await playlistsCollection.updateOne(
      { guildId: guild.id, name: playlistName },
      { $pull: { songs: { title: songTitle } } }
    );

    return result.modifiedCount > 0;
  } catch (error) {
    logger.error(`Error removing song from playlist: ${error}`);
    return false;
  } finally {
    await client.close();
  }
}

async function getPlaylists(guild) {
  try {
    await client.connect();
    const db = client.db('discord-music-bot');
    const playlistsCollection = db.collection('playlists');
    const playlists = await playlistsCollection.find({ guildId: guild.id }).toArray();
    const playlistsMap = {};

    playlists.forEach((playlist) => {
      playlistsMap[playlist.name] = playlist.songs;
    });

    return playlistsMap;
  } catch (error) {
    logger.error(`Error getting playlists: ${error}`);
    return null;
  } finally {
    await client.close();
  }
}

module.exports = {
  createPlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getPlaylists,
};