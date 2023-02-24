import MazeScript from "engine/mazescript.js";

/**
 * @typedef {import("engine/cell.js").default} Cell
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 * @typedef {import("engine/mazescript.js").default} MazeScript
 */

/**
 * @type {Cell[][]}
 */
let tmp_surrounding = [
	[null, null, null],
	[null, null, null],
	[null, null, null]
];

window.tmp_surrounding = tmp_surrounding;

/*
0,2  1,2  2,2
0,1  1,1  2,1
0,0  1,0  2,0
*/

/**
 * 
 * @param {Cell} cell 
 * @param {number} x 
 * @param {number} y 
 * @param {number} prevX 
 * @param {number} prevY 
 */
function tmp_recurse(cell, x, y, depth) {
	if (typeof x === 'undefined') {
		for (let _y = 0; _y < 3; _y++) {
			for (let _x = 0; _x < 3; _x++) {
				tmp_surrounding[_y][_x] = null;
			}
		}
		x = 1;
		y = 1;
		depth = 0;
	}
	// Return if this cell has been visited
	if (tmp_surrounding[y][x] != null) {
		return;
	}
	tmp_surrounding[y][x] = cell;
	if (depth == 2) {
		return;
	}
	depth++;

	if (cell.above && y < 2) {
		tmp_recurse(cell.above, x, y + 1, depth);
	}
	if (cell.below && y > 0) {
		tmp_recurse(cell.below, x, y - 1, depth);
	}
	if (cell.leftOf && x > 0) {
		tmp_recurse(cell.leftOf, x - 1, y, depth);
	}
	if (cell.rightOf && x < 2) {
		tmp_recurse(cell.rightOf, x + 1, y, depth);
	}
}

function set_values(uniformReference, value) {
	if (uniformReference == null) {
		return;
	}
	if (Array.isArray(uniformReference)) {
		// console.log("isArray:");
		// console.log(uniformReference);
		for (let i = 0; i < uniformReference.length; i++) {
			uniformReference[i].value = value;
		}
	} else {
		uniformReference.value = value;
	}
}

/**
 * @description Sets the corner lights of a plane based on the lightMapValue of surrounding cells.
 */
export default class FourCornerCellLightReceiver extends MazeScript {
	constructor(mazeEngine, args) {
		super(mazeEngine, args);
	}
	recurse(obj) {
		if (obj.userData && obj.userData.cell && obj.material) {
			/**
			 * @type {Cell}
			 */
			let cell = obj.userData.cell;

			tmp_recurse(cell);

			let topLeftCount = 1;
			let topLeftLighting = cell.lightMapValue;
			if (tmp_surrounding[2][0]) {
				topLeftCount++;
				topLeftLighting += tmp_surrounding[2][0].lightMapValue;
			}
			if (tmp_surrounding[2][1]) {
				topLeftCount++;
				topLeftLighting += tmp_surrounding[2][1].lightMapValue;
			}
			if (tmp_surrounding[1][0]) {
				topLeftCount++;
				topLeftLighting += tmp_surrounding[1][0].lightMapValue;
			}
			topLeftLighting /= topLeftCount;

			let topRightCount = 1;
			let topRightLighting = cell.lightMapValue;
			if (tmp_surrounding[2][2]) {
				topRightCount++;
				topRightLighting += tmp_surrounding[2][2].lightMapValue;
			}
			if (tmp_surrounding[2][1]) {
				topRightCount++;
				topRightLighting += tmp_surrounding[2][1].lightMapValue;
			}
			if (tmp_surrounding[1][2]) {
				topRightCount++;
				topRightLighting += tmp_surrounding[1][2].lightMapValue;
			}
			topRightLighting /= topRightCount;

			let bottomLeftCount = 1;
			let bottomLeftLighting = cell.lightMapValue;
			if (tmp_surrounding[0][0]) {
				bottomLeftCount++;
				bottomLeftLighting += tmp_surrounding[0][0].lightMapValue;
			}
			if (tmp_surrounding[1][0]) {
				bottomLeftCount++;
				bottomLeftLighting += tmp_surrounding[1][0].lightMapValue;
			}
			if (tmp_surrounding[0][1]) {
				bottomLeftCount++;
				bottomLeftLighting += tmp_surrounding[0][1].lightMapValue;
			}
			bottomLeftLighting /= bottomLeftCount;

			let bottomRightCount = 1;
			let bottomRightLighting = cell.lightMapValue;
			if (tmp_surrounding[0][2]) {
				bottomRightCount++;
				bottomRightLighting += tmp_surrounding[0][2].lightMapValue;
			}
			if (tmp_surrounding[1][2]) {
				bottomRightCount++;
				bottomRightLighting += tmp_surrounding[1][2].lightMapValue;
			}
			if (tmp_surrounding[0][1]) {
				bottomRightCount++;
				bottomRightLighting += tmp_surrounding[0][1].lightMapValue;
			}
			bottomRightLighting /= bottomRightCount;

			set_values(obj.material.userData.topLeftUniformReference, topLeftLighting);
			set_values(obj.material.userData.topRightUniformReference, topRightLighting);
			set_values(obj.material.userData.bottomLeftUniformReference, bottomLeftLighting);
			set_values(obj.material.userData.bottomRightUniformReference, bottomRightLighting);
		}

		for (let child of obj.children) {
			this.recurse(child);
		}
	}
	lateUpdate() {
		super.lateUpdate();
		this.recurse(this.mazeObject.root);
	}
}
