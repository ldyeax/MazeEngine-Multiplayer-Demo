
/**
 * @typedef {import("../MazeEngine/engine/mazeengine.js").default} MazeEngine
 */
export default class SocketIO {
	static scriptLoaded = false;

	static {
		const script = document.createElement('script');
		document.head.appendChild(script);
		script.onerror = function (err) { console.error(err); };
		script.async = true;
		script.src = "/socket.io/socket.io.js";
		script.onload = function () {
			SocketIO.scriptLoaded = true;
		};
		console.log("appended script");
	}

	connected = false;

	static loadScript() {
		return new Promise((resolve) => {
			let interval = setInterval(() => {
				if (SocketIO.scriptLoaded) {
					clearInterval(interval);
					resolve(window.io);
				}
			});
		});
	}

	/**
	 * @type {SocketIOClient.Socket}
	 */
	socket = null;

	load() {
		return new Promise((resolve) => {
			let interval = setInterval(() => {
				if (this.connected) {
					clearInterval(interval);
					resolve();
				}
			});
		});
	}

	constructor() {
		try {
			this.socket = io(`${location.protocol}//${location.hostname}:3001`);
			console.log("starting connect event listener")
			this.socket.on('connect', () => {
				console.log("connected");
				this.connected = true;
			});
		} catch (err) {
			console.error(err);
			return;
		}
	}

}
