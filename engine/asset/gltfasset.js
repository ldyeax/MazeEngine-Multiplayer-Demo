import Asset from "../asset.js";

import {
	GLTFLoader
} from "../../three_examples/jsm/loaders/GLTFLoader.js";

const gltfLoader = new GLTFLoader();

export default class GLTFAsset extends Asset {
	static #defaultProperties = {
		side: 2,
		transparent: false,
		receiveShadow: true,
		castShadow: true,
	}

	setProperties(gltfObject, properties = {}, depth = 0) {
		// let l = function(s){ prependLog(s, depth); }
		let l = function (_) {};
		l(`setProperties(${gltfObject.name}, ${JSON.stringify(properties)}))`);
		properties = Object.assign({}, GLTFAsset.#defaultProperties, properties);
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

	constructor(mazeEngine, key) {
		super(mazeEngine, key);
		this.url = mazeEngine.gltfAssets[key];
		gltfLoader.load(this.url, (gltf) => {
			this.root = gltf.scene;
			//this.setProperties(this.root);
			super.loaded();
			this.mazeEngine.gltfAssets[key] = this.root;
		});
	}
}
