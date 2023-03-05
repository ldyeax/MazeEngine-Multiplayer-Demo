gameCache.game = async function(Scene, maze) {
	
	await maze.loadAssets();
	maze.start(document.getElementById("canvas"));
	maze.instantiate(Scene);
	
	return gameCache.start(Scene, maze);

};
