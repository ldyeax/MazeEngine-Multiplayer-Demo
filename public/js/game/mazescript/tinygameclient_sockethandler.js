import MazeScript from 'engine/mazescript.js';

function vec3ToXYZ(vec3) {
	return {
		x: vec3.x,
		y: vec3.y,
		z: vec3.z
	};
};

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

		if (args.tinyGameClient) {
			this.tinyGame = args.tinyGameClient;
			this.socket = this.tinyGame.socket;
		} else {
			console.error(tinyLog('SocketHandler requires tinyGameClient', 'socket'));
		}

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
