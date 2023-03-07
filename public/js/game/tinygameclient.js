import SocketIO from './socketio.js';

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
				console.log('loadScript complete');
				this.socketIO = new SocketIO();
				this.socketIO.load().then(() => {
					this.socket = this.socketIO.socket;
					this.socketID = this.socket.id;
					console.log(`Socket ID: ${this.socketID}`)
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
	serverID = '';

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
					$('<input>', { type: 'text', id: 'your_room_id', class: 'text-center form-control', readonly: true }).val(this.socketID),
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

		console.log(`#startGame1 ${isHost ? 'host' : 'client'}`);

		$('#start_game').modal('hide');

		this.username = $('#your_username').val().substring(0, 30);
		if (window.localStorage) {
			localStorage.setItem('username', this.username);
		}

		this.isHost = isHost
		if (isHost) {
			this.roomID = this.socketID;
			console.log(`is host: setting roomID to socketID ${this.roomID}`);
		} else {
			this.roomID = $('#room_id').val().substring(0, 200);
			console.log(`is client: setting roomID to ${this.roomID}`);
		}

		console.log('emitting request-map');

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

		console.log('#startGame2');
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
