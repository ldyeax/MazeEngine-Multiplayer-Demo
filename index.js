// Node.js code thanks to Tiny Jasmini

// Modules
import express from 'express';
import * as http from 'http';
import * as path from 'path';
import nunjucks from 'nunjucks';
import { Server } from 'socket.io';

import helmet from 'helmet';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { tinyLog } from './tinyLog.js';
import { error_page } from './error.js';
import { multiSender } from './multiplayer/index.js';

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

// Helmet Protection
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
const tinyGame = { user: {}, online: 0 };
const io = new Server(server);
io.on('connection', multiSender(tinyGame, io));
app.use(express.static(path.join(__dirname, './public')));
error_page(app);

// Start Server
server.listen(port, () => {
	console.log(tinyLog(`Maze App listening on port ${port}`));
});
