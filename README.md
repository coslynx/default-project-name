# 🌟 Discord Music Bot Project 🌟

## 📋 Description

A comprehensive Discord bot designed to elevate user experience within servers by providing interactive music playback functionalities. This bot empowers communities, gaming groups, and individuals to create a shared musical experience on Discord, fostering engagement and creating a more enjoyable atmosphere.

- 🎯 **Music Playback:** Play music from various sources like YouTube, SoundCloud, and Spotify, providing controls for play, pause, skip, stop, and volume adjustments.
- 🛠️ **Search Functionality:** Easily find and play specific songs or playlists with a user-friendly search command that suggests relevant results. 
- 🚀 **Voice Channel Management:** Seamlessly join and leave voice channels based on user commands, allowing users to control bot volume and adjust audio settings.

## 📑 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Hosting](#hosting)
- [API Documentation](#api-documentation)
- [License](#license)
- [Authors and Acknowledgments](#authors-and-acknowledgments)

## 💻 Installation

### 🔧 Prerequisites

- Node.js (v16 or later)
- npm (or yarn)
- Docker (optional)

### 🚀 Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/spectra-ai-codegen/discord-music-bot.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd discord-music-bot
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables:**
   - Create a `.env` file in the project root.
   - Add your Discord bot token, Lavalink server URL, and other API keys as environment variables:
     ```
     DISCORD_TOKEN=your_discord_bot_token
     LAVALINK_URL=your_lavalink_server_url
     YOUTUBE_API_KEY=your_youtube_api_key
     SOUNDCLOUD_CLIENT_ID=your_soundcloud_client_id
     SPOTIFY_CLIENT_ID=your_spotify_client_id
     SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
     GENIUS_ACCESS_TOKEN=your_genius_access_token
     MUSIXMATCH_API_KEY=your_musixmatch_api_key
     ```

## 🏗️ Usage

### 🏃‍♂️ Running the Project

1. **Start the development server:**
   ```bash
   npm start
   ```
2. **Invite the bot to your Discord server:**
   - Go to [https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&scope=bot](https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_ID&permissions=8&scope=bot) (replace `YOUR_BOT_ID` with your bot's ID).
   - Select your server and authorize the bot.

### ⚙️ Configuration

Adjust configuration settings in `config.js`. 

### 📚 Examples

- **📝 Play a song:** `!play <song name>`
- **📝 Search for a song:** `!search <song name>`
- **📝 Add a song to the queue:** `!queue <song name>`
- **📝 Skip the current song:** `!skip`
- **📝 Pause the music:** `!pause`
- **📝 Resume playback:** `!resume`
- **📝 Stop the music:** `!stop`
- **📝 Set the volume:** `!volume <number>`
- **📝 Display the current song:** `!nowplaying`
- **📝 Create a playlist:** `!createplaylist <playlist name>`
- **📝 Add a song to a playlist:** `!addplaylist <playlist name> <song name>`
- **📝 Remove a song from a playlist:** `!removeplaylist <playlist name> <song name>`
- **📝 List the songs in a playlist:** `!listplaylist <playlist name>`
- **📝 Play a playlist:** `!playplaylist <playlist name>`


## 🌐 Hosting

### 🚀 Deployment Instructions

#### Heroku

1. **Install the Heroku CLI:**
   ```bash
   npm install -g heroku
   ```
2. **Login to Heroku:**
   ```bash
   heroku login
   ```
3. **Create a new Heroku app:**
   ```bash
   heroku create
   ```
4. **Deploy the code:**
   ```bash
   git push heroku main
   ```
5. **Set environment variables:**
   - Go to your Heroku app's settings page.
   - Add the environment variables listed in the [`.env`](#setup-instructions) section.

### 🔑 Environment Variables

- `DISCORD_TOKEN`: Your Discord bot token.
- `LAVALINK_URL`:  Your Lavalink server URL.
- `YOUTUBE_API_KEY`: Your YouTube Data API v3 key.
- `SOUNDCLOUD_CLIENT_ID`: Your SoundCloud client ID.
- `SPOTIFY_CLIENT_ID`: Your Spotify client ID.
- `SPOTIFY_CLIENT_SECRET`: Your Spotify client secret.
- `GENIUS_ACCESS_TOKEN`: Your Genius API access token.
- `MUSIXMATCH_API_KEY`: Your Musixmatch API key.
- `MONGODB_URI`:  Your MongoDB connection URI (optional, for storing playlists).

## 📜 API Documentation

(Optional: If you are adding a web interface, provide documentation for the APIs you expose.)

### 🔍 Endpoints

- **GET /api/playlists**: Retrieves a list of playlists (if using MongoDB).
- **POST /api/playlists**: Creates a new playlist (if using MongoDB).

### 🔒 Authentication

(Optional:  If using authentication, describe your authentication mechanism.)

### 📝 Examples

(Optional: Provide example API requests.)

## 📜 License

This project is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/).

## 👥 Authors and Acknowledgments

- **Author Name** - Spectra.codes
- **Contributor Name** - DRIX10

Special thanks to:
- [Spectra.codes](https://spectra.codes)
- [DRIX10](https://github.com/Drix10)

## 📚 Additional Resources

- [Project Website](https://example.com)
- [Documentation](https://example.com/docs)
- [Related Project](https://example.com/related)