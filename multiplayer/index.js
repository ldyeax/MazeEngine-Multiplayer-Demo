import { tinyLog } from '../tinyLog.js';
import generateMaze from 'engine/generatemaze.js';
const multiSender = function (cache, io) {
	return function (socket) {

		// Add User
		cache.online++;
		cache.user[socket.id] = { ip: socket.handshake.address };
		socket.broadcast.emit('online-users', cache.online);
		socket.emit('online-users', cache.online);

		// Map Generator
		cache.user[socket.id].map = generateMaze(15, 15);
		cache.user[socket.id].map.ret;
		cache.user[socket.id].map.seed;
		cache.user[socket.id].map.asciiArt;

		// Connect Detected
		console.log(tinyLog('a user connected on the tiny pudding! :3', 'socket', socket.id));
		console.log(tinyLog('user ip ' + cache.user[socket.id].ip, 'socket', socket.id));

		// Request Map
		socket.on('request-map', (id, fn) => {
			if (typeof id === 'string' && cache.user[id]) {

				// Fix ID
				id = id.substring(0, 200);

				// Size
				const size = { height: 15, width: 15 };

				// Create Map
				if (!cache.user[id].map && id === socket.id) {
					cache.user[socket.id].map = generateMaze(size.width, size.height);
				} else {
					cache.user[socket.id].map = cache.user[id].map;
				}

				// Exist Map
				if (cache.user[id].map) {
					if (cache.user[socket.id].room) { socket.leave(`game-${cache.user[socket.id].room}`); }
					cache.user[socket.id].room = id;
					io.to(cache.user[socket.id].room).emit('player-join', socket.id);
					socket.join(`game-${id}`);
					fn({ seed: cache.user[socket.id].map.seed, width: size.width, height: size.height });
				}

				// Nope
				else {
					fn(null);
				}

			}
		});

		// Player
		socket.on('player-position', (obj) => {
			if (obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number') {
				cache.user[socket.id].position = { x: obj.x, y: obj.y, z: obj.z };
				if (cache.user[socket.id].room) { io.to(cache.user[socket.id].room).emit('player-position', { id: socket.id, data: cache.user[socket.id].position }); }
			}
		});

		socket.on('player-scale', (obj) => {
			if (obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number') {
				cache.user[socket.id].scale = { x: obj.x, y: obj.y, z: obj.z };
				if (cache.user[socket.id].room) { io.to(cache.user[socket.id].room).emit('player-scale', { id: socket.id, data: cache.user[socket.id].scale }); }
			}
		});

		socket.on('player-rotation', (obj) => {
			if (obj && typeof obj.x === 'number' && typeof obj.y === 'number' && typeof obj.z === 'number') {
				cache.user[socket.id].rotation = { x: obj.x, y: obj.y, z: obj.z };
				if (cache.user[socket.id].room) { io.to(cache.user[socket.id].room).emit('player-rotation', { id: socket.id, data: cache.user[socket.id].rotation }); }
			}
		});

		// Disconnection
		socket.on('disconnect', () => {

			// Console message
			console.log(tinyLog('user disconnected from the tiny pudding! :c', 'socket', socket.id));
			if(cache.user[socket.id].room) { io.to(cache.user[socket.id].room).emit('player-leave', socket.id); }

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
