export default class MazeScript {
	static count = 0;
	id = 0;
	mazeObject = null;
	mazeEngine = null;
	constructor(mazeObject) {
		this.id = MazeScript.count++;
		this.mazeObject = mazeObject;
		this.mazeEngine = mazeObject.mazeEngine;
	}
	update() {}
};
