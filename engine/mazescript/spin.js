import MazeScript from '../mazescript.js';
export default class Spin extends MazeScript {
	constructor(mazeObject) {
		super(mazeObject);
		this.speed = 1;
	}
	update() {
		this.mazeObject.rotation.y += this.speed * this.mazeEngine.deltaTime;
	}
}
