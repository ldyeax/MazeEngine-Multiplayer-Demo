import MazeObject from "engine/mazeobject.js";
import * as THREE from "three";

const ADDWALL_LEFT = 0;
const ADDWALL_RIGHT = 1;
const ADDWALL_UP = 2;
const ADDWALL_DOWN = 3;

export default class Walls extends MazeObject {
	/**
	 * @type {THREE.Mesh[]}
	 */
	wallMeshes = [];

	constructor(mazeEngine) {
		super(mazeEngine);

		window.wallMeshes = this.wallMeshes;

		this.name = "Walls";

		let cells = mazeEngine.cells;
		let SIDE = mazeEngine.SIDE;

		this.root = new THREE.Group();

		let walls = this;

		function addWall(d, x, y) {
			// if (d != ADDWALL_UP) return;

			let wallMesh = mazeEngine.imageAssets.wall.clone();
			wallMesh.material = wallMesh.material.clone();
			walls.wallMeshes.push(wallMesh);

			wallMesh.position.y = 0;
			wallMesh.scale.y = 1;

			let cell = cells[y][x];
			wallMesh.userData.cell = cell;
			wallMesh.userData.cellX = x;
			wallMesh.userData.cellY = y;

			wallMesh.scale.set(SIDE, SIDE, 1);

			// left
			if (d == ADDWALL_LEFT) {
				wallMesh.position.x = x * SIDE;
				wallMesh.position.z = -y * SIDE - SIDE * 0.5;
				wallMesh.rotation.y = Math.PI * 0.5;
				cell.left = wallMesh;
			}
			//right
			else if (d == ADDWALL_RIGHT) {
				wallMesh.position.x = x * SIDE + SIDE;
				wallMesh.position.z = -y * SIDE + SIDE * -0.5;
				wallMesh.rotation.y = Math.PI * -0.5;
				cell.right = wallMesh;
			}
			// up
			else if (d == ADDWALL_UP) {
				// console.log(`making up at ${x}, ${y}`);

				wallMesh.position.x = x * SIDE + SIDE * 0.5;
				wallMesh.position.z = -y * SIDE - SIDE;
				wallMesh.rotation.y = 0;
				cell.up = wallMesh;
				//wallMesh.scale.x = wallMesh.scale.y = wallMesh.scale.z = 0;
			}
			// down
			else if (d == ADDWALL_DOWN) {
				// console.log(`making down at ${x}, ${y}`);

				wallMesh.position.x = x * SIDE + SIDE * 0.5;
				wallMesh.position.z = -y * SIDE;
				wallMesh.rotation.y = Math.PI;
				cell.down = wallMesh;
			}

			walls.root.add(wallMesh);

			return wallMesh;
		}
		for (let y = 0; y < cells.length; y++) {
			let row = cells[y];
			for (let x = 0; x < row.length; x++) {
				let cell = row[x];
				if (cell.up) {
					addWall(ADDWALL_UP, x, y);
				}
				if (cell.down) {
					addWall(ADDWALL_DOWN, x, y);
				}
				if (cell.left) {
					addWall(ADDWALL_LEFT, x, y);
				}
				if (cell.right) {
					addWall(ADDWALL_RIGHT, x, y);
				}
			}
		}
	}
	lateUpdate() {
		this.position.y = this.mazeEngine.SIDE * 0.5 * this.mazeEngine.globalYScale;

		//console.log("====" + this.wallMeshes.length);
		for (let wallMesh of this.wallMeshes) {
			let cell = this.mazeEngine.cells[wallMesh.userData.cellY][wallMesh.userData.cellX];
			wallMesh.material.uniforms.lightMapValue.value = cell.lightMapValue;
			//console.log(cell.lightMapValue);
		}
	}
}
