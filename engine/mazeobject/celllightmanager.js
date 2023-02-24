import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

/**
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 * @typedef {import("engine/mazescript.js").default} MazeScript
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 * @typedef {import("engine/cell.js").default} Cell
 */
export default class CellLightManager extends MazeObject {
	constructor(mazeEngine, args) {
		super(mazeEngine, args);
	}
	preUpdate() {
		super.preUpdate();
		
		/**
		 * @type {MazeEngine}
		 */
		let mazeEngine = this.mazeEngine;
		if (!mazeEngine.cells || mazeEngine.cells.length === 0) {
			return;
		}
		for (let y = 0; y < mazeEngine.height; y++) {
			for (let x = 0; x < mazeEngine.width; x++) {
				mazeEngine.cells[y][x].clearLighting();
			}
		}
	}
}
