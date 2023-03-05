// Create Game Cache
var gameCache = {};
const startSocketIO = function () {
	try {

		const script = document.createElement('script');
		document.head.appendChild(script);

		script.onload = function () {

			try {
				gameCache.socket = io(`${location.protocol}//${location.hostname}:3001`);
			} catch (err) {
				gameCache.socket = null;
				console.error(err);
			}

			// client-side
			gameCache.socket.on('connect', () => {
				console.log(`[socket] [${gameCache.socket.id}] Connected!`);
			});
			
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

		gameCache.cells = clone(maze.cells);

	}
};
