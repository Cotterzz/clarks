class NodeBuilder extends NodeWeaVR{
	constructor(){
		super();
	}

    createFromGenreList(array){
        for (var i = 0; i < array.length; i++) {
            var subArray = array[i].title.split(".");
            var idString = "";
            var parent = false;
            for (var j = 0; j < subArray.length; j++) {
                idString = idString + subArray[j];
                if (this.nodesByName[idString]){
                    //console.log(idString);
                    // node Already Exists, make it parent of next node
                } else {
                    this.nodesByName[idString] = this.addNode(subArray[j], parent, array[i].id, array[i].x,array[i].y, array[i].z); 
                }
                parent = this.nodesByName[idString];
                idString = idString + "_";
            }
        }
    }

    addJoins(joinArray){
        console.log(joinArray);
        console.log(this.nodesByName);
        for (var i = 0; i < joinArray.length; i++) {
            var joinObject = joinArray[i];
            console.log(joinObject);
            console.log(joinObject.nodeA, joinObject.nodeB);
            console.log(this.nodesByName[joinObject.nodeA], this.nodesByName[joinObject.nodeB]);
            this.addJoin(this.nodesByName[joinObject.nodeA], this.nodesByName[joinObject.nodeB], joinObject.thickness);
        }
    }

	addJoin(node1, node2, thickness){
        console.log(node1, node2);
    	var newJoin = new Join3d(node1, node2, thickness);
		this.viewport.scene.add(newJoin);
		this.joins.push(newJoin);
		return(newJoin);
    }

    addNode(title="newNode", parent=false, xpos=null, ypos=null, zpos=null, type="none"){
    	var nodeParent = (parent) ? parent : this.viewport.scene;//console.log("parent:", parent, "nodeParent:", nodeParent);
    	var isRoot = (parent) ? false : true;
    	
    	var x = (parent) ? (xpos) ? (global.unit * xpos) : nodeParent.children.length * ((nodeParent.children.length % 2) - 0.5) * global.unit * 7 : (xpos) ? global.unit *xpos : global.originX;
    	var y = (parent) ? (ypos) ? (global.unit * ypos) : global.unit * -5 : (ypos) ? (global.unit * ypos)+global.originY : global.originY;
    	var z = (parent) ? (zpos) ? (global.unit * zpos) : global.unit * 3 : (zpos) ? (global.unit * zpos)+global.originZ : global.originZ;
        
        var level;
        if(isRoot){
            level = 0;
        } else {
            level = nodeParent.level +1;
        }
        var scale = 2;
        if(level==1){
            scale=1.5;
        } else if (level>1){
            scale = 1;
        }

        var nodeClass;
        switch(type) {
            case "none": nodeClass = Node3d; break;
            case "globe": nodeClass = Node3dGlobe; break;
            case "foot": nodeClass = Node3dFoot; break;
            default: nodeClass = Node3d; break;
            
        }
        if(type=="none"){ nodeClass = Node3d}
    	var newNode = new nodeClass(x, y, z, title, isRoot, scale, level, type);
		this.nodes.push(newNode);
        if(isRoot){this.rootnodes.push(newNode)} else {nodeParent.childNodes.push(newNode)}
        //if(id){this.nodesByID[id] = newNode};
        //this.nodesByName // should be here, but requires parent names so TODO
		this.labels.push(newNode.label);
		nodeParent.add(newNode);
		return(newNode);
    }

    createFromJSON(data){
        this.createFromArray(data.nodes);
        this.addJoins(data.joins);
    }

    createFromArray(nodeArray, parent=false, parentString=""){
        for (var i = 0; i < nodeArray.length; i++) {
            var nodeObject = nodeArray[i];
            var newNode = this.addNode(nodeObject.title, parent, nodeObject.x, nodeObject.y, nodeObject.z, nodeObject.type);
            this.nodesByName[parentString + nodeObject.title] = newNode; 
            if(nodeObject.nodes){
                this.createFromArray(nodeObject.nodes, newNode, parentString + nodeObject.title + ".");
            }
        }
    }
}