class Join3d extends THREE.Mesh {
    constructor(nodeA, nodeB, thickness){
    	super();
    	var col;
        if(global.depth){
            col = new THREE.Color( 0x000000 );
        } else {
            col = new THREE.Color( 0x001155 );
        }
    	this.nodeA = nodeA;
		this.nodeB = nodeB;
        var resolution = new THREE.Vector2( window.innerWidth/2, window.innerHeight/2 );
        var lw = global.unit*thickness;
        var material = new MeshLineMaterial( {
			//useMap: false,
			color: col,
			//opacity: 1,
			resolution: resolution,
			sizeAttenuation: true,
			lineWidth: lw,
			//color: 0xff0000
		});
        this.material = material;
        console.log(this.nodeA, this.nodeB);
		this.nodeA.joins.push(this);
		this.nodeB.joins.push(this);
		this.update();

    }

    update(){
        var pointA = this.nodeA.localToWorld(new THREE.Vector3());
		var pointB = this.nodeB.localToWorld(new THREE.Vector3());
		var x = pointB.x;
		var y = pointB.y;
		var z = pointB.z;
		var sx = pointA.x;
		var sy = pointA.y;
		var sz = pointA.z;
		var distance = Math.sqrt((x*x)+(y*y)+(z*z));
		var curve = new THREE.CubicBezierCurve3(
			new THREE.Vector3( sx, sy-(this.nodeA.label.faceHeight/2), sz ),
			new THREE.Vector3( sx, sy-(global.unit*5), sz ),
			new THREE.Vector3( x, y-(global.unit*5), z ),
			new THREE.Vector3( x, y-(this.nodeB.label.faceHeight/2), z )
		);
        var points = curve.getPoints( 50 );
        var geometry = new THREE.Geometry().setFromPoints( points );
        var line = new MeshLine();
        line.setGeometry( geometry );
        this.geometry = line.geometry;  
        this.geometry.verticesNeedUpdate = true;

        if((this.nodeA.visible == false) || (this.nodeB.visible == false)) {
        	this.visible = false;
        } else {
        	this.visible = true;
        }
    }
}