export const name = "maze";

import * as THREE from './three/Three.js'
import {GLTFLoader} from "./three_examples/jsm/loaders/GLTFLoader.js"
// import CubeGeometry


export class Cell {
	constructor() {
		this.up = true;
		this.left = true;
		this.right = true;
		this.down = true;
	}
	secluded() {
		return (this.up && this.left && this.right && this.down);
	}
};

export function generateMaze(width, height) {
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
		if (y1 < y2) {
			cell2.up = false;
			cell1.down = false;
		}
		// New cell is above
		else if (y1 > y2) {
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

function ascii(cells) {
	let ret = "";
	for (let y = 0; y < cells.length; y++) {
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

class GameObject {
	static count = 0;
	constructor() {
		this.id = GameObject.count++;
		this.name = "";
		this.position = new THREE.Vector2();
		this.mesh = null;
	}
	updateMesh() {
		this.mesh.position.x = this.position.x;
		this.mesh.position.z = this.position.y;
		this.mesh.position.y = 100;
	}
	update() { }
}

const gltfLoader = new GLTFLoader();

class Asset {
	constructor() {
		this.loaded = false;
		this.mesh = null;
	}
}

class N64Asset extends Asset {
	static mesh;
	constructor() {
		super();
		gltfLoader.load("n64/scene.gltf", (gltf) => {
			N64Asset.mesh = gltf.scene;
			this.loaded = true;
		});
	}
}

const textureLoader = new THREE.TextureLoader();

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
			console.log("repeat x y : " + repeatX + ", " + repeatY + "")
			texture.repeat.x = repeatX;
			texture.repeat.y = repeatY;

			let material = new THREE.MeshBasicMaterial({ map: texture });
			this.mesh = new THREE.Mesh(geometry, material);
			this.mesh.rotation.x = this.mesh.rotation.y = this.mesh.rotation.z = 0;
			this.mesh.position.x = this.mesh.position.y = this.mesh.position.z = 0;
		});
	}
}


class N64 extends GameObject {
	constructor() {
		super();
		this.name = "N64";
		this.mesh = N64Asset.mesh.clone();
	}
	update() {
		super.update();
		this.mesh.rotation.y += 0.9 * Time.deltaTime;
	}
}

const assets = [];
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

const gameObjects = [];

class Time {
	static time = 0;
	static deltaTime = 0;
}

const inv1000 = 1.0 / 1000.0;

const SIDE = 320;

async function _maze(canvas, width, height, wallUrl, ceilingUrl, floorUrl) {
	//console.log("width: " + width + ", height: " + height);
	// console.log("wallurl: " + wallUrl);
	// console.log("ceilingUrl: " + ceilingUrl);
	// console.log("floorUrl: " + floorUrl);
	let globalYScale = 0;
	let invWidth = 1.0 / width;
	let invHeight = 1.0 / height;

	//const cells = generateMaze(width, height);

	// Assets
	assets.push(new N64Asset());
	// var wallAsset = new ImageAsset(wallUrl, SIDE, SIDE);
	// assets.push(wallAsset);
	// assets.push(ceilingAsset);

	var floorAsset = new ImageAsset(
		floorUrl, 
		SIDE * width, 0, SIDE * height,
		width, height
	);
	assets.push(floorAsset);

	var ceilingAsset = new ImageAsset(
		ceilingUrl,
		SIDE * width, 0, SIDE * height,
		width, height
	);
	assets.push(ceilingAsset);

	// console.log("Loading assets");
	await loadAllAssets();
	// console.log("Loaded assets");

	floorAsset.mesh.position.y = 0;
	floorAsset.mesh.position.z = SIDE * height * -0.5;
	floorAsset.mesh.position.x = SIDE * width * 0.5;
	window.fm = floorAsset.mesh;

	ceilingAsset.mesh.position.y = SIDE;
	ceilingAsset.mesh.position.z = SIDE * height * -0.5;
	ceilingAsset.mesh.position.x = SIDE * width * 0.5;
	window.cm = ceilingAsset.mesh;


	// create threejs scene
	const scene = new THREE.Scene();

	const ambient = new THREE.AmbientLight(0x00FF00);
	scene.add(ambient);

	const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
	window.camera = camera;
	
	camera.position.x = 0.5 * SIDE;
	camera.position.y = SIDE * 0.5;// 5;
	camera.position.z = 0.5 * SIDE;

	camera.rotation.x = 0;
	camera.rotation.y = 0;
	camera.rotation.z = 0;

	scene.add(camera);

	const pointLight = new THREE.PointLight(0xFFFFFF);
	pointLight.position.set(0, 0, 0);
	scene.add(pointLight);

	scene.add(floorAsset.mesh);
	scene.add(ceilingAsset.mesh);

	// ceilingAsset.mesh.position.y = 200;
	// ceilingAsset.mesh.scale.y = -1;
	// scene.add(ceilingAsset.mesh);

	const renderer = new THREE.WebGLRenderer({ 
		antialias: true, 
		canvas: canvas,
		alpha: true
	});
	renderer.setSize(canvas.width, canvas.height);
	renderer.setClearColor(0,0);

	//gameObjects.push(new N64());

	Time.time = Date.now() * inv1000;
	let lastUpdateTime = Time.time;

	// // make camera look at n64
	// camera.lookAt(gameObjects[0].mesh.position);

	function update() {
		globalYScale += Time.deltaTime;
		if (globalYScale > 1) {
			globalYScale = 1;
		}

		requestAnimationFrame(update);
		Time.time = Date.now() * inv1000;
		Time.deltaTime = Time.time - lastUpdateTime;
		lastUpdateTime = Time.time;
		for (let gameObject of gameObjects) {
			gameObject.update();
			gameObject.updateMesh();
			gameObject.mesh.scale.y = globalYScale;
		}
		renderer.render(scene, camera);
	}
	update();
}

export {_maze as initMaze};