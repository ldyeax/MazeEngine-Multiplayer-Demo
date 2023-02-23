import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

export default class Floor extends MazeObject {
	constructor(mazeEngine) {
		super(mazeEngine);

		let SIDE = mazeEngine.SIDE;
		let height = mazeEngine.height;
		let width = mazeEngine.width;

		// console.log(`floor: ${width}, ${height}`);

		this.name = "Floor";
		
		this.root = mazeEngine.imageAssets.floor.clone();

		// this.root.material.map.wrapS = THREE.RepeatWrapping;
		// this.root.material.map.wrapT = THREE.RepeatWrapping;
		// this.root.material.map.repeat.set(width, height);

		this.rotation.x = -Math.PI * 0.5;	

		this.position.y = 0;
		this.position.z = -SIDE * height * 0.5;
		this.position.x = SIDE * width * 0.5;

		this.scaleWithGlobalY = false;

		this.scale.set(width * SIDE, height * SIDE, 1);
	}
}
