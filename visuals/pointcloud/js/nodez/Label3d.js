class Label3d extends THREE.Mesh {
    constructor(text="label", scale=1, border = 10, padding = 20, fontSize=80, fontName="Quicksand", color = "#000000", bgcolor = "#ffffff"){
    	var testcanvas = document.createElement('canvas');
		testcanvas.width = 2048;
		testcanvas.height = 200;
		var col;
		var bcol;
		if(global.depth){
            col = "#ffffff";
            bcol = "#ffffff";
        } else {
            col = color;
            bcol = bgcolor;
        }
		var font = fontSize + "px " + fontName;
		var testctx = testcanvas.getContext('2d');
		testctx.font = font;
		var testmetrics = testctx.measureText(text);
		var totalwidth = testmetrics.width + (padding*2);
		var sizes = [64, 128, 256, 512, 1024, 2048];
		var geomsize = 32;
		var size = 2048;
		for (var i = sizes.length; i>0; i--){
			if (totalwidth<sizes[i]){
				size = sizes[i];
				geomsize = Math.pow(2, i);
			}
		}
		geomsize *= global.unit * scale;
		var lineSpaceSize = fontSize*0.24;
		var x = padding;
		var y = padding + (fontSize - lineSpaceSize);
		var canvas = document.createElement('canvas');
		canvas.width = canvas.height = size;
		var ctx = canvas.getContext('2d');
		ctx.font = font;
		ctx.fillStyle = col;
    	ctx.fillRect(0, 0, canvas.width, canvas.height);
    	var metrics = ctx.measureText(text);
    	ctx.fillStyle = bcol;
    	ctx.fillRect(border, border, (metrics.width + (padding*2))-(border*2), (fontSize + (padding*2))-(border*2));
    	ctx.fillStyle = col;
    	ctx.fillText(text, x, y);
    	y += fontSize;
	
    	var texture = new THREE.Texture(canvas);
	
    	var yperc = (fontSize+(padding*2))/size;
    	var xperc = (metrics.width+(padding*2))/size;
    	texture.repeat.set(xperc,yperc);
    	texture.offset.set(0,1-yperc)
    	texture.wrapS = THREE.RepeatWrapping;
    	texture.wrapT = THREE.RepeatWrapping;
    	//console.log("B: " , texture.magFilter, texture.minFilter)
    	texture.magFilter = THREE.LinearFilter;
    	texture.minFilter = THREE.LinearFilter;
    	//console.log("A: " , texture.magFilter, texture.minFilter)
    	texture.anisotropy = 16;
    	
    	texture.needsUpdate = true;
    	var material = new THREE.MeshBasicMaterial( {map:texture,side: THREE.DoubleSide} );
	
    	//var material = new THREE.MeshPhongMaterial({map: texture,side:THREE.DoubleSide,bumpMap: texture,bumpScale: 0.15,specularMap: texture,specular: new THREE.Color('#ffffff')})
    	//console.log("SIZE:", geomsize*xperc, geomsize*yperc)
		var geometry = new THREE.PlaneGeometry( geomsize*xperc, geomsize*yperc, 2, 2 );
		super( geometry, material );
		this.faceWidth = geomsize*xperc;
		this.faceHeight = geomsize*yperc;
    }
}