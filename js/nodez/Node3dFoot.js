class Node3dFoot extends Node3d {
	constructor(x, y, z, text, isroot, scale=1, level=0, type = "none"){
		super(x, y, z, text, isroot, scale, level, type);
		this.foot = new Foot(text);
		super.add(this.foot);
		this.foot.y = -10;
		this.foot.scale.x = this.foot.scale.y = this.foot.scale.z = 2;
		global.viewport.addEventListener("enterframe", () => { this.enterFrame() } );
	}

	enterFrame(){
        if(this.foot.mesh){this.foot.mesh.rotation.y +=0.01;}
    }
}