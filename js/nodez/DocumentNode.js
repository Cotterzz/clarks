class DocumentNode extends Node3d {
    constructor(x, y, z, text, isroot, scale=1){
    	super(x, y, z, text, isroot, scale);
    	this.canvas = document.createElement('canvas');
    	this.size = 128;
    	this.color = "#ffffff";
		this.canvas.width = this.canvas.height = this.size;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.fillStyle = this.color;
    	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);



    	//ctx.beginPath();
    	//ctx.moveTo(75, 50);
    	//ctx.lineTo(100, 75);
    	//ctx.lineTo(100, 25);
    	//ctx.fill();

    	this.texture = new THREE.Texture(this.canvas);
    	this.texture.needsUpdate = true;
    	this.material = new THREE.MeshBasicMaterial( {map:this.texture,side: THREE.DoubleSide} );
    	this.geometry = new THREE.PlaneGeometry( 3*global.unit, 4*global.unit, 2, 2 );
    	this.mesh = new THREE.Mesh( this.geometry, this.material);
    }
}