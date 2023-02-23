import misc from "./misc.js";

console.log("misc:");
console.log(JSON.stringify(misc));

import ImageAsset from "./asset/imageasset.js";
import GLTFAsset from "./asset/gltfasset.js";

import Ceiling from "./mazeobject/ceiling.js";
import Floor from "./mazeobject/floor.js";
import Walls from "./mazeobject/walls.js";

import Player from "./mazeobject/player.js";
import MazeCamera from "./mazeobject/mazecamera.js";

import MarbleTest from "./mazeobject/marbletest.js";

import * as THREE from "../three/Three.js";

const SIDE = 320;
const N_SIDE = -SIDE;
const INV_SIDE = 1.0 / SIDE;
const INV_SIDE_NEGATIVE = -INV_SIDE;
const HALF_SIDE = 0.5 * SIDE;
const HALF_N_SIDE = -HALF_SIDE;
const inv1000 = 1.0 / 1000.0;
const WALL_COLLISION_DIST = 0.1;
const ONE_MINUS_WALL_COLLISION_DIST = 1.0 - WALL_COLLISION_DIST;

const KEYSTATE_DOWN = 1;
const KEYSTATE_HELD = 2;
const KEYSTATE_UP = 3;
const KEYSTATE_NONE = 0;

import generateMaze from "./generatemaze.js";

let noclip = window.location.search.indexOf("noclip") != -1;

export default class MazeEngine {
	SIDE = 0;
	INV_SIDE = 0;
	INV_SIDE_NEGATIVE = 0;

	cells = [];
	player = null;

	with = 8;
	height = 8;

	// #region misc function
	gridToWorld(vector2_x, y) {
		if (typeof y == 'number') {
			let x = vector2_x;
			return new THREE.Vector3(HALF_SIDE + x * SIDE, 0, HALF_N_SIDE + y * N_SIDE);
		}
		let vector2 = vector2_x;
		return new THREE.Vector3(vector2.x * SIDE, 0, vector2.y * SIDE);
	}
	// #endregion

	// #region Time
	#lastUpdateTime = 0;
	deltaTime = 0;
	
	#updateTime() {
		let time = Date.now() * misc.INV_1000;
		this.deltaTime = time - this.#lastUpdateTime;
		this.#lastUpdateTime = time;
		// title.innerText = `FPS: ${Math.round(1 /  this.deltaTime)}`;
	}

	// #endregion
	
	// #region constructor
	constructor() {
		this.cells = generateMaze(this.with, this.height);

		this.SIDE = SIDE;
		this.INV_SIDE = INV_SIDE;
		this.INV_SIDE_NEGATIVE = INV_SIDE_NEGATIVE;

		this.#initAssets();
		window.me = this;
	}
	// #endregion

	// #region globalYScale
	globalYScale = 0;
	#updateGlobalYScale() {
		this.globalYScale += this.deltaTime;
		if (this.globalYScale > 1) {
			this.globalYScale = 1;
		}
	}
	// #endregion

	// #region assets
	assetsLoaded = false;

	assets = [];

	gltfAssets = {
		N64: "assets/n64/scene.gltf",
		marbletest: "assets/marbletest.gltf",
	};
	imageAssets = {
		ceiling: "assets/img/ceiling.png",
		floor: "assets/img/floor.png",
		wall: "assets/img/wall.png",
		globe: "assets/img/globe.png",
		ponycloud: "assets/img/ponycloud.png",
	};

	loadAssets() {
		let mazeEngine = this;
		return new Promise((resolve) => {
			let interval = setInterval(() => {
				let allLoaded = true;
				// console.log("==loadAssets==");
				for (let asset of mazeEngine.assets) {
					if (!asset.loaded) {
						//console.log("Not loaded: " + asset.key);
						allLoaded = false;
					} else {
						//console.log("Is loaded: " + asset.key);
					}
				}
				//console.log("=/loadAssets/=");
				if (allLoaded) {
					//console.log("Resolving");
					clearInterval(interval);
					mazeEngine.assetsLoaded = true;
					resolve();
				}
			}, 100);
		});
	};

	#initAssets() {
		let floorAsset = window.floorAsset = new ImageAsset(
			this,
			'floor',
			SIDE * this.with, SIDE * this.height,
			this.with, this.height
		);
		this.assets.push(floorAsset);
	
		let ceilingAsset = window.ceilingAsset = new ImageAsset(
			this,
			'ceiling',
			SIDE * this.with, SIDE * this.height,
			this.with * 2, this.height * 2
		);
		this.assets.push(ceilingAsset);
	
		let wallAsset = window.wallAsset = new ImageAsset(
			this,
			'wall',
			SIDE, SIDE,
			1, 1
		);
		this.assets.push(wallAsset);

		for (let key of Object.keys(this.gltfAssets)) {
			this.assets.push(new GLTFAsset(this, key));
		}
	}
	// #endregion

	// #region collision
	isCollidingWithWalls(position) {
		if (noclip) {
			return false;
		}
	
		let zDiv = -position.z * INV_SIDE;
		let cell_y = Math.floor(zDiv);
		let yPortion = zDiv - cell_y;
		let xDiv = position.x * INV_SIDE;
		let cell_x = Math.floor(position.x / SIDE);
		let xPortion = xDiv - cell_x;
	
		let cell = this.cells[cell_y][cell_x];
		if (typeof cell == 'undefined') {
			return false;
		}
	
		let collision = false;
		if (cell.left && xPortion < WALL_COLLISION_DIST) {
			collision = true;
		} else if (cell.right && xPortion > ONE_MINUS_WALL_COLLISION_DIST) {
			collision = true;
		} else if (cell.up && yPortion > ONE_MINUS_WALL_COLLISION_DIST) {
			collision = true;
		} else if (cell.down && yPortion < WALL_COLLISION_DIST) {
			collision = true;
		}
	
		return collision;
	}
	// #endregion

	// #region three
	scene = null;
	camera = null;
	renderer = null;

	updateCanvasSize() {
		let canvasWidth = 640;
		let canvasHeight = parseInt(canvasWidth * window.innerHeight / window.innerWidth);
	
		this.renderer.setSize(canvasWidth, canvasHeight, false);
	
		this.camera.aspect = canvasWidth / canvasHeight;
		this.camera.updateProjectionMatrix();
	}
	
	// #endregion

	// #region keystates
	static KEY_ACTIONS = {
		FORWARD: 1,
		BACKWARD: 2,
		LEFT: 3,
		RIGHT: 4,
	};
	keyStates = {};
	isDown(action) {
		return this.keyStates[action] == KEYSTATE_DOWN || this.keyStates[action] == KEYSTATE_HELD;
	}
	// #endregion

	// #region mazeObjects
	#mazeObjects = [];
	#checkForDestroyed() {
		let foundDestroyed = false;
		for (let mazeObject of this.#mazeObjects) {
			if (mazeObject.destroyed) {
				console.log(`Removing from scene: ${mazeObject.name}`);
				if (mazeObject.root) {
					this.scene.remove(mazeObject.root);
				}
				foundDestroyed = true;
			}
		}

		if (foundDestroyed) {
			this.#mazeObjects = this.#mazeObjects.filter(mazeObject => !mazeObject.destroyed);
		}
	}
	#updateMazeObjects() {
		for (let mazeObject of this.#mazeObjects) {
			let root = mazeObject.root;

			if (root && !mazeObject.addedToScene) {
				console.log(`Adding to scene: ${mazeObject.name}`);
				this.scene.add(root);
				mazeObject.addedToScene = true;
			}

			mazeObject.update();
			mazeObject.updateScripts();
			
			if (root) {
				let position = mazeObject.position;
				let rotation = mazeObject.rotation;

				root.position.set(position.x, position.y, position.z);
				root.rotation.set(rotation.x, rotation.y, rotation.z);

				let scale = mazeObject.scale.clone();
				if (mazeObject.scaleWithGlobalY) {
					scale.y *= this.globalYScale;
				}
				root.scale.set(scale.x, scale.y, scale.z);
			}
		}
	}
	instantiate(mazeObjectClass, args={}) {
		let mazeObject = new mazeObjectClass(this, args);
		this.#mazeObjects.push(mazeObject);
		//console.log(`Instantiated: ${mazeObject.name}`);
		return mazeObject;
	}
	// #endregion

	// #region update
	_update() {
		this.#updateTime();
		this.#updateGlobalYScale();
		this.#checkForDestroyed();
		this.#updateMazeObjects();
		this.renderer.render(this.scene, this.camera);

		requestAnimationFrame(this._update.bind(this));
	}
	// #endregion

	start(canvas) {
		if (!this.assetsLoaded) {
			console.log("assets not loaded");
			this.loadAssets().then(this.start);
			return;
		}

		this.#lastUpdateTime = Date.now() * misc.INV_1000;

		window.scene = this.scene = new THREE.Scene();

		let renderer = this.renderer = new THREE.WebGLRenderer({
			antialias: false,
			canvas: canvas,
			alpha: true
		});
		renderer.setClearColor(0, 0);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.shadowMap.renderSingleSided = false;
		renderer.shadowMap.renderReverseSided = false;

		let pointLight = window.pointLight = new THREE.PointLight(0xFFFFFF);
		pointLight.position.set(HALF_SIDE, HALF_SIDE, -HALF_SIDE);
		pointLight.intensity = 1;
		pointLight.castShadow = true;
		pointLight.receiveShadow = true;
		pointLight.shadow.camera.far = Infinity;
		this.scene.add(pointLight);

		// add scene light
		let ambientLight = new THREE.AmbientLight(0xFFFFFF);
		ambientLight.intensity = 1;
		this.scene.add(ambientLight);

		this.player = this.instantiate(Player);
		this.cameraMazeObject = this.instantiate(MazeCamera);

		this.instantiate(MarbleTest, {x:0, y:0});
		this.instantiate(MarbleTest, {x:1, y:0});
		this.instantiate(MarbleTest, {x:0, y:1});

		window.addEventListener("resize", this.updateCanvasSize.bind(this));
		this.updateCanvasSize();

		this.instantiate(Ceiling);
		this.instantiate(Walls);
		this.instantiate(Floor);

		this._update();
	}
}
