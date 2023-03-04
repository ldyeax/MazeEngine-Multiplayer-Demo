import generateMaze from "engine/generatemaze.js";
import MazeObject from "engine/mazeobject.js";

import Ceiling from "mazeobject/ceiling.js";
import Walls from "mazeobject/walls.js";
import Floor from "mazeobject/floor.js";

import CellLightManager from "mazeobject/celllightmanager.js";

/**
 * @typedef {import("engine/mazeobject.js").default} MazeObject
 * @typedef {import("engine/mazescript.js").default} MazeScript
 * @typedef {import("engine/mazeengine.js").default} MazeEngine
 * @typedef {import("engine/cell.js").default} Cell
 * @typedef {import("engine/celllightmanager.js").default} CellLightManager
 */
export default class Maze extends MazeObject {
	/**
	 * @param {MazeEngine} mazeEngine 
	 * @param {Object} args 
	 */
	constructor(mazeEngine, args) {
		super(mazeEngine, args);

		// console.log(`Instantiating Maze: ${JSON.stringify(args)}`);

		let width = this.width = mazeEngine.width = args.width;
		let height = this.height = mazeEngine.height = args.height;

		mazeEngine.cells = this.cells = generateMaze(width, height);
		mazeEngine.cellsFlat = [];
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				mazeEngine.cellsFlat.push(mazeEngine.cells[y][x]);
			}
		}

		mazeEngine.cellLightManager = mazeEngine.instantiate(CellLightManager);

		mazeEngine.ceilingMazeObject = this.ceilingMazeObject = mazeEngine.instantiate(Ceiling);
		mazeEngine.wallsMazeObject = this.wallsMazeObject = mazeEngine.instantiate(Walls);
		mazeEngine.floorMazeObject = this.floorMazeObject = mazeEngine.instantiate(Floor);
	}
}
