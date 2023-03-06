$.LoadingOverlay('show', { background: 'rgba(255,255,255, 0.8)' });
gameCache.game = function (Scene, Maze, maze) {

	// Start Game
	const loadGame = async function () {

		// Maze
		await maze.loadAssets();
		maze.start($('#canvas')[0]);
		maze.instantiate(Scene);

		$.LoadingOverlay('hide');

		// Insert Game Instance
		gameCache.instance = maze;

		// Log
		console.log(maze.asciiArt);
		console.log(tinyLog(`The map seed is ${maze.seed.join('')}`, 'game', 'map'));
		console.log(tinyLog(`Width ${maze.width}`, 'game', 'map'));
		console.log(tinyLog(`Height ${maze.height}`, 'game', 'map'));

		// GUI
		gameCache.gui = { html: { base: $('<div>', { id: 'gui', class: 'prevent-select' }) } }
		$('body').prepend(gameCache.gui.html.base);

		// Map
		gameCache.gui.html.map = $('<div>', { id: 'map', style: 'white-space: pre;' }).css({
			'white-space': 'pre',
			'position': 'fixed',
			'bottom': '100px',
			'zoom': 0.4,
			'right': '100px',
			'background-color': '#252525',
			'padding': '30px'
		});

		gameCache.gui.html.base.append(gameCache.gui.html.map);
		gameCache.gui.html.map.text(maze.asciiArt);

	};
	const startGame = function (isMultiplayer = false, isHost = false) {

		const room_id = $('#room_id').val();
		let username = $('#your_username').val();
		$('#start_game').modal('hide');
		$.LoadingOverlay('show', { background: 'rgba(255,255,255, 0.8)' });

		// Multiplayer
		if (isMultiplayer) {

			// Host
			gameCache.isMultiplayer = true;
			if (isHost) { gameCache.room = gameCache.socket.id; gameCache.isHost = true; } else {
				gameCache.room = room_id.substring(0, 200); gameCache.isHost = false;
			}

			// Save Username
			username = username.substring(0, 30);
			if (localStorage) {
				localStorage.setItem('username', username);
			}

			// Load Game
			gameCache.socket.emit('request-map', { id: gameCache.room, username: username }, (map) => {
				if (map) {
					maze.instantiate(Maze, { width: map.width, height: map.height, seed: map.seed });
					loadGame();
				} else {
					alert('User Map not found! Please try again.');
				}
			});

		}

		// Single Player Generator
		else {
			maze.instantiate(Maze, { width: 15, height: 15 });
			loadGame();
		}

	};

	// ID
	let yourID = '';
	if (gameCache.socket && gameCache.socket.id) { yourID = gameCache.socket.id; }

	// Menu
	$.LoadingOverlay('hide');
	tinyLib.modal({

		id: 'start_game',

		title: 'Maze Game',
		dialog: 'modal-lg modal-dialog-centered prevent-select',

		body: $('<center>').append(
			$('<h3>').text('Welcome to Maze!'),
			$('<center>').append(
				$('<input>', { type: 'text', id: 'your_room_id', class: 'text-center form-control', readonly: true }).val(yourID),
				$('<input>', { type: 'text', id: 'your_username', maxlength: 30, class: 'text-center form-control', placeholder: 'Insert your username here' }).val(localStorage.getItem('username')),
				$('<input>', { type: 'text', id: 'room_id', class: 'text-center form-control', placeholder: 'Insert your friend player ID here' })
			)
		),

		footer: [

			// Multiplayer Host
			$('<button>', { class: 'btn btn-secondary' }).text('Start Game').click(function () {
				startGame(true, true);
			}),

			// Multiplayer Join
			$('<button>', { class: 'btn btn-primary' }).text('Join Game').click(function () {
				startGame(true, false);
			})

		]

	});

};
