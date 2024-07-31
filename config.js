require('dotenv').config();

module.exports = {
  // Discord Bot Token
  token: process.env.DISCORD_TOKEN,

  // Lavalink Server URL
  lavalink: {
    url: process.env.LAVALINK_URL,
    password: process.env.LAVALINK_PASSWORD || 'youshallnotpass', // Add a password if needed
    secure: process.env.LAVALINK_SECURE === 'true' ? true : false,
    retryDelay: 1500,
    retryAttempts: 10
  },

  // YouTube Data API v3 Key
  youtube: {
    apiKey: process.env.YOUTUBE_API_KEY
  },

  // SoundCloud Client ID
  soundcloud: {
    clientId: process.env.SOUNDCLOUD_CLIENT_ID
  },

  // Spotify API Credentials
  spotify: {
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  },

  // Genius API Access Token
  genius: {
    accessToken: process.env.GENIUS_ACCESS_TOKEN
  },

  // Musixmatch API Key
  musixmatch: {
    apiKey: process.env.MUSIXMATCH_API_KEY
  },

  // MongoDB Connection URI
  mongodb: {
    uri: process.env.MONGODB_URI
  },

  // Default Music Player Options
  player: {
    volume: 0.5, // Default volume (0.0 to 1.0)
    leaveOnEnd: true, // Leave the voice channel after the queue finishes
    leaveOnEmpty: true, // Leave the voice channel if no one is listening
    leaveOnStop: true // Leave the voice channel when the bot is stopped
  },

  // Bot Prefix (for command handling)
  prefix: '!',

  // Command Handler Options
  commandHandler: {
    caseInsensitive: true // Handle commands regardless of case
  },

  // Logging Options
  logging: {
    level: 'info' // Set the logging level: 'debug', 'info', 'warn', 'error'
  }
};