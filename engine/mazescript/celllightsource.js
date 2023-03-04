import CellLightManager from "engine/mazeobject/celllightmanager.js";
import MazeScript from "engine/mazescript.js";

const CELL_UP = 0;
const CELL_DOWN = 1;
const CELL_LEFT = 2;
const CELL_RIGHT = 3;
const CELL_START = 4;

/**
 * @typedef {import("engine/cell.js").default} Cell
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 * @typedef {import("engine/mazescript.js").default} MazeScript
 * @typedef {import("engine/celllightmanager.js").default} CellLightManager
 * @description Traverses the maze and adds to the lightMapValue of each cell based on distance from the mazeObject.
 */
export default class CellLightSource extends MazeScript {
	/**
	 * @type {CellLightManager}
	 */
	cellLightManager = null;

	updateLightMap() {
		let mazeEngine = this.mazeEngine;
		let gridPos = this.mazeObject.getGridPosition();
		let cellLightManager = this.cellLightManager;

		let subtraction = 1.0/8.0;
		/**
		 * @param {number} value from 0 to 1
		 */
		let recurse = function(x, y, value, bend, lastDirection) {
			if (lastDirection != CELL_START) {
				if (bend) {
					value *= 0.5;
				}

				value -= subtraction;

				if (value < 0) {
					return;
				}
			}

			let first = lastDirection == CELL_START;

			let cell = mazeEngine.cells[y][x];
			const index = y * mazeEngine.width + x;
			cellLightManager.lightCell(index, value);

			if (lastDirection != CELL_DOWN && !cell.up) {
				recurse(x, y + 1, value, !first && lastDirection != CELL_UP, CELL_UP);
			}
			if (lastDirection != CELL_UP && !cell.down) {
				recurse(x, y - 1, value, !first && lastDirection != CELL_DOWN, CELL_DOWN);
			}
			if (lastDirection != CELL_RIGHT && !cell.left) {
				recurse(x - 1, y, value, !first && lastDirection != CELL_LEFT, CELL_LEFT);
			}
			if (lastDirection != CELL_LEFT && !cell.right) {
				recurse(x + 1, y, value, !first && lastDirection != CELL_RIGHT, CELL_RIGHT);
			}
		}
		recurse(gridPos.x, gridPos.y, 1.0, false, CELL_START);
	}

	/**
	 * @param {MazeObject} mazeObject 
	 */
	constructor(mazeObject) {
		super(mazeObject);
		this.cellLightManager = this.mazeEngine.cellLightManager;
	}

	update() {
		super.update();
		this.updateLightMap();
	}
}
