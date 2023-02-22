class MazeManager extends MazeObject {
	static globalYScale = 0;
	static foundMarble = false;
	static foundMarble2 = false;
	constructor() {
		super();

		// #region cells
		cells = generateMaze(width, height);
		console.log(mazeAsciiArt(cells));
		// #endregion

		// #region walls
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
	}
	update() {
		if (!MazeManager.foundMarble) {
			MazeManager.globalYScale += Time.deltaTime;
			if (MazeManager.globalYScale > 1) {
				MazeManager.globalYScale = 1;
			} 
		} else if (!MazeManager.foundMarble2) {
			MazeManager.globalYScale -= Time.deltaTime;
			if (MazeManager.globalYScale < 0) {
				MazeManager.globalYScale = 0;
				MazeManager.foundMarble2 = true;
				let videoElement = document.createElement('video');
				videoElement.src="assets/tinywag.mp4";
				let videoTexture = new THREE.VideoTexture(videoElement);
				videoTexture.minFilter = THREE.NearestFilter;
				videoTexture.magFilter = THREE.NearestFilter;
				for (let wallMesh of wallMeshes) {
					wallMesh.material.map = videoTexture;
					wallMesh.material.needsUpdate = true;
				}
				// set time to 0.5s and play
				videoElement.currentTime = 0.7;
				videoElement.play();
				scene.remove(window.mtg.root);
			}
		}
	}
}