class Foot extends THREE.Object3D{
	constructor(path){
		super();
		this.footmesh = null;
		this.modelPath = path;
		this.loader = null;
		this.box = null;
		this.createBox();
	}

	createBox(){
		var geometry = new THREE.BoxGeometry( 40, 20, 40 );
		var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
		this.box = new THREE.Mesh( geometry, material );
		this.add( this.box );
		this.loadPLYModel();
	}

	loadPLYModel(){
		console.log("LPLY");
		this.loader = new THREE.PLYLoader();
		this.loader.load( "testfeet/left2.ply",  ( geometry ) => {
			var material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
			//var material = new THREE.MeshBasicMaterial( { 
    		//	color: 0xaaaaaa, 
    		//	flatShading: true,
    		//	vertexColors: THREE.VertexColors // THREE.FaceColors;
			//});
			console.log(geometry);
			geometry.computeFaceNormals();
  			this.footmesh = new THREE.Mesh(geometry, material)
  			this.add(this.footmesh);
  			this.footmesh.scale.x = this.footmesh.scale.y = this.footmesh.scale.z = 40;
     		this.footmesh.rotation.x = -global.ETA;
     		this.footmesh.rotation.z = global.ETA;
     		//this.footmesh.position.x +=4;
     		this.footmesh.position.y +=2;
     		

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

	loadOBJModel(){
		this.loader = new THREE.OBJLoader();
		this.loader.load( "models/" + this.modelPath + "/left.obj",  ( object ) => {
     		this.footmesh = object;
     		this.add(object);

     		
     		console.log("HERE",this.footmesh.children[0].geometry)
     		this.footmesh.scale.x = this.footmesh.scale.y = this.footmesh.scale.z = 50;
     		this.footmesh.rotation.x = -global.ETA;
     		this.footmesh.rotation.z = global.ETA;
     		this.footmesh.position.x +=4;
     		this.footmesh.position.y +=2;
     		this.hbox = new THREE.BoxHelper( this.footmesh, 0x000000 );
			this.add( this.hbox );
			//this.bbox = new THREE.Box3().setFromObject( object );
			//console.log( this.bbox.min, this.bbox.max, this.bbox.getSize(new THREE.Vector3()) );
			//this.box.position.set ( this.bbox.min.x , this.bbox.min.y , this.bbox.min.z );
			
   		})
	}

	update(){
		if(this.footmesh){
			this.footmesh.rotation.z += 0.01;
			if(this.box.scale.y>0){
				this.box.position.y -= 0.05;
				this.box.scale.y -= 0.005;
			}
			this.checkOrientation();
		}
		
	}

	checkOrientation(){

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
