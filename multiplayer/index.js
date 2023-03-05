module.exports = function (cache) {
    return function (socket) {

        // Add User
        cache.online++;
        cache.user[socket.id] = { ip: socket.handshake.address };

        // Connect Detected
        console.log('[socket] [' + socket.id + '] a user connected on the tiny pudding! :3');
        console.log('[socket] [' + socket.id + '] user ip ' + cache.user[socket.id].ip);

        // Disconnection
        socket.on('disconnect', () => {

            // Console message
            console.log('[socket] [' + socket.id + '] user disconnected from the tiny pudding! :c');

            // Destroy User Data
            cache.online--;
            if (cache.user[socket.id]) {
                delete cache.user[socket.id];
            }

        });

		// Receive Map
		socket.on('maze-map-sender', (cells, fn) => {
			console.log(cells);
			if(Array.isArray(cells)) {
				cache.user[socket.id].map = cells;
				console.log('[socket] [' + socket.id + '] Map from the user is downloaded!');
				fn(true);
			} else {
				fn(false);
			}
        });

    };
};
