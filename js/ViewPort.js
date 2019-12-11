class ViewPort extends THREE.Object3D{
    constructor() {
        super();
        this.scene = new THREE.Scene();
        //this.container = document.getElementById("container");
        //this.scene.overrideMaterial=new THREE.MeshDepthMaterial( );
        if(global.depth){
            this.scene.fog = new THREE.Fog( 0x000000, 100, 250 );
        }
        this.renderer = new THREE.WebGLRenderer({canvas:document.getElementById("canvas3d"),antialias:true});
        this.renderer.physicallyCorrectLights = true;
    	//this.renderer.shadowMap.enabled = true;
        //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap; //// THREE.PCFShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if(global.depth){
            this.scene.background = new THREE.Color( 0x000000 );
        } else {
            this.scene.background = new THREE.Color( 0x7799ff );
        }
    	
    	this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
        //this.camera = new THREE.OrthographicCamera(window.innerWidth/-20, window.innerWidth/20, window.innerHeight/20, window.innerHeight/-20, 1, 1000);
    	this.scene.add(this.camera);
    	this.camera.position.set(0, 0,100);
    	this.camera.near = 0.0001;
    	this.camera.lookAt(this.scene.position);
    	this.orbitcontrols = new THREE.OrbitControls(this.camera, document.getElementById("canvas3d"));
        this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8), new THREE.MeshBasicMaterial({color: 0xff00ff}));
    	this.light = new THREE.AmbientLight(0xffffff, 2);
    	this.scene.add(this.light);
        this.light1 = new THREE.PointLight(0xffffff, 200, 100, 2);
        this.scene.add(this.light1);
        this.light1.position.set(10, 20, 10);
        global.camera = this.camera;
        global.viewport = this;
        this.light2 = new THREE.DirectionalLight( 0xffffff, 1 );
        this.scene.add(this.light2);
        this.light2.position.set(-10, 20, 10);

    	if(global.VR){
            this.renderer.vr.enabled = true;
            document.body.appendChild( WEBVR.createButton( this.renderer ) );
    		this.vranimate()}
    	else {
    		this.animate();
			this.plane.visible = false;
			this.scene.add(this.plane);
    	};
    }

    animate(){
		requestAnimationFrame(() => { this.animate() } );
    	this.renderer.render(this.scene, this.camera);
        this.dispatchEvent({ type: "enterframe" });
	}

	vranimate(){  this.renderer.setAnimationLoop( () => { this.vrrender() } )}

    vrrender(){
        this.renderer.render(this.scene, this.camera);
        this.dispatchEvent({ type: "enterframe" });
    }
}