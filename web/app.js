const express = require('express');
const path = require('path');
const morgan = require('morgan');
const pug = require('pug');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Set up Pug templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

// API Routes (example)
app.get('/api/playlists', (req, res) => {
  // ... Logic to fetch playlists from database or API ...
  res.json(playlists);
});

app.post('/api/playlists', (req, res) => {
  // ... Logic to create a new playlist in the database or API ...
  res.json({ success: true });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});