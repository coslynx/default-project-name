const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const SoundCloud = require('soundcloud-downloader');
const Spotify = require('spotify-web-api-node');
const { default: fetch } = require('node-fetch');
const ytsr = require('ytsr');
const { player } = require('../config');
const logger = require('./logger');
const helper = require('./helper');

const spotifyApi = new Spotify({
  id: process.env.SPOTIFY_CLIENT_ID,
  secret: process.env.SPOTIFY_CLIENT_SECRET,
});

const queue = new Map();

// Function to search for a track based on a query
async function searchTrack(query) {
  try {
    let track;
    let source;

    // Check if the query is a YouTube URL
    if (ytdl.validateURL(query)) {
      source = 'youtube';
      track = await getTrackFromYouTube(query);
    } else if (query.includes('soundcloud.com')) {
      source = 'soundcloud';
      track = await getTrackFromSoundCloud(query);
    } else if (query.includes('open.spotify.com')) {
      source = 'spotify';
      const spotifyTrack = await getSpotifyTrack(query);
      track = await getTrackFromYouTube(spotifyTrack.external_urls.spotify);
    } else {
      // Search on YouTube
      const searchResults = await ytsr(query);
      if (searchResults.items.length === 0) {
        return null;
      }
      source = 'youtube';
      track = await getTrackFromYouTube(searchResults.items[0].url);
    }

    if (!track) {
      return null;
    }

    track.source = source;
    return track;
  } catch (error) {
    logger.error(`Error searching for track: ${error}`);
    return null;
  }
}

// Function to get a track from YouTube
async function getTrackFromYouTube(url) {
  try {
    const info = await ytdl.getInfo(url);
    return {
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      duration: info.videoDetails.lengthSeconds * 1000,
      url: info.videoDetails.video_url,
    };
  } catch (error) {
    logger.error(`Error getting track from YouTube: ${error}`);
    return null;
  }
}

// Function to get a track from SoundCloud
async function getTrackFromSoundCloud(url) {
  try {
    const trackInfo = await SoundCloud.getTrackInfo(url);
    return {
      title: trackInfo.title,
      author: trackInfo.user.username,
      duration: trackInfo.duration,
      url: trackInfo.permalink_url,
    };
  } catch (error) {
    logger.error(`Error getting track from SoundCloud: ${error}`);
    return null;
  }
}

// Function to get a track from Spotify
async function getSpotifyTrack(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.track;
  } catch (error) {
    logger.error(`Error getting Spotify track: ${error}`);
    return null;
  }
}

// Function to add a track to the queue
function addToQueue(guild, track) {
  const serverQueue = queue.get(guild.id);

  if (!serverQueue) {
    const queueConstructor = {
      textChannel: null,
      voiceChannel: null,
      connection: null,
      songs: [],
      player: null,
      playing: false,
    };
    queue.set(guild.id, queueConstructor);
  }

  queue.get(guild.id).songs.push(track);
  return true;
}

// Function to get the queue for a specific guild
function getQueue(guild) {
  return queue.get(guild.id);
}

// Function to check if the queue is empty
function queueIsEmpty(guild) {
  return queue.get(guild.id).songs.length === 0;
}

// Function to play a track
async function playTrack(guild, track) {
  const serverQueue = queue.get(guild.id);

  if (!serverQueue) {
    logger.error(`Server queue not found for guild: ${guild.id}`);
    return;
  }

  // If no voice connection exists, join the voice channel
  if (!serverQueue.connection) {
    serverQueue.voiceChannel = guild.members.cache.get(serverQueue.textChannel.guild.me.id).voice.channel;
    if (!serverQueue.voiceChannel) {
      logger.error(`Bot not in a voice channel`);
      return;
    }

    const connection = joinVoiceChannel({
      channelId: serverQueue.voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
    serverQueue.connection = connection;
  }

  // Create the audio player
  if (!serverQueue.player) {
    serverQueue.player = createAudioPlayer({
      behaviors: {
        noAudio: player.leaveOnEmpty,
        idle: player.leaveOnEmpty,
        invalid: player.leaveOnStop,
        endOfStream: player.leaveOnEnd,
      },
    });
    const subscription = serverQueue.connection.subscribe(serverQueue.player);
  }

  // Play the track
  const resource = createAudioResource(track.url, {
    inputType: StreamType.Arbitrary,
    inlineVolume: true,
  });
  serverQueue.player.play(resource);

  // Handle player events
  serverQueue.player.on(AudioPlayerStatus.Playing, () => {
    logger.info(`Playing track: ${track.title}`);
    serverQueue.playing = true;
  });

  serverQueue.player.on(AudioPlayerStatus.AutoPaused, () => {
    logger.info(`Track auto-paused: ${track.title}`);
  });

  serverQueue.player.on(AudioPlayerStatus.Paused, () => {
    logger.info(`Track paused: ${track.title}`);
    serverQueue.playing = false;
  });

  serverQueue.player.on(AudioPlayerStatus.Buffering, () => {
    logger.info(`Track buffering: ${track.title}`);
  });

  serverQueue.player.on(AudioPlayerStatus.Idle, () => {
    logger.info(`Track ended: ${track.title}`);
    serverQueue.playing = false;

    // Play the next track if there are any in the queue
    if (!serverQueue.songs.length) {
      // If the queue is empty, leave the voice channel
      serverQueue.connection.destroy();
      serverQueue.voiceChannel = null;
      serverQueue.connection = null;
      serverQueue.player.stop();
      queue.delete(guild.id);
    } else {
      // Play the next track in the queue
      playTrack(guild, serverQueue.songs.shift());
    }
  });

  serverQueue.player.on('error', (error) => {
    logger.error(`Audio player error: ${error}`);

    // If the player encounters an error, attempt to skip to the next track
    if (!serverQueue.songs.length) {
      // If the queue is empty, leave the voice channel
      serverQueue.connection.destroy();
      serverQueue.voiceChannel = null;
      serverQueue.connection = null;
      serverQueue.player.stop();
      queue.delete(guild.id);
    } else {
      // Play the next track in the queue
      playTrack(guild, serverQueue.songs.shift());
    }
  });

  // Handle disconnections
  serverQueue.connection.on('stateChange', (oldState, newState) => {
    if (newState.status === 'disconnected') {
      logger.warn(`Disconnected from voice channel`);

      // If the bot disconnects, attempt to reconnect or leave the voice channel
      if (serverQueue.connection.rejoinAttempts < 3) {
        helper.retry(() => {
          serverQueue.connection = joinVoiceChannel({
            channelId: serverQueue.voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
          });
        }, 'Reconnect to voice channel', 1000);
      } else {
        // Leave the voice channel if unable to reconnect
        serverQueue.connection.destroy();
        serverQueue.voiceChannel = null;
        serverQueue.connection = null;
        serverQueue.player.stop();
        queue.delete(guild.id);
      }
    }
  });

  return true;
}

// Function to pause the currently playing track
function pauseTrack(guild) {
  const serverQueue = queue.get(guild.id);

  if (!serverQueue || !serverQueue.playing) {
    return false;
  }

  serverQueue.player.pause();
  return true;
}

// Function to resume the currently paused track
function resumeTrack(guild) {
  const serverQueue = queue.get(guild.id);

  if (!serverQueue || !serverQueue.playing) {
    return false;
  }

  serverQueue.player.resume();
  return true;
}

// Function to stop the currently playing track and clear the queue
function stopTrack(guild) {
  const serverQueue = queue.get(guild.id);

  if (!serverQueue) {
    return false;
  }

  serverQueue.player.stop();
  serverQueue.songs = [];
  return true;
}

// Function to skip the currently playing track
function skipTrack(guild) {
  const serverQueue = queue.get(guild.id);

  if (!serverQueue) {
    return false;
  }

  serverQueue.player.stop();
  return true;
}

// Function to set the volume of the music player
function setVolume(guild, volume) {
  const serverQueue = queue.get(guild.id);

  if (!serverQueue) {
    return false;
  }

  serverQueue.player.setVolume(volume);
  return true;
}

module.exports = {
  searchTrack,
  addToQueue,
  getQueue,
  queueIsEmpty,
  playTrack,
  pauseTrack,
  resumeTrack,
  stopTrack,
  skipTrack,
  setVolume,
};