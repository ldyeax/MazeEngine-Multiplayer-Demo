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

			// Online Users
			gameCache.socket.on('online-users', (online) => {
				if(typeof online === 'number') {
					gameCache.online = online;
				}
			});

			// Connection Start
			gameCache.socket.on('connect', () => {

				// Welcome
				console.log(tinyLog(`Connected!`, 'socket', gameCache.socket.id));

			});

			// Disconnected
			gameCache.socket.on('disconnect', () => {
				console.log(tinyLog(`Disconnected!`, 'socket'));
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
