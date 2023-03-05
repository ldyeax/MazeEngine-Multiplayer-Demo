// Create Game Cache
var gameCache = { online: null };
const startSocketIO = function () {
	try {

		const script = document.createElement('script');
		document.head.appendChild(script);

		script.onload = function () {

			// Start Socket
			try {
				gameCache.socket = io(`${location.protocol}//${location.hostname}:3001`);
			} catch (err) {
				gameCache.socket = null;
				console.error(err);
			}

			// Send Map
			const senderMap = function () {

				// Exist Cells
				if (Array.isArray(gameCache.seed)) {
					console.log('[socket] [' + gameCache.socket.id + '] Map is being uploaded!');
					gameCache.socket.emit('maze-map-sender', gameCache.seed, function (complete) {
						if (complete) {
							console.log('[socket] [' + gameCache.socket.id + '] Map Upload Complete!');
						} else {
							console.log('[socket] [' + gameCache.socket.id + '] Map Upload Failed!');
						}
					});
				}

				// Try Again
				else { setTimeout(function() { senderMap(); }, 300); }

			};

			// Online Users
			gameCache.socket.on('online-users', (online) => {
				if(typeof online === 'number') {
					gameCache.online = online;
				}
			});

			// Connection Start
			gameCache.socket.on('connect', () => {

				// Welcome
				console.log(`[socket] [${gameCache.socket.id}] Connected!`);
				senderMap();

			});

			// Disconnected
			gameCache.socket.on('disconnect', () => {
				console.log(`[socket] Disconnected!`);
			});

		};

		script.onerror = function (err) { console.error(err); };
		script.async = true;
		script.src = `${location.protocol}//${location.hostname}:3001/socket.io/socket.io.js`;

	} catch (err) {
		gameCache.socket = null;
		console.error(err);
	}
};
startSocketIO();

// Start Socket App
gameCache.start = function (Scene, maze) {
	if (gameCache.socket) {

		// Insert Map into the cache
		gameCache.seed = clone(maze.seed);
		console.log(`[game] [map] The map seed is ${maze.seed.join('')}`);
		console.log(`[game] [map] Width ${maze.seedSize.width}`);
		console.log(`[game] [map] Height ${maze.seedSize.height}`);

	}
};
