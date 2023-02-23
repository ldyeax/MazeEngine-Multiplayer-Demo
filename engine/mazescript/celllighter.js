import MazeScript from "engine/mazescript.js";

const CELL_UP = 0;
const CELL_DOWN = 1;
const CELL_LEFT = 2;
const CELL_RIGHT = 3;
const CELL_START = 4;

export default class CellLighter extends MazeScript {
	// /**
	//  * @type {string}
	//  */
	// lightString = "";

	updateLightMap() {
		let mazeEngine = this.mazeEngine;

		let gridPos = this.mazeObject.getGridPosition();

		let subtraction = 1.0/8.0;
		let recurse = function(x, y, value, bend, lastDirection) {
			if (lastDirection != CELL_START) {
				value -= subtraction;
				if (bend) {
					value *= 0.5;
				}

				if (value < 0) {
					return;
				}
			}

			let first = lastDirection == CELL_START;

			let cell = mazeEngine.cells[y][x];
			cell.lightMapValue = Math.max(cell.lightMapValue, value);

			if (lastDirection != CELL_DOWN && !cell.up) {
				recurse(x, y + 1, value, !first && lastDirection == CELL_UP, CELL_UP);
			}
			if (lastDirection != CELL_UP && !cell.down) {
				recurse(x, y - 1, value, !first && lastDirection == CELL_DOWN, CELL_DOWN);
			}
			if (lastDirection != CELL_RIGHT && !cell.left) {
				recurse(x - 1, y, value, !first && lastDirection == CELL_LEFT, CELL_LEFT);
			}
			if (lastDirection != CELL_LEFT && !cell.right) {
				recurse(x + 1, y, value, !first && lastDirection == CELL_RIGHT, CELL_RIGHT);
			}
		}
		recurse(gridPos.x, gridPos.y, 1.0, false, CELL_START);

		// this.lightString = "";
		// for (let y = mazeEngine.height - 1; y >= 0; y--) {
		// 	for (let x = 0; x < mazeEngine.width; x++) {
		// 		let cell = mazeEngine.cells[y][x];
		// 		this.lightString += cell.lightMapValue.toFixed(2) + " ";
		// 	}
		// 	this.lightString += "\n";
		// }
	}

	constructor(mazeObject) {
		super(mazeObject);
	}

	update() {
		super.update();
		let ls1 = this.lightString;
		this.updateLightMap();
		// if (this.lightString != ls1) {
		// 	console.log("===lightmap changed===");
		// 	console.log(this.lightString);
		// 	console.log("===end lightmap changed===");
		// }
	}
}
