window.global = new Global();
var nodeweavr;
window.addEventListener('load', function() {
    nodeweavr = new NodeBuilder();
	nodeweavr.createFromJSON(data);
})

/*
var fizztest = new Fizz3d(global.viewport,50, 50);
nodeweavr.viewport.scene.add(fizztest);

for (var i=0; i < 100; i++) {
	point = new THREE.Vector3( Math.random()*30-15, Math.random()*30-15, Math.random()*30-15);
	size = Math.random()*2
	fp = new FizzPoint(fizztest, point, size, size , size)
	fizztest.addFizzpoint(fp);
	fp.velocity.x = (Math.random()*0.2)-0.1;
	fp.velocity.y = (Math.random()*0.2)-0.1;
	fp.velocity.z = (Math.random()*0.2)-0.1;
}  AAAA
*/



