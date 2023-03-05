gameCache.game = function (Scene, maze) {

	tinyLib.modal({

		id: 'start_game',

		title: 'Maze Game',
		dialog: 'modal-lg',

		body: $('<center>').append(
			$('<h3>').text('Welcome to Maze!'),
		),

		footer: [
			$('<button>', { class: 'btn btn-primary' }).text('Start Game').click(async function() {
				
				$('#start_game').modal('hide');
				$.LoadingOverlay('show', {background: 'rgba(0,0,0, 0.5)'});

				await maze.loadAssets();
				maze.start($('#canvas')[0]);
				maze.instantiate(Scene);

				$.LoadingOverlay('hide');
			
				return gameCache.start(Scene, maze);

			})
		]

	});

};
