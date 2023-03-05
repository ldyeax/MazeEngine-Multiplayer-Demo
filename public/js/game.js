gameCache.game = async function(Scene, maze) {
	
	await maze.loadAssets();
	maze.start($('#canvas')[0]);
	maze.instantiate(Scene);
	
	return gameCache.start(Scene, maze);

};
