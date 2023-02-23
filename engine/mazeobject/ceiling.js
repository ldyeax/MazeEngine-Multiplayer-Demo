import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

export default class Ceiling extends MazeObject {
	constructor(mazeEngine) {
		super(mazeEngine);

		let SIDE = mazeEngine.SIDE;
		let height = mazeEngine.height;
		let width = mazeEngine.width;

		this.name = "Ceiling";

		this.root = mazeEngine.imageAssets.ceiling.clone();

		this.root.material.map.wrapS = THREE.RepeatWrapping;
		this.root.material.map.wrapT = THREE.RepeatWrapping;
		this.root.material.map.repeat.set(width, height);
		
		this.rotation.x = Math.PI * 0.5;
		
		this.position.y = SIDE;
		this.position.z = -SIDE * height * 0.5;
		this.position.x = SIDE * width * 0.5;

		this.scale.set(width * SIDE, height * SIDE, 1);

		this.scaleWithGlobalY = false;
	}
}
