class Node3dFoot extends Node3d {
	constructor(x, y, z, text, isroot, scale=1, level=0, type = "none"){
		super(x, y, z, "My Foot", isroot, scale, level, type);
		this.footPath = text;
		this.foot = null;
		global.viewport.addEventListener("enterframe", () => { this.enterFrame() } );
	}

	enterFrame(){
        if(this.foot){
        	this.foot.update();
        }
    }

    grown(){
    	console.log("GROWNNODEFOOT");
    	super.grown();
    	this.foot = new Foot(this.footPath);
    	this.foot.castShadow = true; 
		this.foot.receiveShadow = true;
		super.add(this.foot);
    }
}