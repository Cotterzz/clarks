I am trying to render a geometry with each face colored by a random color.

I iterate through geometry.faces and set a random color for each face. Upon that I create a new material which is added to the mesh. It seems to me that I've set all the necessary flags, but still my object appears pitch black in the scene.

The scene contains two directional lights, as well as ambient light. In case I use THREE.MeshPhongMaterial the object also appears black, but has some reflections from directional light.

Here is the code:

var geometry = new THREE.Geometry().fromBufferGeometry( object );

for ( var i = 0; i < geometry.faces.length; i ++ ) {

    var face = geometry.faces[ i ];
    face.color.setHex( Math.random() * 0xffffff );
}

var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );

var mesh = new THREE.Mesh( geometry, material);
mesh.dynamic = true;
mesh.geometry.colorsNeedUpdate = true;

scene.add( mesh );
I am using the latest version of three.js: r84

Does anyone see what I am missing?

javascript three.js
shareimprove this question
edited Mar 29 '17 at 11:32

gman
62.6k1919 gold badges142142 silver badges234234 bronze badges
asked Mar 29 '17 at 8:37

pGos
1511 silver badge88 bronze badges
It should be fromBufferGeometry( object.geometry ). – WestLangley Mar 29 '17 at 14:28
Are you sure? It does work this way now. I am asking since I am only new to Three.js. Is this working by accident? What is the difference? – pGos Mar 29 '17 at 15:11
Did you try what I suggested? – WestLangley Mar 29 '17 at 15:12
I did, it doesn't work. Uncaught TypeError: Cannot read property 'index' of undefined at Geometry.fromBufferGeometry (three.js:12636) at 3DViewer.js:57 at STLLoader.js:51 at XMLHttpRequest.<anonymous> (three.js:29269) – pGos Mar 30 '17 at 9:08 
You must pass in a THREE.BufferGeometry to Geometry.fromBufferGeometry(). – WestLangley Mar 30 '17 at 15:16
Sorry, I don't understand "in a THREE.BufferGeometry"? what do you mean by in? – pGos Mar 30 '17 at 15:21
The argument to Geometry.fromBufferGeometry() must be an instance of THREE.BufferGeometry. Is the variable you call object an instance of THREE.BufferGeometry? – WestLangley Mar 30 '17 at 15:28
add a comment
1 Answer
activeoldestvotes

0

Huh! I got it! We can't just assign color to a face, but we need to assign it to each vertex. Yes, then we have interpolation, which is not really something I want, but at least we can see colors. In case someone knows how to assign color for the face directly without interpolation, I'd be grateful for advice!

This is the new version of the code, just adapt the for loop:

var faceIndices = [ 'a', 'b', 'c' ];
for ( var i = 0; i < geometry.faces.length; i ++ ) {
    var face  = geometry.faces[ i ];
    for( var j = 0; j < 3; j++ ) {
        color = new THREE.Color( 0xffffff );
        color.setHex( Math.random() * 0xffffff );
        face.vertexColors[ j ] = color;
    }
}


I am attempting to change the color on a single face of a mesh. This is in a WebGL context. I can change the entire mesh color, just not a single Face. Relevant code below:

// Updated Per Lee!

var camera = _this.camera;      
var projector = new THREE.Projector();
var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,                                  - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
projector.unprojectVector( vector, camera );

var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
var intersects = ray.intersectObjects( kage.scene.children );

if ( intersects.length > 0 ) {
    face = intersects[0].face;
    var faceIndices = ['a', 'b', 'c', 'd'];         
    var numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
    // assign color to each vertex of current face
    for( var j = 0; j < numberOfSides; j++ )  {
        var vertexIndex = face[ faceIndices[ j ] ];
    // initialize color variable
    var color = new THREE.Color( 0xffffff );
    color.setRGB( Math.random(), 0, 0 );
    face.vertexColors[ j ] = color;
    }
}
I also initialize the object, in this case a Cube as follows:

// this material causes a mesh to use colors assigned to vertices
var material = new THREE.MeshBasicMaterial( { 
    color: 0xf0f0f0, 
    shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors 
});

var directionalLight = new THREE.DirectionalLight(0xEEEEEE);
directionalLight.position.set(10, 1, 1).normalize();
kage.scene.add(directionalLight);

var cube = new THREE.Mesh(new THREE.CubeGeometry(300, 300, 300,1,1,1), material);
cube.dynamic = true;
kage.scene.add(cube);
Changing the material makes the cube white regardless of the light color. The intersection logic still works, meaning i select the correct face, but alas the color does not change.

I'm new to Stackoverflow [well asking a question that is, so hopefully my edits are not confusing]

javascript three.js
shareimprove this question
edited Sep 27 '12 at 21:07

Matthias
5,75266 gold badges4545 silver badges8080 bronze badges
asked Jun 28 '12 at 20:43

adamsch1
25311 gold badge22 silver badges99 bronze badges
add a comment
5 Answers
activeoldestvotes

24

Update library to r53.
Add vertexColors: THREE.FaceColors in material.
And finally use face.color.setRGB( Math.random(),
Math.random(), Math.random()).

Now no need to traverse loop for 4 sides (a,b,c,d) for THREE.Face4 or 3 sides (a,b,c) for THREE.Face3.

This works in both WebGL and Canvas rendering.

Example

three.js r53

shareimprove this answer
answered Dec 24 '12 at 8:08

Valay
1,62022 gold badges2424 silver badges6363 bronze badges
9
This got me close, but needed to add geometry.colorsNeedUpdate = true – twmulloy Sep 30 '15 at 22:33
add a comment


6

Assuming that "myGeometry" is the geometry containing the face that you would like to change the color of, and "faceIndex" is the index of the particular face that you want to change the color of.
// the face's indices are labeled with these characters 
var faceIndices = ['a', 'b', 'c', 'd'];  

var face = myGeometry.faces[ faceIndex ];   

// determine if face is a tri or a quad
var numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;

// assign color to each vertex of current face
for( var j = 0; j < numberOfSides; j++ )  
{
    var vertexIndex = face[ faceIndices[ j ] ];
    // initialize color variable
    var color = new THREE.Color( 0xffffff );
    color.setRGB( Math.random(), 0, 0 );
    face.vertexColors[ j ] = color;
}
Then, the mesh needs to use the following material so that face colors are derived from the vertices:

// this material causes a mesh to use colors assigned to vertices
var cubeMaterial = new THREE.MeshBasicMaterial( 
    { color: 0xffffff, shading: THREE.FlatShading, 
    vertexColors: THREE.VertexColors } );
shareimprove this answer
answered Jun 29 '12 at 15:16

Lee Stemkoski
7,37711 gold badge3636 silver badges5555 bronze badges
Thank Lee, I updated my code snippet per your feedback. Alas the face is not changing color. I think I might be setting things up incorrectly outside my intersection logic which is preventing the color change to stick. – adamsch1 Jun 30 '12 at 0:10
add a comment

4

I'm rather new to three.js, but most of these examples seem overly long and complicated. The following code seems to color all 12 triangular faces for a cube... (WebGLRenderer r73).

One thing I noted when doing this is that the order of the faces is a little strange (to me as a novice at least).

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
console.log(geometry.faces.length); // 12 triangles
geometry.faces[0].color = new THREE.Color(0x000000); //Right 1
geometry.faces[1].color = new THREE.Color(0xFF0000); //Right 2
geometry.faces[2].color = new THREE.Color(0xFF8C08); //Left 1
geometry.faces[3].color = new THREE.Color(0xFFF702); //Left 2
geometry.faces[4].color = new THREE.Color(0x00FF00); //Top 1
geometry.faces[5].color = new THREE.Color(0x0000FF); //Top 2
geometry.faces[6].color = new THREE.Color(0x6F00FF); //Bottom 1
geometry.faces[7].color = new THREE.Color(0x530070); //Bottom 2
geometry.faces[8].color = new THREE.Color(0x3F3F3F); //Front 1
geometry.faces[9].color = new THREE.Color(0x6C6C6C); //Front 2
geometry.faces[10].color = new THREE.Color(0xA7A7A7);//Rear 1
geometry.faces[11].color = new THREE.Color(0xFFFFFF);//Rear 2
shareimprove this answer
edited Mar 14 '16 at 12:47

Arnon Zilca
3,51444 gold badges2626 silver badges4040 bronze badges
answered Feb 27 '16 at 17:06

Gus
5,65144 gold badges2828 silver badges5353 bronze badges
7
No need to instantiate a new color. Use color.setHex( 0xff0000 ); – WestLangley Feb 27 '16 at 21:50
Cool thx for the hint :) I was doing that based on an example I had seen. – Gus Feb 28 '16 at 5:59
add a comment

2

As per Three JS Geometry Document, To signal an update in this faces, Geometry.elementsNeedUpdate needs to be set to true.

The following snippet changes the colors of all faces.

mesh.material.vertexColors = THREE.FaceColors

var faces = mesh.geometry.faces;

for(var i = 0 ; i < faces.length; i++){
  var face = faces[i];
  var color = new THREE.Color("rgb(255, 0, 0)");
  face.color = color;
}

mesh.geometry.elementsNeedUpdate = true;

render();
shareimprove this answer
answered Jun 26 '17 at 19:13

Harish_N
1,89022 gold badges1313 silver badges2828 bronze badges
3
Do NOT instantiate a new THREE.Color if face colors already exist. Instead do faces[ i ].color.setRGB( 1, 0, 0 ); and then mesh.geometry.colorsNeedUpdate = true;. Re-read the referenced doc. – WestLangley Jun 26 '17 at 19:47
add a comment

1

I think the method listed above only works in the WebGLRenderer. If you're going for something that works in both the CanvasRenderer and WebGLRenderer it's a bit more complicated, but I suspect the end result is more efficient both in terms of memory use and performance.

After going through the THREE.jS Projector.js source, this is how I did it:

// create the face materials
var material_1 = new THREE.MeshLambertMaterial(
    {color : 0xff0000, shading: THREE.FlatShading, overdraw : true}
);
var material_2 = new THREE.MeshLambertMaterial(
    {color : 0x00ff00, shading: THREE.FlatShading, overdraw : true}
);

// create a geometry (any should do)
var geom = new THREE.CubeGeometry(1,1,1);

// add the materials directly to the geometry
geom.materials.push(material_1);
geom.materials.push(material_2);

// assign the material to individual faces (note you assign the index in 
// the geometry, not the material)
for( var i in geom.faces ) {
    var face = geom.faces[i];
    face.materialIndex = i%geom.materials.length;
}

// create a special material for your mesh that tells the renderer to use the 
// face materials
var material = new THREE.MeshFaceMaterial();
var mesh = new THREE.Mesh(geom, material);
This example is adapted from the working code I have, but I have to admit I haven't actually run this exact block of code and I don't have a great track record of getting everything right first go, but hopefully it will help anyone who's struggling