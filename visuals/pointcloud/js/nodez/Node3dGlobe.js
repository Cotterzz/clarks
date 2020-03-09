class Node3dGlobe extends Node3d {
	constructor(x, y, z, text, isroot, scale=1, level=0, type = "none"){
		super(x, y, z, text, isroot, scale, level, type);
		this.globe = new Globe();
		super.add(this.globe);
		this.globe.y = -10;
		this.globe.scale.x = this.globe.scale.y = this.globe.scale.z = 2;
		global.viewport.addEventListener("enterframe", () => { this.enterFrame() } );
	}

	enterFrame(){
        if(this.globe.mesh){this.globe.mesh.rotation.y +=0.01;}
    }
}