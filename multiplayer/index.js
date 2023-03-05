import { tinyLog } from '../tinyLog.js';
import generateMaze from '@mazeEngine/generatemaze.js';
const multiSender = function (cache) {
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

        // Disconnection
        socket.on('disconnect', () => {

            // Console message
            console.log(tinyLog('user disconnected from the tiny pudding! :c', 'socket', socket.id));

            // Destroy User Data
            cache.online--;
            if (cache.user[socket.id]) {
                delete cache.user[socket.id];
            }

			socket.broadcast.emit('online-users', cache.online);
			socket.emit('online-users', cache.online);

        });

		// Receive Map
		socket.on('maze-map-sender', (cells, fn) => {
			if(Array.isArray(cells)) {
				cache.user[socket.id].map = cells;
				console.log(tinyLog('Map from the user is downloaded!', 'socket', socket.id));
				fn(true);
			} else {
				fn(false);
			}
        });

    };
};

export { multiSender };
