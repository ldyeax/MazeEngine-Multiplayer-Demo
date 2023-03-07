import { tinyLog } from '../tinyLog.js';
import generateMaze from 'engine/generatemaze.js';

// An instance of multiSender exists per player
const multiSender = function (cache, io) {
	return function (socket) {

		// Add User
		cache.online++;
		cache.user[socket.id] = {
			ip: socket.handshake.address,
			position: { x: 0, y: 0, z: 0 },
			rotation: { x: 0, y: 0, z: 0 },
			scale: { x: 0, y: 0, z: 0 },
			rotateSpeed: 1
		};

		socket.broadcast.emit('online-users', cache.online);
		socket.emit('online-users', cache.online);

		// Connect Detected
		console.log(tinyLog('a user connected on the tiny pudding! :3', 'socket', socket.id));
		console.log(tinyLog('user ip ' + cache.user[socket.id].ip, 'socket', socket.id));

		// Request Map
		socket.on('request-map', (data, fn) => {
			console.log(tinyLog('request-map', 'socket', socket.id));
			if (typeof data.id === 'string' && typeof data.username === 'string' && cache.user[data.id]) {

				// Validator
				data.id = data.id.substring(0, 200);
				data.username = data.username.substring(0, 30);

				// Username
				if (data.username.length < 1) {
					data.username = '???';
				}

				// Map Size
				const size = { height: 15, width: 15 };

				// Username
				if (!cache.user[socket.id].map) {
					cache.user[socket.id].username = data.username;
				}

				// Create Map
				console.log(data.id, socket.id);
				if (data.id && (!cache.user[data.id] || !cache.user[data.id].map) && data.id === socket.id) {

					// Map Generator
					cache.user[socket.id].map = generateMaze(size.width, size.height);
					cache.user[socket.id].map.ret;
					cache.user[socket.id].map.seed;
					cache.user[socket.id].map.asciiArt;

					// Insert User
					cache.user[socket.id].players = [socket.id];
					socket.join(`game-${socket.id}`);

				} else {
					cache.user[socket.id].map = cache.user[data.id].map;
					cache.user[data.id].players.push(socket.id);
					socket.join(`game-${data.id}`);
				}

				// Exist Map
				if (cache.user[data.id].map) {

					// Add to Room
					if (cache.user[socket.id].roomId) { socket.leave(`game-${cache.user[socket.id].roomId}`); }
					cache.user[socket.id].roomId = data.id;

					// Send Join Emit
					io.to(`game-${cache.user[socket.id].roomId}`).emit('player-join', { id: socket.id, request: false }, () => { });

					// Invoke Player List
					fn({ seed: cache.user[socket.id].map.seed, width: size.width, height: size.height });

					// Send Username
					socket.broadcast.emit('player-username', { username: data.username, id: socket.id });
					socket.emit('player-username', { username: data.username, id: socket.id });

				}

				// Nope
				else {
					fn(null);
				}

			} else {
				if (typeof data.id !== 'string') {
					console.log(tinyLog('request-map: data.id is not a string', 'socket', socket.id));
				}
				if (typeof data.username !== 'string') {
					console.log(tinyLog('request-map: data.username is not a string', 'socket', socket.id));
				}
				if (!cache.user[data.id]) {
					console.log(tinyLog(`request-map: cache.user[${data.id}] does not exist`, 'socket', socket.id));
				}
			}
		});

		// Player Request
		socket.on('player-list-request', () => {
			const roomId = cache.user[socket.id].roomId;
			if (Array.isArray(cache.user[roomId].players)) {
				for (const item in cache.user[roomId].players) {
					socket.emit('player-join', { id: cache.user[roomId].players[item], request: true }, () => {
						for (const value in playerSender) {
							if (cache.user[roomId].players[item][value]) {
								playerSender[value](socket.id)({ x: cache.user[roomId].players[item][value].x, y: cache.user[roomId].players[item][value].y, z: cache.user[roomId].players[item][value].z });
							}
						}
					});
				}
			}
		});

		// Player Sender Data
		const playerSender = {

			// Position
			position: (id) => {
				return function (obj) {
					if (obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number' && cache.user[id]) {
						cache.user[id].position = { x: obj.x, y: obj.y, z: obj.z };
						if (cache.user[id].roomId) {
							io.to(`game-${cache.user[id].roomId}`).emit('player-position', {
								id: id,
								data: cache.user[id].position
							});
						}
					}
				}
			},

			// Scale
			scale: (id) => {
				return function (obj) {
					if (obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number' && cache.user[id]) {
						cache.user[id].scale = { x: obj.x, y: obj.y, z: obj.z };
						if (cache.user[id].roomId) { io.to(`game-${cache.user[id].roomId}`).emit('player-scale', { id: id, data: cache.user[id].scale }); }
					}
				}
			},

			// Rotation
			rotation: (id) => {
				return function (obj) {
					if (obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number' && cache.user[id]) {
						cache.user[id].rotation = { x: obj.x, y: obj.y, z: obj.z };
						if (cache.user[id].roomId) { io.to(`game-${cache.user[id].roomId}`).emit('player-rotation', { id: id, data: cache.user[id].rotation }); }
					}
				}
			},

			// Speed Rotate
			rotateSpeed: (id) => {
				return function (speed) {
					if (typeof speed === 'number' && cache.user[id]) {
						cache.user[id].rotateSpeed = speed;
						if (cache.user[id].roomId) { io.to(`game-${cache.user[id].roomId}`).emit('player-rotate-speed', { id: id, data: cache.user[id].rotateSpeed }); }
					}
				}
			},

		};

		// Player Socket
		socket.on('player-position', playerSender.position(socket.id));
		socket.on('player-scale', playerSender.scale(socket.id));
		socket.on('player-rotation', playerSender.rotation(socket.id));
		socket.on('player-rotate-speed', playerSender.rotateSpeed(socket.id));

		// Disconnection
		socket.on('disconnect', () => {

			// Console message
			console.log(tinyLog('user disconnected from the tiny pudding! :c', 'socket', socket.id));

			// Remove User
			if (cache.user[socket.id].roomId) { io.to(`game-${cache.user[socket.id].roomId}`).emit('player-leave', { id: socket.id, request: false }, () => { }); }
			if (cache.user[socket.id].roomId && cache.user[cache.user[socket.id].roomId]) {

				const roomId = cache.user[socket.id].roomId;

				if (Array.isArray(cache.user[roomId].players)) {
					const index = cache.user[roomId].players.indexOf(socket.id);
					cache.user[roomId].players.splice(index, 1);
				}

			}

			// Destroy User Data
			cache.online--;
			socket.broadcast.emit('online-users', cache.online);
			socket.emit('online-users', cache.online);
			socket.leave(`game-${cache.user[socket.id].roomId}`);

			if (cache.user[socket.id]) {
				delete cache.user[socket.id];
			}

		});

	};
};

export { multiSender };
