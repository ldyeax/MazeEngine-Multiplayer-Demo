// Create Game Cache
var gameCache = {};
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
			const senderMap = function() {
				
				// Exist Cells
				if(Array.isArray(gameCache.cells)) {
					gameCache.socket.emit('maze-map-sender', gameCache.cells);
				}

				// Try Again
				else { setTimeout(senderMap, 300); }

			};

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
gameCache.start = function (maze) {
	if (gameCache.socket) {

		// Insert Map into the cache
		gameCache.cells = clone(maze.cells);

	}
};
