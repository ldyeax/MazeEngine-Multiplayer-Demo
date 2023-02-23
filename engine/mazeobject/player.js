import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

const KEY_ACTIONS = {
	FORWARD: 1,
	BACKWARD: 2,
	LEFT: 3,
	RIGHT: 4,
};

export default class Player extends MazeObject {
	static #STATE = {
		WAITING_FOR_GAME_START: -1,
		IDLE: 0,
		FLIPPING: 1,
	};

	moveSpeed = 0;
	rotateSpeed = Math.PI / 2;

	#checkCollision() {
		let oldPosition = this.lastPosition;
		let newPosition = oldPosition.clone();

		newPosition.x = this.position.x;
		if (this.mazeEngine.isCollidingWithWalls(newPosition)) {
			newPosition.x = oldPosition.x;
		}

		newPosition.z = this.position.z;
		if (this.mazeEngine.isCollidingWithWalls(newPosition)) {
			newPosition.z = oldPosition.z;
		}

		this.position.x = newPosition.x;
		this.position.z = newPosition.z;
	}

	constructor(mazeEngine, args) {
		super(mazeEngine, args);
		this.name = "Player";
		this.root = null;

		this.moveSpeed = mazeEngine.SIDE * 2;

		this.state = Player.#STATE.WAITING_FOR_GAME_START;

		this.currentPosition = new THREE.Vector2(0, 0);

		this.position.x = mazeEngine.SIDE * 0.5;
		this.position.z = mazeEngine.SIDE * -0.5;
		this.position.y = 0;
		this.lastPosition = this.position.clone();

		this.scaleWithGlobalY = false;
	}

	static #CELL_UP = 0;
	static #CELL_DOWN = 1;
	static #CELL_LEFT = 2;
	static #CELL_RIGHT = 3;
	static #CELL_START = 4;

	updateLightMap() {
		let mazeEngine = this.mazeEngine;

		let gridPos = this.getGridPosition();
		for (let y = 0; y < mazeEngine.height; y++) {
			for (let x = 0; x < mazeEngine.width; x++) {
				mazeEngine.cells[y][x].lightMapValue = 0.1;
			}
		}
		let subtraction = 1.0/8.0;
		let recurse = function(x, y, value, bend, lastDirection) {
			if (lastDirection != Player.#CELL_START) {
				value -= subtraction;
				if (bend) {
					value *= 0.5;
				}

				if (value < 0) {
					return;
				}
			}

			let cell = mazeEngine.cells[y][x];
			cell.lightMapValue = Math.max(cell.lightMapValue, value);

			if (lastDirection != Player.#CELL_DOWN && !cell.up) {
				recurse(x, y + 1, value, lastDirection == Player.#CELL_UP, Player.#CELL_UP);
			}
			if (lastDirection != Player.#CELL_UP && !cell.down) {
				recurse(x, y - 1, value, lastDirection == Player.#CELL_DOWN, Player.#CELL_DOWN);
			}
			if (lastDirection != Player.#CELL_RIGHT && !cell.left) {
				recurse(x - 1, y, value, lastDirection == Player.#CELL_LEFT, Player.#CELL_LEFT);
			}
			if (lastDirection != Player.#CELL_LEFT && !cell.right) {
				recurse(x + 1, y, value, lastDirection == Player.#CELL_RIGHT, Player.#CELL_RIGHT);
			}
		}
		recurse(gridPos.x, gridPos.y, 1.0, false, Player.#CELL_START);
	}

	update() {
		super.update();

		let mazeEngine = this.mazeEngine;

		if (this.mazeEngine.isDown(KEY_ACTIONS.LEFT)) {
			this.rotation.y += this.rotateSpeed * mazeEngine.deltaTime;
		}
		if (this.mazeEngine.isDown(KEY_ACTIONS.RIGHT)) {
			this.rotation.y -= this.rotateSpeed * mazeEngine.deltaTime;
		}
		if (this.mazeEngine.isDown(KEY_ACTIONS.FORWARD)) {
			let dx = -Math.sin(this.rotation.y) * this.moveSpeed * mazeEngine.deltaTime;
			let dz = -Math.cos(this.rotation.y) * this.moveSpeed * mazeEngine.deltaTime;
			this.position.x += dx;
			this.position.z += dz;
		}
		if (this.mazeEngine.isDown(KEY_ACTIONS.BACKWARD)) {
			let dx = Math.sin(this.rotation.y) * this.moveSpeed * mazeEngine.deltaTime;
			let dz = Math.cos(this.rotation.y) * this.moveSpeed * mazeEngine.deltaTime;
			this.position.x += dx;
			this.position.z += dz;
		}

		this.#checkCollision();

		let camera = mazeEngine.cameraMazeObject;
		camera.position.set(this.position.x, this.mazeEngine.SIDE * 0.5, this.position.z);
		camera.rotation.set(0, this.rotation.y, 0);

		this.updateLightMap();
	}
}
