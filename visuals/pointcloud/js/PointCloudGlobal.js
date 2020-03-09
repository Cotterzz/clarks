class PointCloudGlobal extends THREE.Object3D{
	constructor(amount, pointArray, refObject){
		super();
		this.refObject = refObject;
		this.pointArray=pointArray;
		this.amount=amount;
    	this.material=null;
    	this.geometry=null;
    	this.system=null;
    }

    init(){
    	this.geometry = new THREE.Geometry();
        this.material = new THREE.PointsMaterial({
            color: "#000000",
            size: 1.1,
            //blending: THREE.AdditiveBlending
        });
        //var mult = 2;
        for (var p = 0; p < this.amount; p+=3) {
            var pX = this.pointArray[p],//*mult,
                pY = this.pointArray[p+1],//*mult,
                pZ = this.pointArray[p+2];//*mult;
            var localParticle = new THREE.Vector3(pX, pY, pZ);
            this.refObject.updateMatrixWorld();
            var globalParticle = this.refObject.localToWorld ( localParticle );
            localParticle.x +=40;
            this.geometry.vertices.push(localParticle);
        }
        this.system = new THREE.Points(this.geometry, this.material);
        this.system.sortParticles = true;
        this.add(this.system);
        this.geometry.verticesNeedUpdate = true;
        //this.animate();
    }

    animate() {
    	var xmax = 0
		var xmin = 0
		var zmax = 0
		var zmin = 0
        for (var p = 0; p < this.amount; p+=3) {
            var pX = this.pointArray[p],
              pY = this.pointArray[p+1],
              pZ = this.pointArray[p+2];
            var localParticle = new THREE.Vector3(pX, pY, pZ);
            this.refObject.updateMatrixWorld();
            var globalParticle = this.refObject.localToWorld ( localParticle );
            //localParticle.x +=40;
            if(localParticle.x>xmax){xmax=localParticle.x}
				else if(localParticle.x<xmin){xmin=localParticle.x};
			if(localParticle.z>zmax){zmax=localParticle.z}
				else if(localParticle.z<zmin){zmin=localParticle.z};
            this.geometry.vertices[p/3].x = localParticle.x;
            this.geometry.vertices[p/3].y = localParticle.y;
            this.geometry.vertices[p/3].z = localParticle.z;
        }
        this.system.sortParticles = true;
        this.geometry.verticesNeedUpdate = true;
        return (new THREE.Vector4( xmin, xmax, zmin, zmax ));
	}
}