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

				} else {
					cache.user[socket.id].map = cache.user[data.id].map;
					cache.user[data.id].players.push(socket.id);
				}

				// Exist Map
				if (cache.user[data.id].map) {

					// Add to Room
					if (cache.user[socket.id].roomId) { socket.leave(`game-${cache.user[socket.id].roomId}`); }
					cache.user[socket.id].roomId = data.id;

					// Send Join Emit
					io.to(cache.user[socket.id].roomId).emit('player-join', socket.id);
					socket.join(`game-${data.id}`);

					// Return Message
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

		// Player Sender Data
		const playerSender = {

			// Position
			position: (obj) => {
				if (obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number') {
					cache.user[socket.id].position = { x: obj.x, y: obj.y, z: obj.z };
					if (cache.user[socket.id].roomId) {
						io.to(cache.user[socket.id].roomId).emit('player-position', {
							id: socket.id,
							data: cache.user[socket.id].position
						});
					}
				}
			},

			// Scale
			scale: (obj) => {
				if (obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number') {
					cache.user[socket.id].scale = { x: obj.x, y: obj.y, z: obj.z };
					if (cache.user[socket.id].roomId) { io.to(cache.user[socket.id].roomId).emit('player-scale', { id: socket.id, data: cache.user[socket.id].scale }); }
				}
			},

			// Rotation
			rotation: (obj) => {
				if (obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number') {
					cache.user[socket.id].rotation = { x: obj.x, y: obj.y, z: obj.z };
					if (cache.user[socket.id].roomId) { io.to(cache.user[socket.id].roomId).emit('player-rotation', { id: socket.id, data: cache.user[socket.id].rotation }); }
				}
			},

			// Speed Rotate
			speed: (speed) => {
				if (typeof speed === 'number') {
					cache.user[socket.id].rotateSpeed = speed;
					if (cache.user[socket.id].roomId) { io.to(cache.user[socket.id].roomId).emit('player-rotate-speed', { id: socket.id, data: cache.user[socket.id].rotateSpeed }); }
				}
			},

		};

		// Player Socket
		socket.on('player-position', playerSender.position);
		socket.on('player-scale', playerSender.scale);
		socket.on('player-rotation', playerSender.rotation);
		socket.on('player-rotate-speed', playerSender.speed);

		// Disconnection
		socket.on('disconnect', () => {

			// Console message
			console.log(tinyLog('user disconnected from the tiny pudding! :c', 'socket', socket.id));

			// Remove User
			if (cache.user[socket.id].roomId) { io.to(cache.user[socket.id].roomId).emit('player-leave', socket.id); }
			if (cache.user[socket.id].roomId && cache.user[cache.user[socket.id].roomId]) {
				const index = cache.user[cache.user[socket.id].roomId].indexOf(socket.id);
				cache.user[cache.user[socket.id].roomId].splice(index, 1);
			}

			// Destroy User Data
			cache.online--;
			if (cache.user[socket.id]) {
				delete cache.user[socket.id];
			}

			socket.broadcast.emit('online-users', cache.online);
			socket.emit('online-users', cache.online);

		});

	};
};

export { multiSender };
