// Create Game Cache
var gameCache = { online: null, players: {}, cache: {} };
function startSocketIO(mazeEngine, MarbleTest) {
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
				if (typeof online === 'number') {
					gameCache.online = online;
				}
			});

			// Connection Start
			gameCache.socket.on('connect', () => {
				console.log(tinyLog(`Connected!`, 'socket', gameCache.socket.id));
				if (gameCache.isMultiplayer) {
					$.LoadingOverlay('hide');
				}
			});

			// Disconnected
			gameCache.socket.on('disconnect', () => {
				console.log(tinyLog(`Disconnected!`, 'socket'));
				if (gameCache.isMultiplayer) {
					$.LoadingOverlay('show', { background: 'rgba(0,0,0, 0.5)' });
					if (gameCache.isHost) {
						location.reload();
					}
				}
			});

			// Send Player
			setInterval(function () {
				if (gameCache.instance && gameCache.instance.player) {
					
					const position = { x: gameCache.instance.player.position.x, y: gameCache.instance.player.position.y, z: gameCache.instance.player.position.z };
					const scale = { x: gameCache.instance.player.scale.x, y: gameCache.instance.player.scale.y, z: gameCache.instance.player.scale.z };
					const rotation = { x: gameCache.instance.player.rotation.x, y: gameCache.instance.player.rotation.y, z: gameCache.instance.player.rotation.z };
					const speedRotate = gameCache.instance.player.rotateSpeed;

					gameCache.socket.emit('player-position', position);
					gameCache.socket.emit('player-scale', scale);
					gameCache.socket.emit('player-rotation', rotation);
					gameCache.socket.emit('player-rotate-speed', speedRotate);

				}
			}, 0);

			// Move Extra Player
			const convertExtraPlayerPosition = function(position) {
				for(const item in position) {
					position[item] = position[item] / 100;
				}
				return position;
			};

			// Start Player
			const startPlayerModel = function (id) {
				const player = gameCache.players[id];

				player.mazeObject = mazeEngine.instantiate(MarbleTest, {x:0,y:0});

				// if (gameCache.objs && player.position && gameCache.instance) {

				// 	if (player) { 
				// 		//const cords = { x: player.position.x, y: player.position.y };
				// 		//player.model = new gameCache.objs.Marble(gameCache.instance); 
				// 		//gameCache.instance.instantiate(gameCache.objs.Marble, cords);
				// 		//gameCache.instance.instantiate(player.model, cords);
				// 	}

				// } else { setTimeout(function () { startPlayerModel(id); }, 300) }
			};

			// Receive Player
			gameCache.socket.on('player-position', obj => {
				if (gameCache.players[obj.id]) {
					gameCache.players[obj.id].position = obj.data;
					if (gameCache.players[obj.id].mazeObject) {
						gameCache.players[obj.id].mazeObject.position.set(obj.data.x, obj.data.y, obj.data.z);
					}
				}
			});

			gameCache.socket.on('player-scale', obj => {
				if (gameCache.players[obj.id]) {
					gameCache.players[obj.id].scale = obj.data;
				}
			});

			gameCache.socket.on('player-rotation', obj => {
				if (gameCache.players[obj.id]) {
					gameCache.players[obj.id].rotation = obj.data;
				}
			});

			gameCache.socket.on('player-rotate-speed', obj => {
				if (gameCache.players[obj.id]) {
					gameCache.players[obj.id].rotateSpeed = obj.data;
				}
			});

			gameCache.socket.on('player-join', id => {
				if (!gameCache.players[id]) { gameCache.players[id] = {}; }
				startPlayerModel(id);
			});

			gameCache.socket.on('player-username', data => {
				if (gameCache.players[data.id]) { gameCache.players[data.id].username = data.username; }
			});

			gameCache.socket.on('player-leave', id => {
				
				if (gameCache.players[id]) { 
					if (gameCache.players[id].mazeObject) {
						gameCache.players[id].mazeObject.destroy();
					}
					delete gameCache.players[id]; 
				}

				if (id === gameCache.room) {
					$.LoadingOverlay('show', { background: 'rgba(0,0,0, 0.5)' });
					location.reload();
				}

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
