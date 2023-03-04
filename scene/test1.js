import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

import Maze from "mazeobject/maze.js";
import Player from "mazeobject/player.js";
import MazeCamera from "mazeobject/mazecamera.js";
import MarbleTest from "mazeobject/marbletest.js";
import CellLightManager from "engine/mazeobject/celllightmanager.js";
import CellLightSource from "engine/mazescript/celllightsource.js";

import marbleTest from "engine/test/marbletest.js";

export default class TestScene1 extends MazeObject {
	constructor(mazeEngine, args) {
		super(mazeEngine, args);

		let HALF_SIDE = mazeEngine.HALF_SIDE;

		this.name = "Test Scene 1";

		let scene = mazeEngine.scene;

		let width = 2;
		let height = 2;
		// Maze must come first
		mazeEngine.instantiate(Maze, {width: width, height: height});

		// let ambientLight = new THREE.AmbientLight(0xFFFFFF);
		// ambientLight.intensity = 1;
		// scene.add(ambientLight);

		mazeEngine.cameraMazeObject = this.cameraMazeObject = mazeEngine.instantiate(MazeCamera, {fov: 90});
		let player = mazeEngine.player = this.player = mazeEngine.instantiate(Player);
		player.addScript(CellLightSource);
		
		//mazeEngine.instantiate(MarbleTest, {x:0, y:1});
		// for (let y = 0; y < height; y++) {
		// 	for (let x = 0; x < width; x++) {
		// 		mazeEngine.instantiate(MarbleTest, {x:x, y:y});
		// 	}
		// }
	}
}
