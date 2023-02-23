import tracedLighting from "../shader/tracedlighting.js";
import Asset from "../asset.js";
import * as THREE from '../../three/Three.js';
const textureLoader = new THREE.TextureLoader();

export default class ImageAsset extends Asset {
	constructor(mazeEngine, key) {
		super(mazeEngine, key);
		let url = this.url = this.mazeEngine.imageAssets[key];
		textureLoader.load(url, (texture) => {
			this.texture = texture;

			let geometry = new THREE.PlaneGeometry(1, 1);
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

			texture.offset.x = 0;
			texture.offset.y = 0;
			// console.log("repeat x y : " + repeatX + ", " + repeatY + "")
			texture.repeat.x = 1;
			texture.repeat.y = 1;

			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestFilter;
			texture.anisotropy = 0;

			// let material = new THREE.MeshStandardMaterial({ map: texture });
			// material.side = THREE.DoubleSide;
			// material.side = THREE.FrontSide;

			let material = new THREE.ShaderMaterial({
				uniforms: {
					texture1: {
						value: texture,
					},
					repeat: {
						value: new THREE.Vector2(1, 1),
					},
					lightMapValue: {
						value: 1.0,
					}
				},
				vertexShader: tracedLighting.vertex,
				fragmentShader: tracedLighting.fragment
			});

			this.root = new THREE.Mesh(geometry, material);
			this.root.receiveShadow = true;
			this.root.castShadow = true;

			super.loaded();
			this.mazeEngine.imageAssets[key] = this.root;
		});
	}
}
