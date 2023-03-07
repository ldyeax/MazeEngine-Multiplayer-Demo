import MazeScript from 'engine/mazescript.js';

function vec3ToXYZ(vec3) {
	return {
		x: vec3.x,
		y: vec3.y,
		z: vec3.z
	};
};

import Marble from '../mazeobject/multiplayermarble.js';

/**
 * @typedef {import('engine/mazeobject.js').default} MazeObject
 * @typedef {import('../tinygameclient.js').default} TinyGameClient
 */
export default class SocketHandler extends MazeScript {

	/**
	 * @type {TinyGameClient}
	 */
	tinyGame = null;

	/**
	 * @type {SocketIOClient.Socket}
	 */
	socket = null;
	constructor(mazeObject, args) {

		super(mazeObject);

		let mazeEngine = this.mazeEngine;

		if (args.tinyGameClient) {
			this.tinyGame = args.tinyGameClient;
			this.socket = this.tinyGame.socket;
		} else {
			console.error(tinyLog('SocketHandler requires tinyGameClient', 'socket'));
		}

		let socket = this.socket;
		let tinyGame = this.tinyGame;

		// Online Users
		socket.on('online-users', (online) => {
			if (typeof online === 'number') {
				tinyGame.online = online;
			}
		});

		// Connection Start
		socket.on('connect', () => {
			console.log(tinyLog(`Connected!`, 'socket', tinyGame.socket.id));
			$.LoadingOverlay('hide');
		});

		// Disconnected
		socket.on('disconnect', () => {
			console.log(tinyLog(`Disconnected!`, 'socket'));
			$.LoadingOverlay('show', { background: 'rgba(0,0,0, 0.5)' });
			if (tinyGame.isHost) {
				location.reload();
			}
		});

		socket.on('player-position', obj => {
			if (tinyGame.players[obj.id]) {
				tinyGame.players[obj.id].position.set(obj.data.x, obj.data.y, obj.data.z);
			}
		});

		socket.on('player-scale', obj => {
			if (tinyGame.players[obj.id]) {
				tinyGame.players[obj.id].scale.set(obj.data.x, obj.data.y, obj.data.z);
			}
		});

		socket.on('player-rotation', obj => {
			if (tinyGame.players[obj.id]) {
				tinyGame.players[obj.id].rotation.set(obj.data.x, obj.data.y, obj.data.z);
			}
		});

		socket.on('player-rotate-speed', obj => {
			if (tinyGame.players[obj.id]) {
				tinyGame.players[obj.id].rotateSpeed = obj.data;
			}
		});

		socket.on('player-join', id => {
			if (tinyGame.players[id]) { return; }
			tinyGame.players[id] = mazeEngine.instantiate(Marble, {
				isPlayer: id == tinyGame.socketID
			});
		});

		socket.on('player-username', data => {
			if (tinyGame.players[data.id]) {
				tinyGame.players[data.id].username = data.username;
			}
		});

		socket.on('player-leave', id => {
			if (tinyGame.players[id]) {
				try {
					tinyGame.players[id].destroy();
				} catch (ex) {
					console.error('error attempting to destroy existing player');
					console.error(ex);
				}
				// give mazeengine time to process destroy()
				setTimeout(() => {
					delete tinyGame.players[id];
				}, 2);
			}
			if (id === tinyGame.roomID) {
				$.LoadingOverlay('show', { background: 'rgba(0,0,0, 0.5)' });
				location.reload();
			}
		});

	}

	update() {
		super.update();
		let player = this.mazeEngine.player;
		this.#checkEmitVec3('player-position', player.position);
		this.#checkEmitVec3('player-rotation', player.rotation);
		this.#checkEmitVec3('player-scale', player.scale);
	}

	// #region checkEmit
	#checkEmit(name, value) {
		let newHash = objHash(value);
		let cache = this.tinyGame.cache;
		let cachedHash = cache[name];
		if (newHash != cachedHash) {
			cache[name] = newHash;
			this.socket.emit(name, value);
		}
	}

	#checkEmitVec3(name, value) {
		this.#checkEmit(name, vec3ToXYZ(value));
	}
	// #endregion

}
