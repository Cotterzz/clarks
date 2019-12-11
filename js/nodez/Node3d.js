class Node3d extends THREE.Object3D {
    constructor(x, y, z, text, isroot, scale=1, level=0, type = "none"){
    	super();
    	this.title = text;
    	this.growth = 0;
    	this.state = "start";
    	this.childNodes = [];
    	this.type = type;
    	this.displayText = this.title;
    	this.textColour = "#000000";
    	this.bgColour = "#ffffff";
    	this.border = 10;
    	this.padding = 20;
    	this.fontSize = 80;
    	this.fontName = "Varela Round";

		this.label = new Label3d(this.displayText, scale, this.border, this.padding, this.fontSize, this.fontName, this.textColour, this.bgColour);

		this.label.node = this;
		this.joins = [];
		this.add(this.label);
		this.position.x = x;
		this.position.y = y;
		this.position.z = z;
		this.dist = Math.sqrt((x*x)+(y*y));
		this.inc = 1/this.dist;
		this.isroot = isroot;
		this.level = level;
		if(!isroot){
			this.join = new Curve3d(x, y, z, scale/2);
			this.add(this.join);
		}
		this.hide();
	}

	updateJoin(held=false){
		for (var i = 0; i < this.joins.length; i++){
			this.joins[i].update();
			//console.log("UPDATE", i)
		}
		for (var j = 0; j < this.childNodes.length; j++){
			if(this.childNodes[j].joins){
				this.childNodes[j].updateJoin();
			}
		}
		if(!this.isroot){
			if(!held){
				this.join.update(this.position.x,this.position.y,this.position.z);
			} else {
				this.join.update(this.parent.position.x,this.parent.position.y,this.parent.position.z);
			}
			
		}
	}

	update(){
		if(this.state == "start"){
			this.show();
		}
		if(this.state=="growing"){
			this.growth +=this.inc;
			this.join.lengthAsFraction = this.growth*1.5;
			if(this.growth>0.9){
				this.label.visible = true;
				this.label.scale.x = (this.growth-0.9)*10;
			}
			this.join.update(this.position.x,this.position.y,this.position.z);
			if(this.growth>=1){
				this.grown();
			}
		} else if (this.state=="grown"){
			for (var j = 0; j < this.childNodes.length; j++){
				this.childNodes[j].update();
			}
		}
	}

	grown(){
		this.state = "grown";
		this.label.scale.x = 1;
		this.growth = 1;
	}

	getOnScreen(){
		var th = 0.8;
		var p = this.localToWorld(new THREE.Vector3());
		global.camera.updateMatrixWorld(); // FIX
		p.project(  global.camera  )
  		//console.log(this.title, p)
  		if ((p.x<th)&&(p.x>-th)&&(p.y<th)&&(p.y>-th)){
  			return true;
  		} else {
  			return false;
  		}
	}

	show(){
		if(this.getOnScreen()){
			this.visible = true;
			if(this.isroot){
				this.grown();
			} else {
				this.state = "growing";
				this.label.visible = false;
				//console.log("growing", this.title);
			}
			for (var i = 0; i < this.joins.length; i++){
				this.joins[i].update();
			}
		}
	}

	hide(){
		this.visible = false;
		for (var i = 0; i < this.joins.length; i++){
			this.joins[i].update();
		}
	}

	
}