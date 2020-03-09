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
        this.baseSize = 333;
        this.baseStart = 20;
        this.baseEnd = -5;
        this.base = [];
        this.base2 = [];
        this.bevel = [];
        this.baseThreshold = 15;
        this.bevelAmount = 5
        this.baseThreshold2 = this.baseThreshold - this.bevelAmount;
        this.bevelIncrements = [3,2,2,1,2,1,1,2,1,1,1,2,1,0,0,0,1,0,0,0,0,0,1,0];

        this.showRawData = true;
        this.pointBuffer = [];
        this.pointHeight = 120;
        this.pointStart = -this.baseEnd;
    }

    init(){
        for (var p = 0; p< this.pointHeight; p+=1) {
            this.pointBuffer[p] = [];
        };
        // prepare base array
        var cutoff = 20;
        for (var bv = 0; bv < this.bevelAmount; bv+=1) {
            this.bevel[bv] = [];
        };

        for (var bx = 0; bx < this.baseSize; bx+=1) {
            this.base[bx] = [];
            this.base2[bx] = [];
            for (var p = 0; p< this.pointHeight; p+=1) {
                    this.pointBuffer[p][bx] = [];
                };
            for (var bv = 0; bv < this.bevelAmount; bv+=1) {
                this.bevel[bv][bx] = [];
            };
            for (var by = 0; by < this.baseSize; by+=1) {
                if((bx>cutoff)&&(by>cutoff)){
                    this.base[bx][by]=true;
                } else {
                    this.base[bx][by]=false;
                }
                this.base2[bx][by]=false;
                for (var p = 0; p< this.pointHeight; p+=1) {
                    this.pointBuffer[p][bx][by] = false;
                };
                for (var bv = 0; bv < this.bevelAmount; bv+=1) {
                    this.bevel[bv][bx][by] = false;
                };
                
            }
            //console.log(this.base[bx].length);
        }
        //console.log("init", this.base);
    	this.geometry = new THREE.Geometry();
        this.material = new THREE.PointsMaterial({
            //color: "#000000",
            vertexColors: THREE.VertexColors,
            size: 0.1,
            //blending: THREE.AdditiveBlending
        });
        var mult = 1000;
        var multc = 0.5;//256;
        for (var p = 0; p < this.amount; p+=this.pointSize) {
            var pX = this.pointArray[p]*mult,
                pY = this.pointArray[p+1]*mult,
                pZ = this.pointArray[p+2]*mult;
                
            if(pX>this.maxX){this.maxX=pX}else if (pX<this.minX){this.minX=pX};
            if(pY>this.maxY){this.maxY=pY}else if (pY<this.minY){this.minY=pY};
            if(pZ>this.maxZ){this.maxZ=pZ}else if (pZ<this.minZ){this.minZ=pZ};


            if(pZ>this.baseEnd){
                //console.log(pX, pY, pZ)
                if(this.showRawData){
                    var localParticle = new THREE.Vector3(pX, pY, pZ);
                    this.geometry.vertices.push(localParticle);
                    this.geometry.colors.push(new THREE.Color( 0, 1, 0 ));
                }

                var rx = Math.floor(pX);
                var ry = Math.floor(pY);
                //console.log(rx, ry);
                this.base[rx][ry] = false;
                for (var t = -this.baseThreshold; t < this.baseThreshold; t+=1) {
                    for (var v = -this.baseThreshold; v < this.baseThreshold; v+=1) {
                        if(((rx+t)>=0)&&((rx+t)<this.baseSize)&&((ry+v)>=0)&&((ry+v)<this.baseSize)){
                            if(Math.sqrt((v*v)+(t*t))<this.baseThreshold){
                                this.base[rx+t][ry+v]=false;
                            }
                        }
                            
                    }
                }
            } else{
                if(this.showRawData){
                    var localParticle = new THREE.Vector3(pX, pY, pZ);
                    this.geometry.vertices.push(localParticle);
                    this.geometry.colors.push(new THREE.Color( 0, 1, 0 ));
                }

                var rx = Math.floor(pX);
                var ry = Math.floor(pY);
                var rz = Math.floor(-pZ);

                this.pointBuffer[rz][rx][ry] = true;
            }
        }



        for (var bx = 0; bx < this.baseSize; bx+=1) {
            for (var by = 0; by < this.baseSize; by+=1) {
                if(this.base[bx][by]==true){
                    for (var t = -this.baseThreshold2; t < this.baseThreshold2; t+=1) {
                        for (var v = -this.baseThreshold2; v < this.baseThreshold2; v+=1) {
                            if(((bx+t)>=0)&&((bx+t)<this.baseSize)&&((by+v)>=0)&&((by+v)<this.baseSize)){
                                if(Math.sqrt((v*v)+(t*t))<this.baseThreshold2){
                                     this.base2[bx+t][by+v]=true;
                                }
                            }
                        }
                    }
                }
            }
        }

        this.incLayer(this.bevel[0] , this.base2, this.bevelIncrements[0]);

        for (var bv = 1; bv < this.bevelAmount; bv+=1) {


            this.incLayer(this.bevel[bv] , this.bevel[bv-1], this.bevelIncrements[bv])

        };

        for (var bx = 0; bx < this.baseSize; bx+=1) {
            for (var by = 0; by < this.baseSize; by+=1) {
                if(this.base2[bx][by]==true){
                    var localParticle = new THREE.Vector3(bx, by, 0);
                    this.geometry.vertices.push(localParticle);
                    this.geometry.colors.push(new THREE.Color( 0, 0, 0 ));
                }
                for (var bv = 0; bv < this.bevelAmount; bv+=1) {
                    if(this.bevel[bv][bx][by]==true){
                        var localParticle = new THREE.Vector3(bx, by, -1-bv);
                        this.geometry.vertices.push(localParticle);
                        this.geometry.colors.push(new THREE.Color( 0, 0, 0 ));
                    }
                }
            }
        }

        this.incLayer(this.pointBuffer[this.pointStart-1], this.bevel[this.bevelAmount-1], 1)

        for (var p = this.pointStart; p< this.pointHeight; p+=1) {
            for (var bx = 0; bx < this.baseSize; bx+=1) {
                for (var by = 0; by < this.baseSize; by+=1) {
                    if((this.pointBuffer[p][bx][by]==false)&&(this.pointBuffer[p-1][bx][by]==true)){
                        this.pointBuffer[p][bx][by]=true;
                        var localParticle = new THREE.Vector3(bx, by, -p);
                        this.geometry.vertices.push(localParticle);
                        this.geometry.colors.push(new THREE.Color( 0, 0, 0, 0.1 ));
                    } else{
                        this.pointBuffer[p][bx][by]=false;
                    }
                }
            }
        };



        this.system = new THREE.Points(this.geometry, this.material);
        this.system.sortParticles = true;
        this.add(this.system);
        this.geometry.verticesNeedUpdate = true;
        //this.animate();
        console.log("Limits:", this.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ);
    }

    incLayer(arryA, arryB, amnt){
        for (var bx = 0; bx < this.baseSize; bx+=1) {
            for (var by = 0; by < this.baseSize; by+=1) {
                if(arryB[bx][by]==true){
                    for (var t = -amnt; t < amnt; t+=1) {
                        for (var v = -amnt; v < amnt; v+=1) {
                            if(((bx+t)>=0)&&((bx+t)<this.baseSize)&&((by+v)>=0)&&((by+v)<this.baseSize)){
                                if(Math.sqrt((v*v)+(t*t))<amnt){
                                    arryA[bx+t][by+v]=true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }



        /*
                    if((pZ<=-5)&&(pZ>-20)){pZ+=-200; pX+=340};
            if((pZ<=-20)&&(pZ>-35)){pZ+=-200; pX+=680};
            if((pZ<=-35)&&(pZ>-50)){pZ+=-200; pX+=1020};
            if((pZ<=-50)&&(pZ>-65)){pZ+=-200; pY-=340};
            if((pZ<=-65)&&(pZ>-80)){pZ+=-200; pY-=340; pX+=340};
            if((pZ<=-80)&&(pZ>-95)){pZ+=-200; pY-=340; pX+=680};
            if((pZ<=-95)&&(pZ>-120)){pZ+=-200; pY-=340; pX+=1020};
            var localParticle = new THREE.Vector3(Math.floor(pX), Math.floor(pY), Math.floor(pZ));
            var cX = (this.pointArray[p+4]+1)*multc,
                cY = (this.pointArray[p+5]+1)*multc,
                cZ = (this.pointArray[p+6]+1)*multc;

            //var col = new THREE.Vector3(cX, cY, cZ);
            //this.refObject.updateMatrixWorld();
            //var globalParticle = this.refObject.localToWorld ( localParticle );
            localParticle.x +=40;
            this.geometry.vertices.push(localParticle);
          // if(cX<0){cX=1+cX};
          // if(cY<0){cY=1+cY};
          // if(cZ<0){cZ=1+cZ};
            this.geometry.colors.push(new THREE.Color( cX, cY, cZ ));
        */


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