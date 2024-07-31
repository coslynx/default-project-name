const moment = require('moment');

// Function to format time in h:mm:ss format
function formatTime(milliseconds) {
  return moment.duration(milliseconds).format('h:mm:ss', { trim: false });
}

// Function to handle errors and send appropriate messages to the user
function handleError(interaction, error) {
  console.error(error);
  interaction.reply({
    content: 'An error occurred. Please try again later.',
  });
}

module.exports = {
  formatTime,
  handleError,
};