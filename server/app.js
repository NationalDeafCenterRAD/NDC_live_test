// App
const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '/')));

// For any other route, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
})