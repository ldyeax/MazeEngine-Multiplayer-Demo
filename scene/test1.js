import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

import Maze from "mazeobject/maze.js";
import Player from "mazeobject/player.js";
import MazeCamera from "mazeobject/mazecamera.js";
import MarbleTest from "mazeobject/marbletest.js";
import CellLightManager from "engine/mazeobject/celllightmanager.js";
import CellLightSource from "engine/mazescript/celllightsource.js";

export default class TestScene1 extends MazeObject {
	constructor(mazeEngine, args) {
		super(mazeEngine, args);

		let HALF_SIDE = mazeEngine.HALF_SIDE;

		this.name = "Test Scene 1";

		let scene = mazeEngine.scene;

		// Maze must come first
		mazeEngine.instantiate(Maze, {width: 8, height: 8});

		let pointLight = window.pointLight = new THREE.PointLight(0xFFFFFF);
		pointLight.position.set(HALF_SIDE, HALF_SIDE, -HALF_SIDE);
		pointLight.intensity = 1;
		pointLight.castShadow = true;
		pointLight.receiveShadow = true;
		pointLight.shadow.camera.far = Infinity;
		scene.add(pointLight);

		// add scene light
		let ambientLight = new THREE.AmbientLight(0xFFFFFF);
		ambientLight.intensity = 1;
		scene.add(ambientLight);

		mazeEngine.instantiate(CellLightManager);

		mazeEngine.cameraMazeObject = this.cameraMazeObject = mazeEngine.instantiate(MazeCamera);
		let player = mazeEngine.player = this.player = mazeEngine.instantiate(Player);
		player.addScript(CellLightSource);
		
		mazeEngine.instantiate(MarbleTest, {x:0, y:0});
		mazeEngine.instantiate(MarbleTest, {x:1, y:0});
		mazeEngine.instantiate(MarbleTest, {x:0, y:1});
	}
}
