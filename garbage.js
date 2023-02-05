	/*
	var tG = new THREE.CubeGeometry( 320, 200, 1, 1, 1, 1, null);
	var tT = THREE.ImageUtils.loadTexture("brick.bmp");
	tT.wrapS = tT.wrapT = THREE.RepeatWrapping;
	var tMat = new THREE.MeshBasicMaterial({map: tT});
	tMesh = new THREE.Mesh( tG, tMat );
	tMesh.position.z = 0;
	tMesh.position.y = 100;
	tMesh.position.x = 320/2;
	
	scene.add(tMesh);
	*/
	//----------------------------------------------------------------------------------------------------------------------------------------//
	/*
	
	var finalWallGeometry = new THREE.Geometry();
	renderCells = new Array();
	for(y=0;y<h;++y)
	{
		renderCells[y] = new Array();
		for(x=0;x<w;++x)
		{//;y=0;x=0;renderCells = new Array(); renderCells[y] = new Array();
			renderCells[y][x] = new Array();
			renderCells[y][x][0] = new function(){}
			renderCells[y][x][1] = new function(){}

			if($.rows[y][x].up)
			{
				//renderCells[y][x][0].texture = new THREE.ImageUtils.loadTexture("brick.bmp");
				//renderCells[y][x][0].material = new THREE.MeshBasicMaterial({map: renderCells[y][x][0].texture});
				
				renderCells[y][x][0].geometry = new THREE.CubeGeometry( 320, 200, 0, 0, 0, 0);//, null);
				renderCells[y][x][0].mesh = new THREE.Mesh(renderCells[y][x][0].geometry)//, renderCells[y][x][0].material);
				
				renderCells[y][x][0].mesh.position.x = ((x+1)*320) - (320/2);
				renderCells[y][x][0].mesh.position.y = 100;
				renderCells[y][x][0].mesh.position.z = y*320//(h*320) - y;
				THREE.GeometryUtils.merge(finalWallGeometry, renderCells[y][x][0].mesh);
				//scene.add(renderCells[y][x][0].mesh);
			}/*
			if($.rows[y][x].left)
			{
				//renderCells[y][x][1].texture = new THREE.ImageUtils.loadTexture("brick.bmp");
				//renderCells[y][x][1].material = new THREE.MeshBasicMaterial({map: renderCells[y][x][1].texture});
				renderCells[y][x][1].geometry = new THREE.CubeGeometry( 0, 200, 320, 1, 1, 1, null);
				renderCells[y][x][1].mesh = new THREE.Mesh(renderCells[y][x][1].geometry)//, renderCells[y][x][1].material);
				renderCells[y][x][1].mesh.position.x = ((x)*320)// - (320/2);
				renderCells[y][x][1].mesh.position.y = 100;
				renderCells[y][x][1].mesh.position.z = ((y+1)*320) - (320/2);//(h*320) - y;
				THREE.GeometryUtils.merge(finalWallGeometry, renderCells[y][x][1].mesh);
				//scene.add(renderCells[y][x][1].mesh);
			}*//*
		}
	}
	*//*
	var finalWallGeometry = new THREE.Geometry();
	
	var ggeometry = new THREE.CubeGeometry( 320, 200, 0, 0, 0, 0);//, null);
	var gmesh = new THREE.Mesh(ggeometry)//, renderCells[y][x][0].material);
	gmesh.position.x = ((0+1)*320) - (320/2);
	gmesh.position.y = 100;
	gmesh.position.z = 0*320//(h*320) - y;
	THREE.GeometryUtils.merge(finalWallGeometry, gmesh);
	
	var finalWallMesh = new THREE.Mesh( finalWallGeometry, new THREE.MeshFaceMaterial({map: new THREE.ImageUtils.loadTexture("brick.bmp")}));
	scene.add(finalWallMesh);
	*/
	
	//---------------------------------------------------------------------------------------------------------------------//