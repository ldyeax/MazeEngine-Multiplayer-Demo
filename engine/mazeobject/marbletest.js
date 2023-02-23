import MazeObject from "../mazeobject.js";
import misc  from "../misc.js";
import Spin from "../mazescript/spin.js";
import * as THREE from "../../three/Three.js";

let mazeEngine = null;

export default class MarbleTest extends MazeObject {
	static #MARBLE_STATE = {
		IDLE: 0,
		SHRINKING: 1
	};

	#state = MarbleTest.#MARBLE_STATE.IDLE;

	constructor(mazeEngine, args) {
		let x = args.x;
		let y = args.y;
		super(mazeEngine, args);
		this.name = "MarbleTest" + this.id;

		this.root = mazeEngine.gltfAssets.marbletest.clone();
		let spin = this.addScript(Spin);
		spin.speed = x + y + 1;
		this.lastPosition = this.position = mazeEngine.gridToWorld(x, y);
		this.position.y = 0;
		this.scale = new THREE.Vector3(3, 3, 3);
		window.mtg = this;
	}
	update() {
		super.update();
		let player = this.mazeEngine.player;

		switch (this.#state) {
			case MarbleTest.#MARBLE_STATE.IDLE:
				if (this.getGridPosition() == player.getGridPosition()) {
					this.#state = MarbleTest.#MARBLE_STATE.SHRINKING;
				}
				break;
			case MarbleTest.#MARBLE_STATE.SHRINKING:
				this.scale.y -= 0.1 * mazeEngine.deltaTime;
				if (this.scale.y < 0) {
					this.scale.y = 0;
					this.destroy();
				}
				break;
		}
	}
}
