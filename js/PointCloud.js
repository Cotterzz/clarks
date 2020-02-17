class PointCloud extends THREE.Object3D{
	constructor(){
		super();
		this.pointArray=global.verticesAndNormals;
        this.hasNormalData = true;
        this.pointSize = 6;//this.hasNormalData ? 6 : 3;
		this.amount = this.pointArray.length;
    	this.material=null;
    	this.geometry=null;
    	this.system=null;
        this.minY=0;
        this.maxY=0;
        this.minX=0;
        this.maxX=0;
        this.minZ=0;
        this.maxZ=0;

        this.scanWidth = 33;
        this.scanDepth = 33;
        this.scanHeight = 12;


    }

    init(){
        console.log("init");
    	this.geometry = new THREE.Geometry();
        this.material = new THREE.PointsMaterial({
            //color: "#000000",
            vertexColors: THREE.VertexColors,
            size: 0.1,
            //blending: THREE.AdditiveBlending
        });
        var mult = 100;
        var multc = 0.5;//256;
        for (var p = 0; p < this.amount; p+=this.pointSize) {
            var pX = this.pointArray[p]*mult,
                pY = this.pointArray[p+1]*mult,
                pZ = this.pointArray[p+2]*mult;
            if(pZ>0){pZ=0}
            var localParticle = new THREE.Vector3(pX, pY, pZ);
            var cX = (this.pointArray[p+4]+1)*multc,
                cY = (this.pointArray[p+5]+1)*multc,
                cZ = (this.pointArray[p+6]+1)*multc;
            if(pX>this.maxX){this.maxX=pX}else if (pX<this.minX){this.minX=pX};
            if(pY>this.maxY){this.maxY=pY}else if (pY<this.minY){this.minY=pY};
            if(pZ>this.maxZ){this.maxZ=pZ}else if (pZ<this.minZ){this.minZ=pZ};
            //var col = new THREE.Vector3(cX, cY, cZ);
            //this.refObject.updateMatrixWorld();
            //var globalParticle = this.refObject.localToWorld ( localParticle );
            localParticle.x +=40;
            this.geometry.vertices.push(localParticle);
          // if(cX<0){cX=1+cX};
          // if(cY<0){cY=1+cY};
          // if(cZ<0){cZ=1+cZ};
            this.geometry.colors.push(new THREE.Color( cX, cY, cZ ));
        }
        this.system = new THREE.Points(this.geometry, this.material);
        this.system.sortParticles = true;
        this.add(this.system);
        this.geometry.verticesNeedUpdate = true;
        //this.animate();
        console.log("Limits:", this.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ);
    }

    animate() {
    	var xmax = 0
		var xmin = 0
		var zmax = 0
		var zmin = 0
        for (var p = 0; p < this.amount; p+=this.pointSize) {
            var pX = this.pointArray[p],
              pY = this.pointArray[p+1],
              pZ = this.pointArray[p+2];
            var localParticle = new THREE.Vector3(pX, pY, pZ);
            //this.refObject.updateMatrixWorld();
            //var globalParticle = this.refObject.localToWorld ( localParticle );
            //localParticle.x +=40;
            if(localParticle.x>xmax){xmax=localParticle.x}
				else if(localParticle.x<xmin){xmin=localParticle.x};
			if(localParticle.z>zmax){zmax=localParticle.z}
				else if(localParticle.z<zmin){zmin=localParticle.z};
            this.geometry.vertices[p/this.pointSize].x = localParticle.x;
            this.geometry.vertices[p/this.pointSize].y = localParticle.y;
            this.geometry.vertices[p/this.pointSize].z = localParticle.z;
        }
        this.system.sortParticles = true;
        this.geometry.verticesNeedUpdate = true;
        return (new THREE.Vector4( xmin, xmax, zmin, zmax ));
	}
}