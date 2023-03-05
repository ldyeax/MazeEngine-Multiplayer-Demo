// Modules
const express = require('express');
const http = require('http');
const path = require('path');
const nunjucks = require('nunjucks');
const error_page = require('./error');
const getUserIP = require('@tinypudding/puddy-lib/http/userIP');


// Prepare Node App
const app = express();
const server = http.createServer(app);
const port = 3001;

// Nunjucks
nunjucks.configure([path.join(__dirname, './views'), puddyTemplatePath], {
    autoescape: true,
    express: web.app
});

// Validator
app.use(function (req, res, next) {

    // Get User IP
    req.ip = getUserIP(req, { isFirebase: false });

    // Complete
    next();

});

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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './private/index.html'));
});

// Static Files
app.use(express.static(path.join(__dirname, './public')));
error_page(app);

// Start Server
server.listen(port, () => {
    console.log(`Test app listening on port ${port}`);
});