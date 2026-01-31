const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the LivelyWorms directory
app.use(express.static(path.join(__dirname, 'LivelyWorms')));

// Serve index.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'LivelyWorms', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
