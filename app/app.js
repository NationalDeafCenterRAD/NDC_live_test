// App
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../private_html/build')));

// For any other route, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../private_html/build', 'index.html'));
});

app.use('/iframeResizer', express.static('node_modules/iframe-resizer/js'));

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
})