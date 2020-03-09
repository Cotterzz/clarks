class Curve3d extends THREE.Mesh {
    constructor(x,y,z, w = 0.1){
        var col;
        if(global.depth){
            col = new THREE.Color( 0x000000 );
        } else {
            col = new THREE.Color( 0x000000 );
        }
        var resolution = new THREE.Vector2( window.innerWidth/2, window.innerHeight/2 );
        var lw = global.unit*w;
        var material = new MeshLineMaterial( {
            //useMap: false,
            color: col,
            //opacity: 1,
            resolution: resolution,
            sizeAttenuation: true,
            lineWidth: lw,
            //color: 0xff0000
        });
        super( new THREE.Geometry(), material );
        this.lengthAsFraction = 0;
        this.maxLengthAsFraction = 1;
        this.update(x,y,z);
    }

    update(x,y,z){
        z=-z; y=-y; x=-x;
        var zoffset = -global.unit/5;
        var sx=0, sy=0, sz=zoffset;
        z+=zoffset;
        var distance = Math.sqrt((x*x)+(y*y)+(z*z));
        var curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3( sx, sy, sz ),
            new THREE.Vector3( x, sy, sz-(distance*0.5) ),
            new THREE.Vector3( sx, y, z-(distance*0.5) ),
            new THREE.Vector3( x, y, z )
        );
        var points = curve.getPoints( 20 );
        var geometry = new THREE.Geometry().setFromPoints( points );
        var line = new MeshLine();
        //line.setGeometry( geometry , function( p ) { return p-this.lengthAsFraction; } );
        line.setGeometry( geometry , (p) => {return p+(this.lengthAsFraction-1);});
        this.geometry = line.geometry;  
        this.geometry.verticesNeedUpdate = true;
    }
}