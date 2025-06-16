require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// URL Shortener API

const urlDatabase = {};

app.use(express.json());

app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;
  console.log(`Received URL: ${originalUrl}`);
  // Check if the URL is provided
  if (!originalUrl) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Simple URL validation
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  if (!urlRegex.test(originalUrl)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Generate a short URL
  const shortUrl = Math.random().toString(36).substring(2, 8);
  urlDatabase[shortUrl] = originalUrl;

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:shortUrl', function(req, res) {
  const shortUrl = req.params.shortUrl;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  }
  else {
    res.status(404).json({ error: 'Short URL not found' });
  }
}
);  

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
