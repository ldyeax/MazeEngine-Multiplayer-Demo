import * as THREE from '../../three/Three.js';
import MazeObject from '../mazeobject.js';

export default class MazeCamera extends MazeObject {
	constructor(mazeEngine) {
		super(mazeEngine);
		let SIDE = mazeEngine.SIDE;

		this.name = "Main Camera";

		let camera = window.camera = mazeEngine.camera = 
			new THREE.PerspectiveCamera(
				45, 
				mazeEngine.canvasWidth / mazeEngine.canvasHeight, 
				0.1, 
				10000
			);

		camera.position.x = 0.5 * SIDE;
		camera.position.y = 0.5 * SIDE;
		camera.position.z = -0.5 * SIDE;

		camera.rotation.x = 0;
		camera.rotation.y = 0;
		camera.rotation.z = 0;

		this.root = camera;

		this.scaleWithGlobalY = false;
	}

	update() {
		super.update();
		// let player = this.mazeEngine.player;

		// let position = this.mazeEngine.player.position.clone();
		// position.y = 0.5 * this.mazeEngine.SIDE;
		// this.position = position;
		// this.rotation = player.rotation;
	}
};
