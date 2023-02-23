import MazeObject from "../mazeobject.js";

export default class Floor extends MazeObject {
	constructor(mazeEngine) {
		super(mazeEngine);

		let SIDE = mazeEngine.SIDE;
		let height = mazeEngine.height;
		let width = mazeEngine.width;

		this.name = "Floor";
		
		this.root = mazeEngine.imageAssets.floor.clone();
		this.root.rotation.x = -Math.PI * 0.5;	
		this.root.position.y = 0;
		this.root.position.z = -SIDE * height * 0.5;
		this.root.position.x = SIDE * width * 0.5;
	}
}
