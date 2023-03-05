// Modules
const express = require('express');
const http = require('http');
const path = require('path');

// Prepare Node App
const app = express();
const server = http.createServer(app);
const port = 3001;

// Test node Page
app.get('/tiny-test', (req, res) => {
    res.send('<h1>Tiny Hello world. :3</h1>');
});

app.get('/tiny-test-2', (req, res) => {
    res.sendFile(path.join(__dirname, './private/index.html'));
});

// Static Files
app.use(express.static(path.join(__dirname, './public')));

// Start Server
server.listen(port, () => {
    console.log(`Test app listening on port ${port}`);
});