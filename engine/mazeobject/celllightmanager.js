import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";
import Cell from "engine/cell.js";
/*
preupdate: set clear all cell lighting
update: set primary cell values
update2: set corner cell values
lateupdate: each mesh writes to its own shader
*/

const BITS = 32;
const LLLL_MASK          = 0b00001111000000000000000000000000;
const INV_LLLL_MASK      = 0b11110000111111111111111111111111;

const UP_MASK            = 0b10000000000000000000000000000000;
const DOWN_MASK          = 0b01000000000000000000000000000000;
const LEFT_MASK          = 0b00100000000000000000000000000000;
const RIGHT_MASK         = 0b00010000000000000000000000000000;
const UDLR_MASK          = 0b11110000000000000000000000000001;
//                           udlrLLLLTLTLTRTRDRDRDLDLxxxxxxx1
const TLTL_MASK          = 0b00000000111100000000000000000000;
const TRTR_MASK          = 0b00000000000011110000000000000000;
const DRDR_MASK          = 0b00000000000000001111000000000000;
const DLDL_MASK          = 0b00000000000000000000111100000000;

const TLTL_SET           = 0b00000000000000000000000010000000;
const TRTR_SET           = 0b00000000000000000000000001000000;
const DRDR_SET           = 0b00000000000000000000000000100000;
const DLDL_SET           = 0b00000000000000000000000000010000;


const LLLL_SHIFT = 24;
const TLTL_TO_LLLL = 4;
const TRTR_TO_LLLL = 8;
const DRDR_TO_LLLL = 12;
const DLDL_TO_LLLL = 16;
const INVFLOAT_LLLL_MASK = 1.0 / parseFloat(LLLL_MASK);
const INVFLOAT_TLTL_MASK = 1.0 / parseFloat(TLTL_MASK);
const INVFLOAT_TRTR_MASK = 1.0 / parseFloat(TRTR_MASK);
const INVFLOAT_DRDR_MASK = 1.0 / parseFloat(DRDR_MASK);
const INVFLOAT_DLDL_MASK = 1.0 / parseFloat(DLDL_MASK);

window.BITS = BITS;
window.LLLL_MASK = LLLL_MASK;
window.INV_LLLL_MASK = INV_LLLL_MASK;
window.UP_MASK = UP_MASK;
window.DOWN_MASK = DOWN_MASK;
window.LEFT_MASK = LEFT_MASK;
window.RIGHT_MASK = RIGHT_MASK;
window.UDLR_MASK = UDLR_MASK;
window.TLTL_MASK = TLTL_MASK;
window.TRTR_MASK = TRTR_MASK;
window.DRDR_MASK = DRDR_MASK;
window.DLDL_MASK = DLDL_MASK;
window.TLTL_SET = TLTL_SET;
window.TRTR_SET = TRTR_SET;
window.DRDR_SET = DRDR_SET;
window.DLDL_SET = DLDL_SET;
window.LLLL_SHIFT = LLLL_SHIFT;
window.TLTL_TO_LLLL = TLTL_TO_LLLL;
window.TRTR_TO_LLLL = TRTR_TO_LLLL;
window.DRDR_TO_LLLL = DRDR_TO_LLLL;
window.DLDL_TO_LLLL = DLDL_TO_LLLL;
window.INVFLOAT_LLLL_MASK = INVFLOAT_LLLL_MASK;
window.INVFLOAT_TLTL_MASK = INVFLOAT_TLTL_MASK;
window.INVFLOAT_TRTR_MASK = INVFLOAT_TRTR_MASK;
window.INVFLOAT_DRDR_MASK = INVFLOAT_DRDR_MASK;
window.INVFLOAT_DLDL_MASK = INVFLOAT_DLDL_MASK;

function runTestCases() {
	//                udlrLLLLtltlTRTRdrdrDLDLxxxxxxx1
	let lightCell = 0b11110110010000100001110000000001;

	let mazeCell = new Cell();
	window.clmTestMazeCell = mazeCell;
	mazeCell.up = mazeCell.down = mazeCell.left = mazeCell.right = true;

	mazeCell.lightMapValue = (lightCell & LLLL_MASK) * INVFLOAT_LLLL_MASK;
	mazeCell.topLeftLight = (lightCell & TLTL_MASK) * INVFLOAT_TLTL_MASK;
	mazeCell.topRightLight = (lightCell & TRTR_MASK) * INVFLOAT_TRTR_MASK;
	mazeCell.bottomRightLight = (lightCell & DRDR_MASK) * INVFLOAT_DRDR_MASK;
	mazeCell.bottomLeftLight = (lightCell & DLDL_MASK) * INVFLOAT_DLDL_MASK;

	console.assert(Math.abs(mazeCell.lightMapValue - 6/15) < 0.0001);
	console.assert(Math.abs(mazeCell.topLeftLight - 4/15) < 0.0001);
	console.assert(Math.abs(mazeCell.topRightLight - 2/15) < 0.0001);
	console.assert(Math.abs(mazeCell.bottomRightLight - 1/15) < 0.0001);
	console.assert(Math.abs(mazeCell.bottomLeftLight - 12/15) < 0.0001);

	let existingCell = lightCell;
	let existingLLLL = (existingCell & LLLL_MASK) >> LLLL_SHIFT;
	console.assert(existingLLLL == 6);
	let value = 0.5;
	let newLLLL = parseInt(0b1111 * value) >>> 0;
	console.assert(newLLLL == 7);
	newLLLL = Math.max(existingLLLL, newLLLL);
	console.assert(newLLLL == 7);

	existingCell = (existingCell & INV_LLLL_MASK) | (newLLLL << LLLL_SHIFT) >>> 0;
	console.assert(existingCell == (0b11110111010000100001110000000001 >>> 0));
	if (existingCell != (0b11110111010000100001110000000001 >>> 0)) {
		console.log("===");
		console.log("existingCell:");
		console.log(fmt(existingCell));
		console.log("===");
		console.log("expected:");
		console.log(fmt(0b11110111010000100001110000000001 >>> 0));
		console.log("===");
		console.log(existingCell);
		console.log(0b11110111010000100001110000000001 >>> 0);
	}

	console.log("CellLightManager tests concluded");
}

runTestCases();

function fmt(b) {
	let s = (b >>> 0).toString(2);
	while (s.length != 32) {
		s = "0" + s;
	}
	let log = "";
	log += s.substring(0, 4) + " ";
	log += s.substring(4, 8) + " ";
	log += s.substring(8, 12) + " ";
	log += s.substring(12, 16) + " ";
	log += s.substring(16, 20) + " ";
	log += s.substring(20, 24) + " ";
	log += s.substring(24, 28) + " ";
	log += s.substring(28, 32);
	return log;
}
function fmt2(b) {
	return "udlr LLLL TLTL TRTR DRDR DLDL xxxx xxxx" + "\n" + fmt(b);
}

/**
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 * @typedef {import("engine/mazescript.js").default} MazeScript
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 * @typedef {import("engine/cell.js").default} Cell
 */
export default class CellLightManager extends MazeObject {

	/**
	 * @type {Uint32Array}
	 * @description udlr LLLL TLTL TRTR DRDR DLDL xxxx xxxx
	 */
	cells = null;

	/**
	 * @param {MazeEngine} mazeEngine 
	 * @param {Object} args 
	 */
	constructor(mazeEngine, args) {
		super(mazeEngine, args);
		let length = mazeEngine.width * mazeEngine.height;
		this.cells = new Uint32Array(length);
		for (let i = 0; i < length; i++) {
			let cell = mazeEngine.cellsFlat[i];
			// Flag to indicate cell exists
			let c = 1;
			if (cell.down) {
				c |= DOWN_MASK;
			}
			if (cell.up) {
				c |= UP_MASK;
			}
			if (cell.left) {
				c |= LEFT_MASK;
			}
			if (cell.right) {
				c |= RIGHT_MASK;
			}
			this.cells[i] = c;
		}
		window.clm = this;
		window.pclm = function(i) {
			let cell = window.clm.cells[i];
			console.log("udlr LLLL TLTL TRTR DRDR DLDL xxxx xxxx");
			console.log(fmt(cell));
		}
	}
	preUpdate() {
		super.preUpdate();
		for (let i = 0; i < this.cells.length; i++) {
			this.cells[i] &= UDLR_MASK;
		}
	}
	update() {
		super.update();
		// CellLightSource uses update on any MazeObject it's attached to
	}
	update2() {
		super.update2();
		// LLLL has been set by this point; need to set AAAA BBBB etc
		let mazeEngine = this.mazeEngine;
		let height = mazeEngine.height;
		let width = mazeEngine.width;

		let cell1 = 0;
		let cell2 = 0;
		let cell3 = 0;
		let cell4 = 0;
		let tmp = 0;
		let count = 0;

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				cell1 = this.cells[y * width + x];

				// #region top left corner
				cell2 = cell3 = cell4 = 0;
				count = 1;

				// 0 indicates the wall is knocked down
				if (0 === (cell1 & UP_MASK)) {
					// cell2 is above
					cell2 = this.cells[(y + 1) * width + x];
				}
				if (0 === (cell1 & LEFT_MASK)) {
					// cell3 is left
					cell3 = this.cells[y * width + x - 1];
				}
				if (0 === (cell2 & LEFT_MASK) || 0 === (cell3 & UP_MASK)) {
					// cell4 is above and left
					cell4 = this.cells[(y - 1) * width + x - 1];
				}

				tmp = cell1 & LLLL_MASK;
				if (cell2) {
					tmp += cell2 & LLLL_MASK;
					count++;
				}
				if (cell3) {
					tmp += cell3 & LLLL_MASK;
					count++;
				}
				if (cell4) {
					tmp += cell4 & LLLL_MASK;
					count++;
				}

				tmp = parseInt(tmp / count);
				window["tmpdiv_" + x + "_" + y] = tmp;
				tmp &= LLLL_MASK;
				tmp >>= 4;
				cell1 |= tmp;
				// tmp >>= 4;
				// cell1 |= tmp;
				// tmp >>= 4;
				// cell1 |= tmp;
				// tmp >>= 4;
				// cell1 |= tmp;
				// #endregion

				// // #region top left corner
				// cell2 = cell3 = cell4 = 0;
				// count = 1;

				// // 0 indicates the wall is knocked down
				// if (0 === (cell1 & UP_MASK)) {
				// 	// cell2 is above
				// 	cell2 = this.cells[(y + 1) * width + x];
				// }
				// // check for existing bottom left value of above cell
				// // even if the light is zero, this value will have the "cell exists" flag from above if it points to a cell
				// if (tmp = (cell2 & DLDL_MASK)) {
				// 	tmp <<= DLDL_TO_LLLL;
				// } else {
				// 	if (0 === (cell1 & LEFT_MASK)) {
				// 		// cell3 is left
				// 		cell3 = this.cells[y * width + x - 1];
				// 	}
				// 	// check for existing top right value of left cell
				// 	if (tmp = (cell3 & TRTR_MASK)) {
				// 		tmp <<= TRTR_TO_LLLL;
				// 	} else {
				// 		if (0 === (cell2 & LEFT_MASK) || 0 === (cell3 & UP_MASK)) {
				// 			// cell4 is above and left
				// 			cell4 = this.cells[(y - 1) * width + x - 1];
				// 		}
				// 		// check for existing bottom right value of above and left cell
				// 		if (tmp = (cell4 & DRDR_MASK)) {
				// 			tmp <<= DRDR_TO_LLLL;
				// 		} else {
				// 			tmp = cell1 & LLLL_MASK;
				// 			if (cell2) {
				// 				tmp += cell2 & LLLL_MASK;
				// 				count++;
				// 			}
				// 			if (cell3) {
				// 				tmp += cell3 & LLLL_MASK;
				// 				count++;
				// 			}
				// 			if (cell4) {
				// 				tmp += cell4 & LLLL_MASK;
				// 				count++;
				// 			}
				// 			window["tmp_" + x + "_" + y + "_a"] = fmt2(tmp) + "\n" + "count = " + count;
				// 			tmp = parseInt(tmp / count);
				// 			window["tmp_" + x + "_" + y + "_b"] = fmt2(tmp);
				// 		}
				// 	}
				// }
				// // shift over to TLTL position
				// window["tmp_" + x + "_" + y + "_0"] = fmt2(tmp);
				// tmp &= LLLL_MASK;
				// window["tmp_" + x + "_" + y + "_1"] = fmt2(tmp);
				// tmp >>= 4;
				// window["tmp_" + x + "_" + y + "_2"] = fmt2(tmp);
				// cell1 |= tmp;
				// // #endregion

				this.cells[y * width + x] = cell1;
			}
		}

		/**
		 * @type {Cell[]}
		 */
		let cellsFlat = this.mazeEngine.cellsFlat;
		for (let i = 0; i < this.cells.length; i++) {
			let lightCell = this.cells[i];
			let mazeCell = cellsFlat[i];
			mazeCell.lightMapValue = (lightCell & LLLL_MASK) * INVFLOAT_LLLL_MASK;
			mazeCell.topLeftLight = (lightCell & TLTL_MASK) * INVFLOAT_TLTL_MASK;
			mazeCell.topRightLight = (lightCell & TRTR_MASK) * INVFLOAT_TRTR_MASK;
			mazeCell.bottomLeftLight = (lightCell & DLDL_MASK) * INVFLOAT_DLDL_MASK;
			mazeCell.bottomRightLight = (lightCell & DRDR_MASK) * INVFLOAT_DRDR_MASK;
		}
	}
	/**
	 * @param {number} index 
	 * @param {number} value from 0 to 1
	 */
	lightCell(index, value) {
		let existingCell = this.cells[index];
		let existingLLLL = (existingCell & LLLL_MASK) >> LLLL_SHIFT;
		window["existingLLLL_" + index] = dec2bin(existingLLLL, 4);
		let newLLLL = parseInt(0b1111 * value) >>> 0;
		window["newLLLL_" + index] = dec2bin(newLLLL, 4) + " from " + value;
		newLLLL = Math.max(existingLLLL, newLLLL);

		window["Land_" + index] = fmt2(existingCell & INV_LLLL_MASK, 32);
		window["Lshift_" + index] = fmt2(newLLLL << LLLL_SHIFT, 32);
		window["Lcell_" + index] = fmt2((existingCell & INV_LLLL_MASK) | (newLLLL << LLLL_SHIFT), 32);

		this.cells[index] = (existingCell & INV_LLLL_MASK) | (newLLLL << LLLL_SHIFT);
	}
}
