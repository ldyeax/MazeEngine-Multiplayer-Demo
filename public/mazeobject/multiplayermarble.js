import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";
import CellAlphaReceiver from "mazescript/cellalphareceiver.js";

let mazeEngine = null;
export default class MultiPlayerMarbleTest extends MazeObject {
	/**
	 * @param {MazeEngine} mazeEngine 
	 * @param {Object} args 
	 */
	constructor(mazeEngine, args) {
		let x = args.x;
		let y = args.y;
		super(mazeEngine, args);
		this.name = "MultiPlayerMarbleTest" + this.id;

		this.root = mazeEngine.gltfAssets.marbletest.getRoot();
		this.scale = new THREE.Vector3(3, 3, 3);
		window["MultiPlayerMarbleTest"+this.id] = this;

		this.cellAlphaReceiver = this.addScript(CellAlphaReceiver);
	}
	update() {
		super.update();
	}
}
