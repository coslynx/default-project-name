// Script for web/public/javascripts/script.js

// Function to fetch playlists from the API
async function fetchPlaylists() {
  try {
    const response = await fetch('/api/playlists');
    const playlists = await response.json();

    // Update the playlists list in the HTML
    const playlistsList = document.querySelector('#playlists ul');
    playlistsList.innerHTML = '';

    playlists.forEach(playlist => {
      const listItem = document.createElement('li');
      listItem.textContent = playlist.name;
      playlistsList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    // Handle error, display an error message to the user
  }
}

// Function to play a song
async function playSong(songUrl) {
  try {
    // ... Logic to send a request to the API to play the song ...

    // Update song information in the HTML
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');

    // ... Logic to fetch song title and artist from the API ...

    songTitle.textContent = songTitleFromAPI;
    songArtist.textContent = songArtistFromAPI;
  } catch (error) {
    console.error('Error playing song:', error);
    // Handle error, display an error message to the user
  }
}

// Event listeners for player controls
const playButton = document.getElementById('play');
playButton.addEventListener('click', () => {
  // ... Logic to get the currently selected song URL ...
  playSong(songUrl);
});

const pauseButton = document.getElementById('pause');
pauseButton.addEventListener('click', () => {
  // ... Logic to send a request to the API to pause playback ...
});

const stopButton = document.getElementById('stop');
stopButton.addEventListener('click', () => {
  // ... Logic to send a request to the API to stop playback ...
  // Clear song information in the HTML
  document.getElementById('song-title').textContent = '';
  document.getElementById('song-artist').textContent = '';
});

const skipButton = document.getElementById('skip');
skipButton.addEventListener('click', () => {
  // ... Logic to send a request to the API to skip to the next song ...
});

// Volume control
const volumeSlider = document.getElementById('volume');
volumeSlider.addEventListener('input', () => {
  const volume = volumeSlider.value / 100;
  // ... Logic to send a request to the API to set the volume ...
});

// Fetch playlists on page load
fetchPlaylists();