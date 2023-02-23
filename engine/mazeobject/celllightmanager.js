import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

export default class CellLightManager extends MazeObject {
	constructor(mazeEngine, args) {
		super(mazeEngine, args);
	}
	preUpdate() {
		super.preUpdate();
		
		let mazeEngine = this.mazeEngine;

		for (let y = 0; y < mazeEngine.height; y++) {
			for (let x = 0; x < mazeEngine.width; x++) {
				mazeEngine.cells[y][x].lightMapValue = 0;
			}
		}
	}
}
