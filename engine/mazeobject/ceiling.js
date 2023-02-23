import MazeObject from "../mazeobject.js";

export default class Ceiling extends MazeObject {
	constructor(mazeEngine) {
		super(mazeEngine);

		let SIDE = mazeEngine.SIDE;
		let height = mazeEngine.height;
		let width = mazeEngine.width;

		this.name = "Ceiling";

		this.root = mazeEngine.imageAssets.ceiling.clone();
		
		this.root.rotation.x = Math.PI * 0.5;
		this.root.position.y = SIDE * height;
		this.root.position.z = -SIDE * height * 0.5;
		this.root.position.x = SIDE * width * 0.5;
	}
}
