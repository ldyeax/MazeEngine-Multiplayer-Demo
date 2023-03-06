// Create Game Cache
var tinyGame = { online: null, players: {}, cache: {} };
function startSocketIO(mazeEngine, MarbleTest) {
	try {

		const script = document.createElement('script');
		document.head.appendChild(script);

		script.onload = function () {

			// Start Socket
			try {
				tinyGame.socket = io(`${location.protocol}//${location.hostname}:3001`);
			} catch (err) {
				tinyGame.socket = null;
				console.error(err);
			}

			// Online Users
			tinyGame.socket.on('online-users', (online) => {
				if (typeof online === 'number') {
					tinyGame.online = online;
				}
			});

			// Connection Start
			tinyGame.socket.on('connect', () => {
				console.log(tinyLog(`Connected!`, 'socket', tinyGame.socket.id));
				if (tinyGame.isMultiplayer) {
					$.LoadingOverlay('hide');
				}
			});

			// Disconnected
			tinyGame.socket.on('disconnect', () => {
				console.log(tinyLog(`Disconnected!`, 'socket'));
				if (tinyGame.isMultiplayer) {
					$.LoadingOverlay('show', { background: 'rgba(0,0,0, 0.5)' });
					if (tinyGame.isHost) {
						location.reload();
					}
				}
			});

			// Send Player
			setInterval(function () {
				if (tinyGame.instance && tinyGame.instance.player) {
					
					const position = { x: tinyGame.instance.player.position.x, y: tinyGame.instance.player.position.y, z: tinyGame.instance.player.position.z };
					const scale = { x: tinyGame.instance.player.scale.x, y: tinyGame.instance.player.scale.y, z: tinyGame.instance.player.scale.z };
					const rotation = { x: tinyGame.instance.player.rotation.x, y: tinyGame.instance.player.rotation.y, z: tinyGame.instance.player.rotation.z };
					const speedRotate = tinyGame.instance.player.rotateSpeed;

					tinyGame.cache.position = position;
					tinyGame.socket.emit('player-position', position);

					tinyGame.cache.scale = scale;
					tinyGame.socket.emit('player-scale', scale);
					
					tinyGame.cache.rotation = rotation;
					tinyGame.socket.emit('player-rotation', rotation);

					tinyGame.cache.speedRotate = speedRotate;
					tinyGame.socket.emit('player-rotate-speed', speedRotate);


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
				const player = tinyGame.players[id];

				player.mazeObject = mazeEngine.instantiate(MarbleTest, {x:0,y:0});

				// if (tinyGame.objs && player.position && tinyGame.instance) {

				// 	if (player) { 
				// 		//const cords = { x: player.position.x, y: player.position.y };
				// 		//player.model = new tinyGame.objs.Marble(tinyGame.instance); 
				// 		//tinyGame.instance.instantiate(tinyGame.objs.Marble, cords);
				// 		//tinyGame.instance.instantiate(player.model, cords);
				// 	}

				// } else { setTimeout(function () { startPlayerModel(id); }, 300) }
			};

			// Receive Player
			tinyGame.socket.on('player-position', obj => {
				if (tinyGame.players[obj.id]) {
					tinyGame.players[obj.id].position = obj.data;
					if (tinyGame.players[obj.id].mazeObject) {
						tinyGame.players[obj.id].mazeObject.position.set(obj.data.x, obj.data.y, obj.data.z);
					}
				}
			});

			tinyGame.socket.on('player-scale', obj => {
				if (tinyGame.players[obj.id]) {
					tinyGame.players[obj.id].scale = obj.data;
				}
			});

			tinyGame.socket.on('player-rotation', obj => {
				if (tinyGame.players[obj.id]) {
					tinyGame.players[obj.id].rotation = obj.data;
				}
			});

			tinyGame.socket.on('player-rotate-speed', obj => {
				if (tinyGame.players[obj.id]) {
					tinyGame.players[obj.id].rotateSpeed = obj.data;
				}
			});

			tinyGame.socket.on('player-join', id => {
				if (!tinyGame.players[id]) { tinyGame.players[id] = {}; }
				startPlayerModel(id);
			});

			tinyGame.socket.on('player-username', data => {
				if (tinyGame.players[data.id]) { tinyGame.players[data.id].username = data.username; }
			});

			tinyGame.socket.on('player-leave', id => {
				
				if (tinyGame.players[id]) { 
					if (tinyGame.players[id].mazeObject) {
						tinyGame.players[id].mazeObject.destroy();
					}
					delete tinyGame.players[id]; 
				}

				if (id === tinyGame.room) {
					$.LoadingOverlay('show', { background: 'rgba(0,0,0, 0.5)' });
					location.reload();
				}

			});
		};

		script.onerror = function (err) { console.error(err); };
		script.async = true;
		script.src = `${location.protocol}//${location.hostname}:3001/socket.io/socket.io.js`;

	} catch (err) {
		tinyGame.socket = null;
		console.error(err);
	}
};
