import SocketIO from './socketio.js';
import Marble from './mazeobject/multiplayermarble.js';

import TinyMultiplayerScene from './scene/tinymultiplayerscene.js';
import MazeEngine from '../../MazeEngine/engine/mazeengine.js';
import SocketHandler from './mazescript/tinygameclient_sockethandler.js';

export default class TinyGameClient {

	// #region SocketIO
	/**
	 * @type {SocketIO}
	 */
	socketIO = null;

	/**
	 * @type {SocketIOClient.Socket}
	 */
	socket = null;

	/**
	 * @type {Object.<string, any>} Property name -> hashed value
	 */
	cache = {};

	#mazeLoaded = false;
	#socketIOLoaded = false;

	load() {

		this.mazeEngine.loadAssets().then(() => {
			this.#mazeLoaded = true;
		});

		this.#loadSocketIO();

		return new Promise((resolve) => {
			let interval = setInterval(() => {
				if (this.#socketIOLoaded && this.#mazeLoaded) {
					clearInterval(interval);
					resolve();
				}
			});
		});

	}

	#loadSocketIO() {
		return new Promise((resolve) => {
			SocketIO.loadScript().then(() => {

				console.log(tinyLog('loadScript complete', 'socket'));
				this.socketIO = new SocketIO();
				this.socketIO.load().then(() => {

					const tinyThis = this;

					this.socket = this.socketIO.socket;
					this.playerId = this.socket.id;
					console.log(tinyLog(this.playerId, 'socket', 'id'));

					this.socket.on('connect', () => {
						tinyThis.playerId = tinyThis.socket.id;
						console.log(tinyLog(this.playerId, 'socket', 'id'));
					});

					// Online Users
					this.socket.on('online-users', (online) => {
						if (typeof online === 'number') {
							tinyGame.online = online;
						}
					});

					// Disconnected
					this.socket.on('disconnect', () => {
						console.log(tinyLog(`Disconnected!`, 'socket'));
						$.LoadingOverlay('show', { background: 'rgba(0,0,0, 0.5)' });
						if (tinyGame.isHost) {
							location.reload();
						}
					});

					this.socket.on('player-position', obj => {
						if (tinyGame.players[obj.id]) {

							tinyGame.players[obj.id].position = obj.data;
							if (tinyGame.players[obj.id].model) { tinyGame.players[obj.id].model.position.set(obj.data.x, obj.data.y, obj.data.z); }

						}
					});

					this.socket.on('player-scale', obj => {
						if (tinyGame.players[obj.id]) {

							tinyGame.players[obj.id].scale = obj.data;
							if (tinyGame.players[obj.id].model) { tinyGame.players[obj.id].model.scale.set(obj.data.x, obj.data.y, obj.data.z); }

						}
					});

					this.socket.on('player-rotation', obj => {
						if (tinyGame.players[obj.id]) {

							tinyGame.players[obj.id].rotation = obj.data;
							if (tinyGame.players[obj.id].model) { tinyGame.players[obj.id].model.rotation.set(obj.data.x, obj.data.y, obj.data.z); }

						}
					});

					this.socket.on('player-rotate-speed', obj => {
						if (tinyGame.players[obj.id]) {
							tinyGame.players[obj.id].model.rotateSpeed = obj.data;
						}
					});

					this.socket.on('player-join', id => {

						if (tinyGame.players[id]) { return; } else {
							tinyGame.players[id] = {};
						}

						if (id !== this.socket.id) {
							tinyGame.players[id].model = this.mazeEngine.instantiate(Marble, {
								isPlayer: id == tinyGame.playerId
							});
						}

					});

					this.socket.on('player-username', data => {
						if (tinyGame.players[data.id]) {
							tinyGame.players[data.id].username = data.username;
						}
					});

					this.socket.on('player-leave', id => {
						if (tinyGame.players[id]) {
							try {
								tinyGame.players[id].model.destroy();
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

					this.#socketIOLoaded = true;
					resolve();

				})
			});
		});
	};

	// #endregion

	// #region multiplayer game state

	/**
	 * @type {string}
	 */
	roomID = '';

	/**
	 * @type {boolean}
	 */
	isHost = false;

	/**
	 * @type {string}
	 */
	username = 'minha_pequenina_jasminha';

	/**
	 * @type {Object.<string, MazeObject>} Player ID -> Player object
	 */
	players = {}

	// #endregion

	// #region mazeengine variables
	pathRoot = '/MazeEngine';

	/**
	 * @type {MazeEngine}
	 */
	mazeEngine = null;

	/**
	 * @type {TinyMultiplayerScene}
	 */
	scene = null;
	// #endregion

	constructor(args) {

		$.LoadingOverlay('show', { background: 'rgba(255,255,255, 0.8)' });
		if (args.pathRoot) {
			this.pathRoot = args.pathRoot;
		}

		this.mazeEngine = new MazeEngine({
			pathRoot: this.pathRoot
		});

	}

	game() {
		$.LoadingOverlay('hide');
		tinyLib.modal({

			id: 'start_game',

			title: 'Maze Game',
			dialog: 'modal-lg modal-dialog-centered prevent-select',

			body: $('<center>').append(
				$('<h3>').text('Welcome to Maze!'),
				$('<center>').append(
					$('<input>', { type: 'text', id: 'your_room_id', class: 'text-center form-control', readonly: true }).val(this.playerId),
					$('<input>', { type: 'text', id: 'your_username', maxlength: 30, class: 'text-center form-control', placeholder: 'Insert your username here' }).val(localStorage.getItem('username')),
					$('<input>', { type: 'text', id: 'room_id', class: 'text-center form-control', placeholder: 'Insert your friend player ID here' })
				)
			),

			footer: [

				// Multiplayer Host
				$('<button>', { class: 'btn btn-secondary' }).text('Start Game').click(() => {
					this.#startGame1(true);
				}),

				// Multiplayer Join
				$('<button>', { class: 'btn btn-primary' }).text('Join Game').click(() => {
					this.#startGame1(false);
				})

			]

		});
	}

	#startGame1(isHost) {

		console.log(tinyLog(`#startGame1 ${isHost ? 'host' : 'client'}`, 'game'));

		$('#start_game').modal('hide');

		this.username = $('#your_username').val().substring(0, 30);
		if (window.localStorage) {
			localStorage.setItem('username', this.username);
		}

		this.isHost = isHost
		if (isHost) {
			this.roomID = this.playerId;
			console.log(tinyLog(`is host: setting room id to the player id ${this.roomID}`, 'game'));
		} else {
			this.roomID = $('#room_id').val().substring(0, 200);
			console.log(tinyLog(`is client: setting roomID to ${this.roomID}`, 'game'));
		}

		console.log(tinyLog('emitting request-map', 'socket'));

		this.socket.emit('request-map', {
			id: this.roomID,
			username: this.username
		}, (map) => {
			if (map) {
				this.#startGame2(map);
			} else {
				alert('User Map not found! Please try again.');
			}
		});

	}

	#startGame2(map) {

		console.log(tinyLog('#startGame2', 'game'));
		this.mazeEngine.start($('#canvas')[0]);

		let scene = this.scene = this.mazeEngine.instantiate(TinyMultiplayerScene, {
			tinyGameClient: this,
			map: map
		});

		this.socketHandler = scene.addScript(SocketHandler, { tinyGameClient: this });

		$.LoadingOverlay('hide');

		let maze = scene.maze;

		// Log
		console.log(maze.asciiArt);
		console.log(tinyLog(`The map seed is ${maze.seed.join('')}`, 'game', 'map'));
		console.log(tinyLog(`Width ${maze.width}`, 'game', 'map'));
		console.log(tinyLog(`Height ${maze.height}`, 'game', 'map'));

		// GUI
		this.gui = { html: { base: $('<div>', { id: 'gui', class: 'prevent-select' }) } };
		$('body').prepend(this.gui.html.base);

		// Map
		this.gui.html.map = $('<div>', { id: 'map', class: 'd-none' }).css({
			'white-space': 'pre',
			'position': 'fixed',
			'bottom': '100px',
			'zoom': 0.4,
			'right': '100px',
			'background-color': '#252525',
			'padding': '30px'
		});

		this.gui.html.base.append(tinyGame.gui.html.map);
		this.gui.html.map.text(maze.asciiArt);

	}
}
