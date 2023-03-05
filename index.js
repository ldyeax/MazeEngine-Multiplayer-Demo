// Node.js code thanks to Tiny Jasmini

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
nunjucks.configure([path.join(__dirname, './views')], {
	autoescape: true,
	express: app
});

app.set('view engine', 'nunjucks');

// Validator
app.use(function (req, _, next) {
	// Get User IP
	req.ip = getUserIP(req, {
		isFirebase: false
	});
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
const {
	Server
} = require('socket.io');
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

// Static Files
app.use(express.static(path.join(__dirname, './public')));
error_page(app);

// Start Server
server.listen(port, () => {
	console.log(`Test app listening on port ${port}`);
});
