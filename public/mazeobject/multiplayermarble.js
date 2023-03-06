import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";
export default class MultiPlayerMarbleTest extends MazeObject {
	/**
	 * @param {MazeEngine} mazeEngine 
	 * @param {Object} args 
	 */
	constructor(mazeEngine, args) {
		super(mazeEngine, args);
		this.name = "MultiPlayerMarbleTest" + this.id;

		this.root = new THREE.Group();

		this.root.add(mazeEngine.gltfAssets.marbletest.getRoot());

		let pointLight = new THREE.PointLight(0xffffff, 1, 0, 2);
		pointLight.position.set(0, 0, 0);
		this.root.add(pointLight);

		this.scale = new THREE.Vector3(3, 3, 3);
		window["MultiPlayerMarbleTest"+this.id] = this;
	}
	update() {
		super.update();
	}
}
