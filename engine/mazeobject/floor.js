import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";
import CellLightReceiver from "mazescript/celllightreceiver.js";
/**
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 */
export default class Floor extends MazeObject {
	/**
	 * @param {MazeEngine} mazeEngine 
	 */
	constructor(mazeEngine) {
		super(mazeEngine);

		let SIDE = mazeEngine.SIDE;
		let HALF_SIDE = mazeEngine.HALF_SIDE;
		let height = mazeEngine.height;
		let width = mazeEngine.width;

		this.name = "Floor";
		this.root = new THREE.Group();

		window.floorMazeObject = this;

		this.scaleWithGlobalY = false;

		// #region floor cell generation
		let floorAsset = mazeEngine.imageAssets.floor;
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				let floorCell = floorAsset.clone();
				floorCell.material = floorCell.material.clone();
				
				floorCell.userData.cell = mazeEngine.cells[y][x];

				floorCell.position.x = x * SIDE + HALF_SIDE;
				floorCell.position.z = -y * SIDE - HALF_SIDE;
				floorCell.scale.set(SIDE, SIDE, 1);
				floorCell.rotation.x = -Math.PI * 0.5;
				this.root.add(floorCell);
			}
		}
		// #endregion

		this.cellLightReceiver = this.addScript(CellLightReceiver);
	}
}
