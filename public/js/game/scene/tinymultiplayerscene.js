import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

import Player from "mazeobject/player.js";
import MazeCamera from "mazeobject/mazecamera.js";
import CellLightManager from "engine/mazeobject/celllightmanager.js";
import CellLightSource from "engine/mazescript/celllightsource.js";
import Maze from "mazeobject/maze.js";

/**
 * @typedef {import("../tinygameclient.js").default} TinyGameClient
 */
export default class TinyMultiplayerScene extends MazeObject {
	/**
	 * @type {TinyGameClient}
	 */
	tinyGameClient = null;

	map = null;

	/**
	 * @type {Maze}
	 */
	maze = null;

	/**
	 * 
	 * @param {MazeEngine} mazeEngine 
	 * @param {Object} args 
	 */
	constructor(mazeEngine, args) {
		super(mazeEngine, args);

		this.name = "Tiny Multiplayer Scene";

		if (args.tinyGameClient) {
			this.tinyGameClient = args.tinyGameClient;
		} else {
			console.error("TinyMultiplayerScene requires tinyGameClient");
		}

		if (args.map) {
			this.map = args.map;
		} else {
			console.error("TinyMultiplayerScene requires map");
		}

		let map = this.map;

		this.maze = mazeEngine.instantiate(
			Maze, 
			{
				width: map.width, 
				height: map.height, 
				seed: map.seed 
			}
		);

		mazeEngine.instantiate(CellLightManager);

		mazeEngine.cameraMazeObject = this.cameraMazeObject = mazeEngine.instantiate(MazeCamera);

		let player = mazeEngine.player = this.player = mazeEngine.instantiate(Player);
		player.addScript(CellLightSource);
	}
}
