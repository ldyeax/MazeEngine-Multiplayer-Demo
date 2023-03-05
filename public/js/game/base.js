$.LoadingOverlay('show', {background: 'rgba(255,255,255, 0.8)'});
gameCache.game = function (Scene, Maze, maze) {

	$.LoadingOverlay('hide');
	tinyLib.modal({

		id: 'start_game',

		title: 'Maze Game',
		dialog: 'modal-lg modal-dialog-centered prevent-select',

		body: $('<center>').append(
			$('<h3>').text('Welcome to Maze!'),
		),

		footer: [
			$('<button>', { class: 'btn btn-primary' }).text('Start Game').click(async function() {
				
				$('#start_game').modal('hide');
				$.LoadingOverlay('show', {background: 'rgba(255,255,255, 0.8)'});

				let width = 15;
				let height = 15;
				
				// Maze must come first
				maze.instantiate(Maze, {width: width, height: height});

				await maze.loadAssets();
				maze.start($('#canvas')[0]);
				maze.instantiate(Scene);

				$.LoadingOverlay('hide');
			
				// Insert Map into the cache
				gameCache.seed = clone(maze.seed);

				console.log(maze.asciiArt);
				console.log(tinyLog(`The map seed is ${maze.seed.join('')}`, 'game', 'map'));
				console.log(tinyLog(`Width ${maze.width}`, 'game', 'map'));
				console.log(tinyLog(`Height ${maze.height}`, 'game', 'map'));

			})
		]

	});

};
