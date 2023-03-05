// Modules
const express = require('express');
const http = require('http');
const path = require('path');

// Prepare Node App
const app = express();
const server = http.createServer(app);
const port = 3001;

// Helmet Protection
const helmet = require('helmet');
//app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// Socket IO
const { Server } = require('socket.io');
const io = new Server(server);

// Test Socket IO
io.on('connection', (socket) => {

    console.log('a user connected on the tiny pudding! :3');
    console.log('User ID: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected from the tiny pudding! :3');
        console.log('User ID: ' + socket.id);
    });

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