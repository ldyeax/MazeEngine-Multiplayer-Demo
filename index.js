// Modules
const express = require('express');
const http = require('http');
const path = require('path');

// Prepare Node App
const app = express();
const server = http.createServer(app);
const port = 3001;

// Socket IO
const { Server } = require('socket.io');
const io = new Server(server);

// Test Socket IO
io.on('connection', (socket) => {
    console.log('a user connected with pudding! :3');
    console.log('User ID: ' + socket.id);
});

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