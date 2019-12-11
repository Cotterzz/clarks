class NodeWeaVR {
    constructor() {

    	this.nodes = [];
    	this.rootnodes = [];
    	this.nodesByID = {};
    	this.nodesByName = {};
		this.labels = [];
		this.joins = [];
		this.oldeventX = null;
		this.oldeventY = null;
		this.controllerA = null;
        this.controllerB = null;
        this.controllers = 0;
		this.cursor = {};
		this.cursor.position = new THREE.Vector3()
		this.movedA = null;
		this.movedB = null;
		this.rotatedA = null;
		this.rotatedB = null;
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.vector = new THREE.Vector3();

		if(global.VR){
			window.addEventListener( 'vr controller connected', (event) => {this.vrControllerAdded(event)});
		} else {
			document.addEventListener( 'mousemove', (event) => {this.onDocumentMouseMove(event)}, false );
			document.addEventListener( 'mousedown', (event) => {this.onDocumentMouseDown(event)}, false );    
			document.addEventListener( 'mouseup', (event) => {this.onDocumentMouseUp(event)}, false ); 
		}

		document.addEventListener('keydown', (event) => {this.onDocumentKeyDown(event)}, false );

		this.viewport = new ViewPort();
		this.viewport.addEventListener("enterframe", () => { this.enterFrame() } );
    }


    onDocumentKeyDown(event){
    	if(event.key == "s"){
    		if(event.getModifierState("Control")){
    			event.preventDefault();
				console.log("SAVE KEYS PRESSED");
				this.saveTextAsFile();
    		}	
    	}
    }

    saveTextAsFile(){

    	/*
    	for (var prop in this.nodesByName) {
    		var dotted = prop.replace(/_/g, ".");
    		var np = this.nodesByName[prop].position;
    		var outputString = '{"title":"' + dotted + '","id":' + this.nodesByName[prop].nid +',"x":' + np.x + ',"y":' + np.y + ',"z":' + np.z + '},'
  			console.log(outputString);
		}
		*/
		var rString = '	var data = { "nodes": [';
		for (var i = 0; i < this.rootnodes.length; i++) {
    		rString += this.getOutPutText(this.rootnodes[i]);
    	};
    	rString += '],"joins": []}';
    	console.log("OUTPUT:" + rString);
    }

    getOutPutText(node){
    	var np = node.position;
    	var rString = '{"title":"' + node.title + '","type":"' + node.type + '","x":' + np.x + ',"y":' + np.y + ',"z":' + np.z + ',"nodes":[';
    	for (var i = 0; i < node.childNodes.length; i++) {
    		rString += this.getOutPutText(node.childNodes[i]);
    	};
    	rString += ']},';
    	return rString;
    }
    
    checkCollisions(){
        if(this.controllerA){ this.checkCollision(this.controllerA) };
        if(this.controllerB){ this.checkCollision(this.controllerB) };
    }

    checkCollision(controller){
		var threshold = 0.1;
		var collide = false;
		for (var i = 0; i < this.nodes.length; i++) {
			var pointA = this.nodes[i].localToWorld(new THREE.Vector3());
			var pointB = controller.localToWorld(new THREE.Vector3());
			var vt = this.nodes[i].label.faceHeight/2;
			var ht = this.nodes[i].label.faceWidth/2;
			if (pointB.z<pointA.z && pointB.z>pointA.z-threshold){
				if (pointB.x<(pointA.x+ht) && pointB.x>(pointA.x-ht)){
					if (pointB.y<(pointA.y+vt) && pointB.y>(pointA.y-vt)){
						collide=true;
						controller.touching = this.nodes[i];
					}
				}
			}
		}
		if(!collide){
			controller.touching = null;
		}
		return collide;
	}

    refresh(){

    	for (var i = 0; i < this.rootnodes.length; i++) {
    		this.rootnodes[i].update();
    	};

        if(this.cursor){
            for (var i = 0; i < this.nodes.length; i++) {
            	if(this.cursor.touching==this.nodes[i]){
                	this.nodes[i].label.material.color.setHex( 0xff00ff );
            	} else {
                	this.nodes[i].label.material.color.setHex( 0xffffff );
            	}
       		}
    	}
    	if(this.controllerA && this.controllerB) {
    		for (var i = 0; i < this.nodes.length; i++) {
        		if(this.controllerA.touching==this.nodes[i]){
            		if(this.controllerB.touching==this.nodes[i]) {
                	// BOTH
                		this.nodes[i].label.material.color.setHex( 0x0000ff );
            		} else {
                	// CONTROLLER A
                	this.nodes[i].label.material.color.setHex( 0xff0000 );
            		}
        		} else if(this.controllerB.touching==this.nodes[i]) {
                	// CONTROLLER B
                	this.nodes[i].label.material.color.setHex( 0x00ff00 );
        		} else {
                	// NEITHER
                	this.nodes[i].label.material.color.setHex( 0xffffff );
            	}
        	}
        	if(this.controllerA.touching){this.controllerA.setVibe( "label", 0.5 )} else {this.controllerA.setVibe( "label", 0 );}
        	if(this.controllerB.touching){this.controllerB.setVibe( "label", 0.5 )} else {this.controllerB.setVibe( "label", 0 );}
        	if(this.controllerA.holding){
            	//this.movedA = new THREE.Vector3().subVectors(this.controllerA.position, this.controllerA.grab.position);
            	//this.controllerA.holding.position.addVectors(this.controllerA.grabbed.position, this.movedA);

            	//this.rotatedA = new THREE.Vector3().subVectors(this.controllerA.rotation.toVector3(), this.controllerA.grab.rotation.toVector3());
            	//this.controllerA.holding.rotation.setFromVector3(new THREE.Vector3().addVectors(this.controllerA.grabbed.rotation.toVector3(), this.rotatedA));

            	this.controllerA.holding.updateJoin(true);
        	}
        	if(this.controllerB.holding){
            	//this.movedB = new THREE.Vector3().subVectors(this.controllerB.position, this.controllerB.grab.position);
            	//this.controllerB.holding.position.addVectors(this.controllerB.grabbed.position, this.movedB);

            	//this.rotatedB = new THREE.Vector3().subVectors(this.controllerB.rotation, this.controllerB.grab.rotation);
            	//this.controllerB.holding.rotation.addVectors(this.controllerB.grabbed.rotation, this.rotatedB);

            	this.controllerB.holding.updateJoin(true);
        	}
    	}
    }

    move(objectToMove, containerDestination){


    	//console.log("ContainerDestination:", containerDestination);
    	objectToMove.oldParent = objectToMove.parent;
    	containerDestination.attach(objectToMove);


    	/*
    	objectToMove.oldParent = objectToMove.parent;
    	//console.log("Object:", objectToMove, "Parent:", objectToMove.parent)
    	var newPositionGlobal = objectToMove.localToWorld(new THREE.Vector3()).clone();
    	var newPositionLocal = containerDestination.worldToLocal(newPositionGlobal).clone();
    	containerDestination.add(objectToMove);
    	objectToMove.position.copy(newPositionLocal);

    	//objectToMove.getWorldQuaternion
    	//objectToMove.rotation.copy(containerDestination.rotation.inverse());
    	//console.log(objectToMove.rotation, containerDestination.rotation);


    	//console.log("A:", objectToMove.rotation.x, objectToMove.rotation.y, objectToMove.rotation.z);
    	//console.log("B:", containerDestination.rotation.x, containerDestination.rotation.y, containerDestination.rotation.z);
    	
    	
    	//objectToMove.rotation.z -= (containerDestination.rotation.z-objectToMove.rotation.z);
    	//objectToMove.rotation.y -= (containerDestination.rotation.y-objectToMove.rotation.y);
    	//objectToMove.rotation.x -= (containerDestination.rotation.x-objectToMove.rotation.x);
    	//console.log("C:", objectToMove.rotation.x, objectToMove.rotation.y, objectToMove.rotation.z);

    	var quatB = new THREE.Quaternion();
    	quatB.setFromEuler(containerDestination.rotation);
    	objectToMove.rotation.setFromQuaternion(quatB.inverse());
    	//var quatC = new THREE.Quaternion();
    	//quatC.multiplyQuaternions(quatB.inverse(), quatA.inverse());
    	//objectToMove.rotation.setFromQuaternion(quatB.inverse());
    	//console.log(quatA, quatB);
    	*/
    }

    moveBack(objectToMove, containerDestination){

    	objectToMove.oldParent.attach(objectToMove);
    	//this.move(objectToMove, containerDestination)
    	/*
    	objectToMove.oldParent = objectToMove.parent;
    	//console.log("Object:", objectToMove, "Parent:", objectToMove.parent)
    	var newPositionGlobal = objectToMove.localToWorld(new THREE.Vector3()).clone();
    	var newPositionLocal = containerDestination.worldToLocal(newPositionGlobal).clone();
    	containerDestination.add(objectToMove);
    	objectToMove.position.copy(newPositionLocal);

    	var quatB = new THREE.Quaternion();
    	quatB.setFromEuler(objectToMove.oldParent.rotation);
    	objectToMove.rotation.setFromQuaternion(quatB);
		*/
    }
    // abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ
    // abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ
    // abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ
    // abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ
    
    enterFrame(){
    	if(global.VR){
    		THREE.VRController.update();
        	this.checkCollisions();
        }
        this.refresh();
    }

    onDocumentMouseMove(event){
    	//console.log("mousemove");
		this.oldeventX = event.clientX;
		this.oldeventY = event.clientY;
		this.vector.set( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5); // z = 0.5 important!
    	this.vector.unproject( this.viewport.camera );
    	this.raycaster.set( this.viewport.camera.position, this.vector.sub( this.viewport.camera.position ).normalize() );
		//raycaster.setFromCamera( mouse.clone(), viewport.camera );
		var objects = this.raycaster.intersectObjects(this.labels);
		this.cursor.touching = null;
		if (objects.length>0) {
        	this.cursor.touching = objects[0].object.node;
        	this.viewport.plane.position.copy (this.cursor.touching.localToWorld(new THREE.Vector3()).clone());
        	//console.log("LABELS:", this.labels, "OBJECTS:", objects, "touching:", this.cursor.touching);
    	}
    	this.viewport.plane.visible = true;

    	var intersect = this.raycaster.intersectObject(this.viewport.plane);
    	if(intersect.length>0){
    		this.cursor.position.copy(intersect[0].point);
		}
    	this.viewport.plane.visible = false;
    	if(this.cursor.holding){
    		//console.log("cursor:", this.cursor.position.x, this.cursor.position.y, this.cursor.position.z);
    		//console.log("grab:", this.cursor.grab.position.x, this.cursor.grab.position.y, this.cursor.grab.position.z);
			this.movedA = new THREE.Vector3().subVectors(this.cursor.position, this.cursor.grab.position);
			//console.log("moved:", this.movedA.x, this.movedA.y, this.movedA.z);
			//var oldZ= this.cursor.holding.position.z;
			this.cursor.holding.position.copy(this.cursor.grabbed.position);
			this.cursor.holding.position.x += this.movedA.x;
			this.cursor.holding.position.y += this.movedA.y;
			//this.cursor.holding.position.z = oldZ;
			this.cursor.holding.updateJoin();
		}
	}

	onDocumentMouseDown(event){
		if(this.cursor.touching!=null){
			this.cursor.holding = this.cursor.touching;
			this.viewport.orbitcontrols.enabled = false;
			//var position = this.cursor.holding.localToWorld(new THREE.Vector3()).clone();
			//this.viewport.plane.position.copy (this.cursor.holding.localToWorld(new THREE.Vector3()));
			this.viewport.plane.position.copy (this.cursor.holding.localToWorld(new THREE.Vector3()).clone());
			this.cursor.grab = {position:null, rotation:null}; 
			this.cursor.grab.position = this.cursor.position.clone();
			this.cursor.grabbed = {position:null, rotation:null}; 
			this.cursor.grabbed.position = this.cursor.holding.position.clone();
			//console.log("grabbed node:", this.cursor.grabbed.position.x, this.cursor.grabbed.position.y, this.cursor.grabbed.position.z);
			this.cursor.holding.dispatchEvent({ type: "nodepress" });
		}
	}

	onDocumentMouseUp(event){
		if(this.cursor.holding!=null){
			console.log("SET:", this.cursor.holding.title, this.cursor.holding.position.x, this.cursor.holding.position.y, this.cursor.holding.position.z);
			this.cursor.holding  = null;
			this.viewport.orbitcontrols.enabled = true;
		}
	}

	vrControllerAdded(event){
		console.log("VR CONTROLLER ADDED");
		var controller;
		this.controllers +=1
		if(this.controllers==1){
			this.controllerA = controller = event.detail;
		} else if(this.controllers==2){
			this.controllerB = controller = event.detail;
		} else {
			console.log("MORE THAN TWO CONTROLLERS ADDED");
		}
	
		this.viewport.scene.add( controller );
		controller.standingMatrix = this.viewport.renderer.vr.getStandingMatrix();
		controller.head = window.camera
		var
			meshColorOff = 0xDB3236,//  Red.
			meshColorOn  = 0xF4C20D,//  Yellow.
			controllerMaterial = new THREE.MeshStandardMaterial({color: meshColorOff}),
			controllerMesh = new THREE.Mesh(new THREE.CylinderGeometry( 0.005, 0.05, 0.1, 6 ),controllerMaterial),
			handleMesh = new THREE.Mesh(new THREE.BoxGeometry( 0.03, 0.1, 0.03 ),controllerMaterial)
		controllerMaterial.flatShading = true
		controllerMesh.rotation.x = -Math.PI / 2
		handleMesh.position.y = -0.05
		controllerMesh.add( handleMesh )
		controller.userData.mesh = controllerMesh
		controller.add( controllerMesh )
		controllerMesh.position.z = 0.05;
		controller.addEventListener( 'grip value changed', function( event ){
			//console.log(event.type, event.target, event.value);
			if(event.value>0.9 && !event.target.holding && event.target.touching) {

				event.target.holding = event.target.touching;

				nodeweavr.move(event.target.holding, event.target);

				//event.target.grab = {position:null, rotation:null}; 
				//event.target.grab.position = event.target.position.clone();
				//event.target.grab.rotation = event.target.rotation.clone();
				//event.target.grabbed = {position:null, rotation:null}; 
				//event.target.grabbed.position = event.target.holding.position.clone();
				//event.target.grabbed.rotation = event.target.holding.rotation.clone();
				//event.target.holding.dispatchEvent({ type: "nodepress" });
			}
			if(event.value<0.8 && event.target.holding ) {
				event.target.touching = event.target.holding;
				nodeweavr.moveBack(event.target.holding, event.target);
				event.target.holding = null;
			}
		})

		controller.addEventListener( 'disconnected', function( event ){
			controller.parent.remove( controller );
		})
	};
}