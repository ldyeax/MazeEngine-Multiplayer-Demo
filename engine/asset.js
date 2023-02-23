export default class Asset {
	loaded = false;
	root = null;
	mazeEngine = null;
	key = "";

	constructor(mazeEngine, key) {
		this.mazeEngine = mazeEngine;
		this.key = key;
		// console.log(`Constructed Asset ${key}`);
	}

	loaded() {
		// console.log(`Asset ${this.key} loaded`);
		window["assetroot_" + this.key] = this.root;
		this.loaded = true;
	}
}

