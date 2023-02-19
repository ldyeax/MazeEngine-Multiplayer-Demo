export const name = "maze";

// #region keymap

const KEYSTATE_DOWN = 1;
const KEYSTATE_HELD = 2;
const KEYSTATE_UP = 3;
const KEYSTATE_NONE = 0;

const KEY_ACTIONS = {
	FORWARD: 1,
	BACKWARD: 2,
	LEFT: 3,
	RIGHT: 4,
}

const keyMap = {};
keyMap[KEY_ACTIONS.FORWARD] = "KeyW";
keyMap[KEY_ACTIONS.BACKWARD] = "KeyS";
keyMap[KEY_ACTIONS.LEFT] = "KeyA";
keyMap[KEY_ACTIONS.RIGHT] = "KeyD";

const keyStates = {};
keyStates[KEY_ACTIONS.FORWARD] = KEYSTATE_NONE;
keyStates[KEY_ACTIONS.BACKWARD] = KEYSTATE_NONE;
keyStates[KEY_ACTIONS.LEFT] = KEYSTATE_NONE;
keyStates[KEY_ACTIONS.RIGHT] = KEYSTATE_NONE;

window.addEventListener("keydown", function(e) {
	let code = e.code;
	// console.log(`Keydown: ${code}`);
	for (let actionName in KEY_ACTIONS) {
		let actionId = KEY_ACTIONS[actionName];
		if (keyMap[actionId] === code) {
			let existingState = keyStates[actionId];
			if (existingState !== KEYSTATE_HELD) {
				keyStates[actionId] = KEYSTATE_DOWN;
				// console.log(`Keydown: ${actionName}`);
				// console.log(keyStates);
			}
		}
	}
});
window.addEventListener("keyup", function(e) {
	let code = e.code;
	for (let actionName in KEY_ACTIONS) {
		let actionId = KEY_ACTIONS[actionName];
		if (keyMap[actionId] === code) {
			keyStates[actionId] = KEYSTATE_UP;
		}
	}
});

// #endregion

// #region Utiliy constants
const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
// #endregion
// #region engine constants
const SIDE = 320;
const INV_SIDE = 1.0 / SIDE;
let camera = null;
const inv1000 = 1.0 / 1000.0;
const wallMeshes = [];
const gameObjects = [];
const assets = [];
const WALL_COLLISION_DIST = 0.1;
const ONE_MINUS_WALL_COLLISION_DIST = 1.0 - WALL_COLLISION_DIST;

function loadAllAssets() {
	return new Promise((resolve) => {
		let interval = setInterval(() => {
			let allLoaded = true;
			for (let asset of assets) {
				if (!asset.loaded) {
					allLoaded = false;
					break;
				}
			}
			if (allLoaded) {
				clearInterval(interval);
				// console.log("Resolving");
				resolve();
			}
		}, 100);
	});
}


// #endregion

// #region utility functions
function gridToWorld(vector2) {
	return new THREE.Vector3(vector2.x * SIDE, 0, vector2.y * SIDE);
}
// #endregion

// #region cardinals
const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;
function clampCardinal(cardinal) {
	let ret = cardinal % 4;
	if (ret < 0) {
		ret += 4;
	}
	return ret;
}

const CARDINAL_ROTATION_SIGN = {};
CARDINAL_ROTATION_SIGN[NORTH] = {};
CARDINAL_ROTATION_SIGN[NORTH][NORTH] = 0;
CARDINAL_ROTATION_SIGN[NORTH][EAST] = -1;
CARDINAL_ROTATION_SIGN[NORTH][SOUTH] = 1;
CARDINAL_ROTATION_SIGN[NORTH][WEST] = 1;

CARDINAL_ROTATION_SIGN[EAST] = {};
CARDINAL_ROTATION_SIGN[EAST][NORTH] = -1;
CARDINAL_ROTATION_SIGN[EAST][EAST] = 0;
CARDINAL_ROTATION_SIGN[EAST][SOUTH] = 1;
CARDINAL_ROTATION_SIGN[EAST][WEST] = -1;

CARDINAL_ROTATION_SIGN[SOUTH] = {};
CARDINAL_ROTATION_SIGN[SOUTH][NORTH] = 1;
CARDINAL_ROTATION_SIGN[SOUTH][EAST] = 1;
CARDINAL_ROTATION_SIGN[SOUTH][SOUTH] = 0;
CARDINAL_ROTATION_SIGN[SOUTH][WEST] = -1;

CARDINAL_ROTATION_SIGN[WEST] = {};
CARDINAL_ROTATION_SIGN[WEST][NORTH] = -1;
CARDINAL_ROTATION_SIGN[WEST][EAST] = 1;
CARDINAL_ROTATION_SIGN[WEST][SOUTH] = 1;
CARDINAL_ROTATION_SIGN[WEST][WEST] = 0;
// #endregion

import * as THREE from './three/Three.js'
import {GLTFLoader} from "./three_examples/jsm/loaders/GLTFLoader.js"
// import CubeGeometry

// #region Maze generation

export class Cell {
	constructor(up = true, left = true, right = true, down = true) {
		this.up = up;
		this.left = left;
		this.right = right;
		this.down = down;
	}
	secluded() {
		return (this.up && this.left && this.right && this.down);
	}
};

export function generateMaze(width, height) {
	width = parseInt(Math.abs(width));
	height = parseInt(Math.abs(height));
	if (isNaN(width) || isNaN(height) || width < 1 || height < 1) {
		console.error(`Invalid dimensions passed to generateMaze: ${width}, ${height}`);
		width = 1;
		height = 1;
	}

	if (width * height == 1) {
		return [[new Cell()]];
	}

	let ret = [];
	for (let y = 0; y < height; y++) {
		ret.push([]);
		for (let x = 0; x < width; x++) {
			ret[y].push(new Cell());
		}
	}
	function secludedCellExists() {
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (ret[y][x].secluded()) {
					return true;
				}
			}
		}
		return false;
	}
	function tryConnectCells(y1, x1, y2, x2) {
		if (x1 < 0 || x1 >= width || y1 < 0 || y1 >= height) {
			return false;
		}
		if (x2 < 0 || x2 >= width || y2 < 0 || y2 >= height) {
			return false;
		}
		let cell1 = ret[y1][x1];
		let cell2 = ret[y2][x2];
		if (!cell2.secluded()) {
			return false;
		}
		// New cell is below
		if (y2 < y1) {
			cell2.up = false;
			cell1.down = false;
		}
		// New cell is above
		else if (y2 > y1) {
			cell2.down = false;
			cell1.up = false;
		}
		// New cell is right
		else if (x1 < x2) {
			cell2.left = false;
			cell1.right = false;
		}
		// New cell is left
		else if (x1 > x2) {
			cell2.right = false;
			cell1.left = false;
		}
		return true;
	}
	// Dead end: cell with no surrounding secluded cells
	function isDeadEnd(y, x) {
		if (y > 0) {
			if (ret[y - 1][x].secluded()) {
				return false;
			}
		}
		if (y < height - 1) {
			if (ret[y + 1][x].secluded()) {
				return false;
			}
		}
		if (x > 0) {
			if (ret[y][x - 1].secluded()) {
				return false;
			}
		}
		if (x < width - 1) {
			if (ret[y][x + 1].secluded()) {
				return false;
			}
		}
		return true;
	}

	// Make the path
	let trail = [];
	let x = Math.round(width / 2);
	let y = height - 1;
	while (secludedCellExists()) {
		// console.log(ascii(ret));
		// console.log("================");

		if (isDeadEnd(y, x)) {
			// console.log("is dead end: " + x + ", " + y);
			if (trail.length == 0) {
				throw "Dead end reached with no trail";
			}
			let last = trail.pop();
			// console.log("Last:");
			// console.log(last);
			x = last.x;
			y = last.y;
			continue;
		}
		let direction = Math.floor(Math.random() * 4);
		switch (direction) {
			case 0:
				if (tryConnectCells(y, x, y, x - 1)) {
					x--;
					break;
				}
			case 1:
				if (tryConnectCells(y, x, y, x + 1)) {
					x++;
					break;
				}
			case 2:
				if (tryConnectCells(y, x, y - 1, x)) {
					y--;
					break;
				}
			case 3:
				if (tryConnectCells(y, x, y + 1, x)) {
					y++;
					break;
				}
		}
		trail.push({ x: x, y: y });
	}

	// console.log("logging ascii");
	// console.log(ascii(ret));

	return ret;
};

function mazeAsciiArt(cells) {
	let ret = "";
	for (let y = cells.length - 1; y >= 0; y--) {
		for (let x = 0; x < cells[y].length; x++) {
			let cell = cells[y][x];
			if (cell.up) {
				ret += "⬛⬛⬛";
			} else {
				ret += "⬛⬜⬛";
			}
		}
		ret += "\n";
		for (let x = 0; x < cells[y].length; x++) {
			let cell = cells[y][x];
			if (cell.left) {
				ret += "⬛⬜";
			} else {
				ret += "⬜⬜";
			}
			if (cell.right) {
				ret += "⬛";
			} else {
				ret += "⬜";
			}
		}
		ret += "\n";
		for (let x = 0; x < cells[y].length; x++) {
			let cell = cells[y][x];
			if (cell.down) {
				ret += "⬛⬛⬛";
			} else {
				ret += "⬛⬜⬛";
			}
		}
		ret += "\n";
	}
	return ret;
}

// #endregion

// #region assets

class Asset {
	constructor() {
		this.loaded = false;
		this.root = null;
	}
}

// Strings will be replaced with mesh objects
const staticMeshAssets = {
	N64: "n64/scene.gltf",
	marbletest: "assets/marbletest.gltf",
};

window.staticMeshAssets = staticMeshAssets;

function prependLog(str, n) {
	let s = "";
	for (let i = 0; i < n; i++) {
		s += "\t";
	}
	s += str;
	console.log(s);
}

class GLTFAsset extends Asset {
	static defaultProperties = {
		side: 2,
		transparent: false
	}

	setProperties(gltfObject, properties = {}, depth = 0) {
		// let l = function(s){ prependLog(s, depth); }
		let l = function(_) {};
		l(`setProperties(${gltfObject.name}, ${JSON.stringify(properties)}))`);
		properties = Object.assign({}, GLTFAsset.defaultProperties, properties);
		if (gltfObject.userData && gltfObject.userData.three_props) {
			l("Found three_props");
			try {
				Object.assign(properties, JSON.parse(gltfObject.userData.three_props));
				l("Got new properties, set: " + JSON.stringify(properties));
			} catch (e) {
				console.error("Error parsing three_props on " + gltfObject.name);
				console.error(e);
				console.error(gltfObject.userData.three_props);
			}
		}
		if (gltfObject.material) {
			l("Found material");
			this.setProperties(gltfObject.material, properties, depth + 1);
		} else {
			l("No material");
		}
		for (let key of Object.keys(properties)) {
			l(`Checking if ${key} is defined on ${gltfObject.name}`)
			if (typeof gltfObject[key] !== "undefined") {
				l(`Setting ${key} to ${properties[key]} on ${gltfObject.name}`)
				gltfObject[key] = properties[key];
			} else {
				l("Not defined");
			}
		}
		if (gltfObject.children) {
			l("found children");
			for (let child of gltfObject.children) {
				this.setProperties(child, properties, depth + 1);
			}
		} else {
			l("No children");
		}
	}

	constructor(key) {
		super();
		this.key = key;
		this.url = staticMeshAssets[key];
		gltfLoader.load(this.url, (gltf) => {
			console.log("loaded " + this.url);
			this.root = gltf.scene;
			window["mesh_" + key] = this.root;
			this.loaded = true;
			staticMeshAssets[key] = this.root;
			this.setProperties(this.root);
		});
	}
}

class ImageAsset extends Asset {
	constructor (url, width, height, depth, repeatX, repeatY) {
		super();
		textureLoader.load(url, (texture) => {
			this.loaded = true;
			this.texture = texture;

			let geometry = new THREE.BoxGeometry(width, height, depth);
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			texture.offset.x = 0;
			texture.offset.y = 0;
			// console.log("repeat x y : " + repeatX + ", " + repeatY + "")
			texture.repeat.x = repeatX;
			texture.repeat.y = repeatY;

			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestFilter;
			texture.anisotropy = 0;

			let material = new THREE.MeshBasicMaterial({ map: texture });
			this.root = new THREE.Mesh(geometry, material);
			this.root.rotation.x = this.root.rotation.y = this.root.rotation.z = 0;
			this.root.position.x = this.root.position.y = this.root.position.z = 0;

			// // make mesh semi transparent
			// this.rootSceneObject.material.transparent = true;
			// this.rootSceneObject.material.opacity = 0.1;

		});
	}
}

// #endregion

// #region GameObject

class GameObject {
	static count = 0;
	constructor() {
		this.id = GameObject.count++;
		this.name = "";
		this.position = new THREE.Vector3();
		this.lastPosition = new THREE.Vector3();
		this.rotation = new THREE.Vector3();
		this.root = null;
		this.addedToScene = false;
		this.scale = new THREE.Vector3(1, 1, 1);
	}
	update() { 
		this.lastPosition = this.position.clone();
	}
}

class N64 extends GameObject {
	constructor() {
		super();
		this.name = "N64";
		this.root = staticMeshAssets.N64.clone();
	}
	update() {
		super.update();
		this.root.rotation.y += 0.9 * Time.deltaTime;
	}
}

class Input {
	static isDown(action) {
		return keyStates[action] == KEYSTATE_DOWN || keyStates[action] == KEYSTATE_HELD;
	}
}

class Player extends GameObject {
	static STATE = {
		WAITING_FOR_GAME_START: -1,
		IDLE: 0,
		TURNING_LEFT: 1,
		TURNING_RIGHT: 2,
		MOVING_FORWARD: 3,
		MOVING_BACKWARD: 4,
		FLIPPING: 5,
	};

	static MOVE_SPEED = SIDE; // units per second
	// 90 degrees per second, in radians
	static ROTATE_SPEED = Math.PI / 2;

	constructor() {
		super();
		this.name = "Player";
		this.root = null; 
		
		this.state = Player.STATE.WAITING_FOR_GAME_START;

		this.currentFacing = NORTH;
		this.targetFacing = NORTH;

		this.currentPosition = new THREE.Vector2(0, 0);
		this.targetPosition = new THREE.Vector2(0, 0);

		this.position.x = SIDE * 0.5;
		this.position.z = SIDE * -0.5;
		this.lastPosition = this.position.clone();
	}

	moveAndRotateToTarget() {
		if (this.currentFacing != this.targetFacing) {
			let sign = CARDINAL_ROTATION_SIGN[this.currentFacing][this.targetFacing];
			this.rotation.y += sign * Player.ROTATE_SPEED * Time.deltaTime;;
		}
	}

	// processTurnInput() {
	// 	if (keyStates[KEY_ACTIONS.LEFT] == KEYSTATE_HELD) {
	// 		this.targetFacing = clampCardinal(this.currentFacing - 1);
	// 	} else if (keyStates[KEY_ACTIONS.RIGHT] == KEYSTATE_HELD) {
	// 		this.targetFacing = clampCardinal(this.currentFacing + 1);
	// 	}
	// }

	update() {
		super.update();

		if (Input.isDown(KEY_ACTIONS.LEFT)) {
			this.rotation.y += Player.ROTATE_SPEED * Time.deltaTime;
		}
		if (Input.isDown(KEY_ACTIONS.RIGHT)) {
			this.rotation.y -= Player.ROTATE_SPEED * Time.deltaTime;
		}
		if (Input.isDown(KEY_ACTIONS.FORWARD)) {
			let dx = -Math.sin(this.rotation.y) * Player.MOVE_SPEED * Time.deltaTime;
			let dz = -Math.cos(this.rotation.y) * Player.MOVE_SPEED * Time.deltaTime;
			this.position.x += dx;
			this.position.z += dz;
		}
		if (Input.isDown(KEY_ACTIONS.BACKWARD)) {
			let dx = Math.sin(this.rotation.y) * Player.MOVE_SPEED * Time.deltaTime;
			let dz = Math.cos(this.rotation.y) * Player.MOVE_SPEED * Time.deltaTime;
			this.position.x += dx;
			this.position.z += dz;
		}

		camera.position.set(this.position.x, SIDE * 0.5, this.position.z);
		camera.rotation.set(0, this.rotation.y, 0);

		// switch (this.state) {
		// 	case Player.STATE.WAITING_FOR_GAME_START:
		// 		break;
		// 	case Player.STATE.IDLE:

		// 		break;

		// }
	}
}

class InputManager extends GameObject {
	constructor() {
		super();
		this.lastKeyStates = Object.assign({}, keyStates);
	}
	// sets key states based on current (set by addEventListeners above) and last states
	update() {
		super.update();
		for (let actionName in KEY_ACTIONS) {
			let actionId = KEY_ACTIONS[actionName];
			let currentKeyState = keyStates[actionId];
			let lastKeyState = this.lastKeyStates[actionId];
			let toSet = null;
			switch (lastKeyState) {
				case KEYSTATE_UP:
					switch (currentKeyState) {
						case KEYSTATE_UP:
							toSet = KEYSTATE_NONE;
							break;
						case KEYSTATE_DOWN:
							toSet = KEYSTATE_DOWN;
							break;
						case KEYSTATE_HELD:
							console.error("Illegal state transition: up then held");
							toSet = KEYSTATE_DOWN;
							break;
						case KEYSTATE_NONE:
							toSet = KEYSTATE_NONE;
							break;
					}
					break;
				case KEYSTATE_DOWN:
					switch (currentKeyState) {
						case KEYSTATE_UP:
							toSet = KEYSTATE_UP;
							break;
						case KEYSTATE_DOWN:
							toSet = KEYSTATE_HELD;
							break;
						case KEYSTATE_HELD:
							toSet = KEYSTATE_HELD;
							break;
						case KEYSTATE_NONE:
							console.error("Illegal state transition: down then none");
							toSet = KEYSTATE_UP;
							break;
					}
					break;
				case KEYSTATE_HELD:
					switch (currentKeyState) {
						case KEYSTATE_UP:
							toSet = KEYSTATE_UP;
							break;
						case KEYSTATE_DOWN:
							console.error("Illegal state transition: held then down");
							toSet = KEYSTATE_UP;
							break;
						case KEYSTATE_HELD:
							toSet = KEYSTATE_HELD;
							break;
						case KEYSTATE_NONE:
							console.error("Illegal state transition: held then none");
							toSet = KEYSTATE_UP;
							break;
					}
					break;
				case KEYSTATE_NONE:
					switch (currentKeyState) {
						case KEYSTATE_UP:
							console.error("Illegal state transition: none then up");
							toSet = KEYSTATE_NONE;
							break;
						case KEYSTATE_DOWN:
							toSet = KEYSTATE_DOWN;
							break;
						case KEYSTATE_HELD:
							console.error("Illegal state transition: none then held");
							toSet = KEYSTATE_DOWN;
							break;
						case KEYSTATE_NONE:
							toSet = KEYSTATE_NONE;
							break;
					}
					break;
			}
			keyStates[actionId] = toSet;
		}
		this.lastKeyStates = Object.assign({}, keyStates);
	}
}

// #endregion

// #region Time

class Time {
	static time = 0;
	static deltaTime = 0;
}

// #endregion

async function _maze(canvas, width, height, wallUrl, ceilingUrl, floorUrl) {
	//console.log("width: " + width + ", height: " + height);
	// console.log("wallurl: " + wallUrl);
	// console.log("ceilingUrl: " + ceilingUrl);
	// console.log("floorUrl: " + floorUrl);
	let globalYScale = 0;
	let invWidth = 1.0 / width;
	let invHeight = 1.0 / height;

	const cells = generateMaze(width, height);
	console.log(mazeAsciiArt(cells));

	// #region Assets
	// iterate through staticMeshAssets

	for (let key of Object.keys(staticMeshAssets)) {
		assets.push(new GLTFAsset(key));
	}

	let floorAsset = new ImageAsset(
		floorUrl, 
		SIDE * width, 0, SIDE * height,
		width, height
	);
	assets.push(floorAsset);

	let ceilingAsset = new ImageAsset(
		ceilingUrl,
		SIDE * width, 0, SIDE * height,
		width, height
	);
	assets.push(ceilingAsset);

	let wallAsset = new ImageAsset(
		wallUrl,
		SIDE, SIDE, 0,
		1, 1
	);
	assets.push(wallAsset);

	// console.log("Loading assets");
	await loadAllAssets();
	// console.log("Loaded assets");

	floorAsset.root.position.y = 0;
	floorAsset.root.position.z = -SIDE * height * 0.5;
	floorAsset.root.position.x = SIDE * width * 0.5;
	window.fm = floorAsset.root;

	ceilingAsset.root.position.y = SIDE;
	ceilingAsset.root.position.z = -SIDE * height * 0.5;
	ceilingAsset.root.position.x = SIDE * width * 0.5;
	window.cm = ceilingAsset.root;

	// #endregion

	// #region Game Objects
	gameObjects.push(new InputManager());
	let player = new Player();
	gameObjects.push(player);

	let marbletest = new GameObject();
	marbletest.root = staticMeshAssets.marbletest.clone();
	window.mtg = marbletest;
	marbletest.lastPosition = marbletest.position = new THREE.Vector3(-SIDE/2 + SIDE * 3, 0, -SIDE/2 - SIDE * 3);
	marbletest.scale = new THREE.Vector3(3,3,3);
	gameObjects.push(marbletest);

	// #endregion

	// create threejs scene
	const scene = new THREE.Scene();

	const ambient = new THREE.AmbientLight(0xFFFFFF);
	scene.add(ambient);

	let canvasWidth = 640;
	let canvasHeight = parseInt(canvasWidth * window.innerHeight / window.innerWidth);

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 10000);

	window.camera = camera;
	
	camera.position.x = 0.5 * SIDE;
	camera.position.y = 0.5 * SIDE;
	camera.position.z = -0.5 * SIDE;

	camera.rotation.x = 0;
	camera.rotation.y = 0;
	camera.rotation.z = 0;

	scene.add(camera);

	const pointLight = new THREE.PointLight(0xFFFFFF);
	pointLight.position.set(0, 0, 0);
	scene.add(pointLight);

	scene.add(floorAsset.root);
	scene.add(ceilingAsset.root);

	// #region Walls
	const ADDWALL_LEFT = 0;
	const ADDWALL_RIGHT = 1;
	const ADDWALL_UP = 2;
	const ADDWALL_DOWN = 3;

	function addWall(d, x, y) {
		let wallMesh = wallAsset.root.clone();
		wallMeshes.push(wallMesh);
		
		wallMesh.position.y = 0;
		wallMesh.scale.y = 0;

		// left
		if (d == 0) {
			wallMesh.position.x = x * SIDE;
			wallMesh.position.z = -y * SIDE + SIDE * -0.5;
			wallMesh.rotation.y = Math.PI * 0.5;
		}
		//right
		else if (d == 1) {
			wallMesh.position.x = x * SIDE + SIDE;
			wallMesh.position.z = -y * SIDE + SIDE * -0.5;
			wallMesh.rotation.y = Math.PI * 0.5;
		}
		// up
		else if (d == 2) {
			// console.log(`making up at ${x}, ${y}`);

			wallMesh.position.x = x * SIDE + SIDE * 0.5;
			wallMesh.position.z = -y * SIDE - SIDE;
			wallMesh.rotation.y = 0;

			//wallMesh.scale.x = wallMesh.scale.y = wallMesh.scale.z = 0;
		}
		// down
		else if (d == 3) {
			// console.log(`making down at ${x}, ${y}`);

			wallMesh.position.x = x * SIDE + SIDE * 0.5;
			wallMesh.position.z = -y * SIDE;
			wallMesh.rotation.y = 0;
		}

		scene.add(wallMesh);
		
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
	// #endregion

	const renderer = new THREE.WebGLRenderer({ 
		antialias: false, 
		canvas: canvas,
		alpha: true
	});

	console.log(`${window.innerWidth} x ${window.innerHeight}`);
	//(640, 480, false);

	renderer.setSize(canvasWidth, canvasHeight, false);
	renderer.setClearColor(0,0);

	//gameObjects.push(new N64());

	Time.time = Date.now() * inv1000;
	let lastUpdateTime = Time.time;

	let noclip = window.location.search.indexOf("noclip") != -1;

	function isCollidingWithWalls(position) {
		if (noclip) {
			return false;
		}

		let zDiv = -position.z * INV_SIDE;
		let cell_y = Math.floor(zDiv);
		let yPortion = zDiv - cell_y;
		let xDiv = position.x * INV_SIDE;
		let cell_x = Math.floor(position.x / SIDE);
		let xPortion = xDiv - cell_x;

		let cell = cells[cell_y][cell_x];
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

	function update() {
		globalYScale += Time.deltaTime;
		if (globalYScale > 1) {
			globalYScale = 1;
		}

		requestAnimationFrame(update);
		Time.time = Date.now() * inv1000;
		Time.deltaTime = Time.time - lastUpdateTime;
		lastUpdateTime = Time.time;

		// #region collision
		let oldPosition = player.lastPosition;
		let newPosition = oldPosition.clone();

		newPosition.x = player.position.x;
		if (isCollidingWithWalls(newPosition)) {
			newPosition.x = oldPosition.x;
		}

		newPosition.z = player.position.z;
		if (isCollidingWithWalls(newPosition)) {
			newPosition.z = oldPosition.z;
		}

		player.position.x = newPosition.x;
		player.position.z = newPosition.z;
		// #endregion

		pointLight.position.set(player.position.x, player.position.y, player.position.z);

		for (let gameObject of gameObjects) {
			if (gameObject.root && !gameObject.addedToScene) {
				scene.add(gameObject.root);
				gameObject.addedToScene = true;
			}
			gameObject.update();
			
			let mesh = gameObject.root;
			let position = gameObject.position;
			let rotation = gameObject.rotation;
			if (mesh) {
				mesh.position.set(position.x, position.y, position.z);
				mesh.rotation.set(rotation.x, rotation.y, rotation.z);

				let scale = gameObject.scale.clone();
				scale.y *= globalYScale;

				mesh.scale.set(scale.x, scale.y, scale.z);
			}
		}
		for (let wallMesh of wallMeshes) {
			if (wallMesh.scale.y != globalYScale) {
				wallMesh.scale.y = globalYScale;
				wallMesh.position.y = SIDE * 0.5 * globalYScale;
			}
		}

		renderer.render(scene, camera);
	}
	update();
}

export {_maze as initMaze};