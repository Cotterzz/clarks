class Foot extends THREE.Object3D{
	constructor(path){
		super();
		this.step = 0.1;
		this.limit = global.TAU;
		this.minimum = 0;
		this.footmesh = new THREE.Mesh();
		this.footmeshcontainer = new THREE.Mesh();
		this.add(this.footmeshcontainer);
		this.footmeshcontainer.add(this.footmesh);
		//this.footmesh.castShadow = true; 
		//this.footmesh.receiveShadow = true;
		this.footmesh.scale.x = this.footmesh.scale.y = this.footmesh.scale.z = 0.1;
     	
     	//this.footmesh.rotation.z = -global.ETA/3.2;
     	this.footmesh.rotation.x = global.ETA;
     	this.footmesh.position.x =-16;
     	this.footmesh.position.z =-33;
     	this.footmesh.position.y =3;
     	this.minimumWidth = null;
     	this.associatedLength = null;
     	this.associatedRotation = null;
		this.modelPath = path;
		this.loader = null;
		this.box = null;
		this.wirebox = null;
		this.pointCloud = null;
		this.createBox();
	}

	createBox(){
		//var geometry = new THREE.BoxGeometry( 40, 40, 40 );
		//var material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
		//this.box = new THREE.Mesh( geometry, material );
		//this.box.castShadow = true; 
		//this.box.receiveShadow = true;
		//this.add( this.box );
		//this.loadOBJModel("pointcloud/cloud.obj");
		//this.loadPLYModel("testfeet/left2500.ply");
		this.loadPointCloud();
	}

	loadPointCloud(){
		this.pointCloud = new PointCloud();
		this.pointCloud.init();
		this.footmesh.add(this.pointCloud);
	}
	 
	loadPLYModel(path){
		console.log("LPLY");
		this.loader = new THREE.PLYLoader();
		this.loader.load( path,  ( geometry ) => {
			console.log(geometry);
			var material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
			//var material = new THREE.MeshBasicMaterial( { 
    		//	color: 0xaaaaaa, 
    		//	flatShading: tr
    		//	vertexColors: THREE.VertexColors // THREE.FaceColors;
			//});
			
			geometry.computeFaceNormals();
  			var loadedmesh = new THREE.Mesh(geometry, material);
  			loadedmesh.castShadow = true; 
			loadedmesh.receiveShadow = true;
  			//this.add(loadedmesh);
  			this.footmesh.add(loadedmesh);
  			//this.getLimitsOf(geometry, loadedmesh)
  			var gArray = geometry.attributes.position.array;
     		this.pointCloud = new PointCloudGlobal(gArray.length, gArray, loadedmesh);
			this.add(this.pointCloud);
			this.pointCloud.init();

			//for ( var i = 0; i < geometry.faces.length(); i ++ ) {
    		//	var face  = geometry.faces[ i ];
    		//	//var colString = "rgb(" + Math.floor((face.normal.x+1)*128) + ", " + Math.floor((face.normal.y+1)*128) + ", " + Math.floor((face.normal.z+1)*128) + ")";
    		//	var colString = "rgb(0, " + Math.floor((face.normal.y+1)*128) + ", " + Math.floor((face.normal.z+1)*128) + ")";
    		//	//var colString = "rgb(" + Math.floor((face.normal.x+1)*128) + ", 0, 0)";
    		//	//var colString = "rgb(0, 0, " + Math.floor((face.normal.z+1)*128) + ")";
    		//	//var colString = "rgb(0, " + Math.floor((face.normal.y+1)*128) + ", 0)";
    		//	console.log(colString)
    		//	face.color = new THREE.Color(colString);
			//}

  		});
	}

	getLimitsOf(geometry, object){
		var gArray = geometry.attributes.position.array;
		var currentLocalVector = new THREE.Vector3( gArray[0], gArray[1], gArray[2] );
		var currentGlobalVector = object.localToWorld ( currentLocalVector );
		var currentObjectVector = object.worldToLocal ( currentGlobalVector );

		var xmax = currentObjectVector.x;
		var xmin = currentObjectVector.x;
		var ymax = currentObjectVector.y;
		var ymin = currentObjectVector.y;
		var zmax = currentObjectVector.z;
		var zmin = currentObjectVector.z;

		console.log("Length:", gArray.length);
		for ( var i = 3; i < gArray.length; i +=3 ) {
			currentLocalVector = new THREE.Vector3( gArray[i], gArray[i+1], gArray[i+2] );
			currentGlobalVector = object.localToWorld ( currentLocalVector );
			//currentGlobalVector = object.worldToLocal ( currentGlobalVector );
			//console.log(currentGlobalVector.x, currentGlobalVector.y, currentGlobalVector.z)

			if(currentGlobalVector.x>xmax){xmax=currentGlobalVector.x}
				else if(currentGlobalVector.x<xmin){xmin=currentGlobalVector.x};
			i++;
			if(currentGlobalVector.y>ymax){ymax=currentGlobalVector.y}
				else if(currentGlobalVector.y<ymin){ymin=currentGlobalVector.y};
			i++;
			if(currentGlobalVector.z>zmax){zmax=currentGlobalVector.z}
				else if(currentGlobalVector.z<zmin){zmin=currentGlobalVector.z};
		}
		this.createWireBox();
		this.setWireBox(xmin, xmax, ymin, ymax, zmin, zmax);
	}

	createWireBox(){
		var geometry = new THREE.BoxGeometry( 10, 10, 10 );
		var material = new THREE.MeshBasicMaterial({color: 0xaaaaaa, wireframe:true});
		this.wirebox = new THREE.Mesh( geometry, material );
		this.add( this.wirebox );
	}

	setWireBox(xp, xm, yp, ym, zp, zm){
		xm*=2;
		zm*=2;
		//console.log("SWB", xp, xm, yp, ym, zp, zm)
		this.wirebox.position.x = xp;
		this.wirebox.position.y = yp;
		this.wirebox.position.z = zp;
		this.wirebox.scale.x = xm-xp;
		this.wirebox.scale.y = ym-yp;
		this.wirebox.scale.z = zm-zp;
		this.wirebox.verticesNeedUpdate = true;
		this.wirebox.updateMatrix(); 
		this.wirebox.geometry.applyMatrix( this.wirebox.matrix );
		this.wirebox.matrix.identity();
	}

	loadSTLModel(){
		console.log("LSTL");
		this.loader = new THREE.STLLoader();
		this.loader.load( "testfeet/left.stl",  ( geometry ) => {
			console.log("LSTLOAD");
			//var material = new THREE.MeshBasicMaterial({color: 0xffffff});
			var material = new THREE.MeshBasicMaterial( { 
    			color: 0xf5f5f5, 
    			flatShading: true,
    			vertexColors: THREE.VertexColors // THREE.FaceColors;
			});
			console.log(geometry);
  			this.footmesh = new THREE.Mesh(geometry, material)
  			this.add(this.footmesh);
  			this.footmesh.scale.x = this.footmesh.scale.y = this.footmesh.scale.z = .050;
     		this.footmesh.rotation.x = -global.ETA;
     		this.footmesh.rotation.z = global.ETA;
     		this.footmesh.position.x +=4;
     		this.footmesh.position.y +=2;
     		geometry.computeFaceNormals();

			for ( var i = 0; i < geometry.faces.length; i ++ ) {
    			var face  = geometry.faces[ i ];
    			//var colString = "rgb(" + Math.floor((face.normal.x+1)*128) + ", " + Math.floor((face.normal.y+1)*128) + ", " + Math.floor((face.normal.z+1)*128) + ")";
    			var colString = "rgb(0, " + Math.floor((face.normal.y+1)*128) + ", " + Math.floor((face.normal.z+1)*128) + ")";
    			//var colString = "rgb(" + Math.floor((face.normal.x+1)*128) + ", 0, 0)";
    			//var colString = "rgb(0, 0, " + Math.floor((face.normal.z+1)*128) + ")";
    			//var colString = "rgb(0, " + Math.floor((face.normal.y+1)*128) + ", 0)";
    			console.log(colString)
    			face.color = new THREE.Color(colString);
			}

  		});
	}

	loadOBJModel(path){
		this.loader = new THREE.OBJLoader();
		this.loader.load( path,  ( object ) => {
			console.log(object);
			
  			var loadedmesh = object;
  			var geometry = loadedmesh.children[0].geometry
  			loadedmesh.castShadow = true; 
			loadedmesh.receiveShadow = true;
  			//this.add(loadedmesh);
  			this.footmesh.add(loadedmesh);
  			//this.getLimitsOf(geometry, loadedmesh);
  			var gArray = geometry.attributes.position.array;
     		this.pointCloud = new PointCloud(gArray.length, gArray, loadedmesh);
			this.add(this.pointCloud);
			this.pointCloud.init();

			//for ( var i = 0; i < geometry.faces.length(); i ++ ) {
    		//	var face  = geometry.faces[ i ];
    		//	//var colString = "rgb(" + Math.floor((face.normal.x+1)*128) + ", " + Math.floor((face.normal.y+1)*128) + ", " + Math.floor((face.normal.z+1)*128) + ")";
    		//	var colString = "rgb(0, " + Math.floor((face.normal.y+1)*128) + ", " + Math.floor((face.normal.z+1)*128) + ")";
    		//	//var colString = "rgb(" + Math.floor((face.normal.x+1)*128) + ", 0, 0)";
    		//	//var colString = "rgb(0, 0, " + Math.floor((face.normal.z+1)*128) + ")";
    		//	//var colString = "rgb(0, " + Math.floor((face.normal.y+1)*128) + ", 0)";
    		//	console.log(colString)
    		//	face.color = new THREE.Color(colString);
			//}

  		});
			//this.loader.load( "models/" + this.modelPath + "/left.obj",  ( object ) => {
     		//this.footmesh = object;
     		//this.add(object);
	}

	update(){

		/*
		if(this.footmeshcontainer){
			this.footmeshcontainer.rotation.y += this.step;
			if(this.footmeshcontainer.rotation.y>this.limit || this.footmeshcontainer.rotation.y<this.minimum){
				if(this.associatedRotation+this.step<this.footmeshcontainer.rotation.y){
					this.footmeshcontainer.rotation.y = this.associatedRotation+this.step;
				}
				
				this.limit = this.associatedRotation+this.step;
				this.minimum = this.associatedRotation-this.step;
				this.step *= -0.95;
			}
			//console.log("ROTATION", this.footmeshcontainer.rotation.y);
			//console.log("MINUMUM WIDTH:", this.minimumWidth);
			//console.log("FOOT LENGTH:", this.associatedLength);
			//if(this.box.scale.y>0.1){
			//	this.box.position.y -= 0.04;
			//	this.box.scale.y -= 0.002;
			//}
			if(this.pointCloud){
				var measurement = this.pointCloud.animate();
				//this.setWireBox(measurement.x, measurement.y, 0, 2, measurement.z, measurement.w);
				if(this.minimumWidth==null||((measurement.y-measurement.x)<this.minimumWidth)){
					this.minimumWidth = (measurement.y-measurement.x);
					this.associatedLength = (measurement.w-measurement.z);
					this.associatedRotation = this.footmeshcontainer.rotation.y
					//console.log(measurement);
					//console.log("XXXROTATION", this.footmeshcontainer.rotation.y);
					//console.log("XXXMINUMUM WIDTH:", this.minimumWidth);
					//console.log("XXXFOOT LENGTH:", this.associatedLength);
					this.footmeshcontainer.rotation.y -= 0.009;
				}
			}
		}

		*/
	}
}



	// CHECK ORIENTATION

	// ORIENT CORRECTLY

	// CHECK DISPLAY SIZE

	// RESIZE AS APPROPRIATE

	// REVEAL FOOT
/*
		loader.parse( gltfData, null, ( gdata ) => {
			
     		this.add(this.mesh);
			this.mesh.add(gdata.scene);
			this.footShape=gdata.scene;
			var f = this.footShape;
			//f.position.z +=100;
			this.mesh.scale.x = this.mesh.scale.y = this.mesh.scale.z = 0.02;
			//this.mesh.position.y +=1;
	
			f.children[2].material.color.set(0x00ff00);
			this.footShape.children[2].material.metalness = 0.2;
			this.footShape.children[2].material.roughness = 0.7;

			console.log("GEOM",this.chirality, this.footShape.children[2].geometry )

			//this.mesh.geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );
			var geometry = new THREE.Geometry().fromBufferGeometry( this.footShape.children[2].geometry );
			console.log("FACES", geometry.faces.length);

			//geometry = new THREE.BoxGeometry( 10, 10, 10, 2, 2, 2 );
			var material = new THREE.MeshBasicMaterial( { 
    			color: 0xf0f0f0, 
    			shading: THREE.FlatShading,
    			vertexColors: THREE.VertexColors // THREE.FaceColors;
			});
			var box = new THREE.Mesh( geometry, material );
			geometry.computeFaceNormals();

			for ( var i = 0; i < geometry.faces.length; i ++ ) {
    			var face  = geometry.faces[ i ];
    			//var colString = "rgb(" + Math.floor((face.normal.x+1)*128) + ", " + Math.floor((face.normal.y+1)*128) + ", " + Math.floor((face.normal.z+1)*128) + ")";
    			var colString = "rgb(0, " + Math.floor((face.normal.y+1)*128) + ", " + Math.floor((face.normal.z+1)*128) + ")";
    			//var colString = "rgb(" + Math.floor((face.normal.x+1)*128) + ", 0, 0)";
    			//var colString = "rgb(0, 0, " + Math.floor((face.normal.z+1)*128) + ")";
    			//var colString = "rgb(0, " + Math.floor((face.normal.y+1)*128) + ", 0)";
    			console.log(colString)
    			face.color = new THREE.Color(colString);
			}

			geometry.elementsNeedUpdate = true;
			this.helper = new THREE.FaceNormalsHelper( box, 15, 0x000055, 1 );
			//this.helper = new THREE.VertexNormalsHelper( this.mesh, 2, 0x00ff00, 1 );
			this.mesh.add(box);
			//box.position.y-=5;
			//this.helper.position.y-=10
			//this.mesh.add(this.helper);
			this.helper.scale.x = this.helper.scale.y = this.helper.scale.z = 0.02;

			//if(chirality=="Right"){
				//this.mesh.rotation.x=1.5708;
				//this.mesh.position.y+=4;
				//this.mesh.position.z-=3;
			//}
			this.mesh.position.y += 2;
			this.mesh.position.z += 1;


		});
*/
