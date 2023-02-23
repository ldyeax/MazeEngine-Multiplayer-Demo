import * as THREE from "three";

export default class MazeObject {
	static count = 0;

	mazeEngine = null;

	name = "";

	position = new THREE.Vector3();
	lastPosition = new THREE.Vector3();
	rotation = new THREE.Vector3();
	scale = new THREE.Vector3(1, 1, 1);

	// mesh / gltf scene
	root = null;

	scripts = [];

	addedToScene = false;
	destroyed = false;

	id = 0;

	scaleWithGlobalY = true;

	constructor(mazeEngine) {
		this.id = MazeObject.count++;
		this.mazeEngine = mazeEngine;
	}

	update() {
		this.lastPosition = this.position.clone();
	}
	updateScripts() {
		for (let script of this.scripts) {
			script.update();
		}
	}
	addScript(scriptClass) {
		let ret = new scriptClass(this);
		this.scripts.push(ret);
		return ret;
	}
	getGridPosition() {
		return new THREE.Vector2(
			Math.floor(this.position.x * this.mazeEngine.INV_SIDE),
			Math.floor(this.position.z * this.mazeEngine.INV_SIDE_NEGATIVE)
		);
	}
	destroy() {
		destroyed = true;
	}
}
