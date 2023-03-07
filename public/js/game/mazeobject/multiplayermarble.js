import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";
import CellAlphaReceiver from "mazescript/cellalphareceiver.js";
import CellLightSource from "mazescript/celllightsource.js";
export default class MultiPlayerMarbleTest extends MazeObject {
	/**
	 * @param {MazeEngine} mazeEngine 
	 * @param {Object} args 
	 */
	constructor(mazeEngine, args) {
		super(mazeEngine, args);
		this.name = "MultiPlayerMarbleTest" + this.id;

		this.root = new THREE.Group();

		if (!args.isPlayer) {
			let mesh = mazeEngine.gltfAssets.marbletest.getRoot();
			mesh.scale.set(3,3,3);
			mesh.rotation.set(0, Math.PI, 0);
			this.root.add(mesh);
		}

		//this.addScript(CellAlphaReceiver);
		this.addScript(CellLightSource);

		window["MultiPlayerMarbleTest"+this.id] = this;
	}
	update() {
		super.update();
	}
}
