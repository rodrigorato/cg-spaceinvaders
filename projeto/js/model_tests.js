const SHIP_SIZE = {'x': 90, 'y':80, 'z':25};
const ALIEN1_SIZE = {'x': 40, 'y':40, 'z':25};
const ALIEN2_SIZE = {'x': 60, 'y':40, 'z':25};	
const PLAYINGFIELD_SIZE = {'x': 15*SHIP_SIZE.x, 'y':10*SHIP_SIZE.y, 'z':10*SHIP_SIZE.y};
var MATERIALS = {
	'red': 			new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true }),
	'green': 		new THREE.MeshBasicMaterial({color: 0x00FF00, wireframe: true }),
	'blue': 		new THREE.MeshBasicMaterial({color: 0x0000FF, wireframe: true }),
	'black': 		new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true }),
	'white': 		new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true }),
	'lightblue': 	new THREE.MeshBasicMaterial({color: 0x00E5FF, wireframe: true }),
	'purpleish': 	new THREE.MeshBasicMaterial({color: 0x5D1BD1, wireframe: true }),	

}
const CAMERA = {"fov": 60, "near": 1, "far": 1000};

var camera, scene, renderer;
var geometry,material,mesh;
var ball;
var controls;

function render() {	
	'use strict';
	
	renderer.render(scene,camera);
}



function createCamera() {
	'use strict';

	camera = new THREE.PerspectiveCamera(70,window.innerWidth / window.innerHeight,1,1000);
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 50;
	camera.lookAt(scene.position);
	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );
}

function createScene() {
	'use strict';

	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));


	//createBullet(0,50,0);
	//createPlayer(0,0,0);
	
	createAlien(0, 0, 0);
	createBall(0,0,0,26.1,MATERIALS.white);
	//createAlien(0,-36,0);
	//createBall(50,50,20,27.1,MATERIALS.white);
	var ball = new THREE.Sphere(scene.position,26)
	//var point = new THREE.Vector3(0,-36,0);
	//var ball2 = new THREE.Sphere(point,27.1);
	//console.log(ball.intersectsSphere(ball));
	
}

function onResize() {
	'use strict';
	
	renderer.setSize(window.innerWidth, window.innerHeight);

	if (window.innerHeight > 0 && window.innerWidth > 0) 
	{
		camera.aspect = renderer.getSize().width / renderer.getSize().height;
		camera.updateProjectionMatrix();
	}

}

function onKeyDown(key) {
	'use strict';
	
	switch (key.keyCode)
	{
		case 65: case 97: // A or a
			for(var i in MATERIALS)
				MATERIALS[i].wireframe = !MATERIALS[i].wireframe;
			break;

	}

}

function animate() {
	'use strict';
	
	stats.begin();

	render();

	stats.end();
	
	controls.update();

	requestAnimationFrame(animate);
}

function createCube(obj, x, y, z, dx, dy, dz, material){
	geometry = new THREE.CubeGeometry(dx,dy,dz);
	mesh = new THREE.Mesh(geometry, material); 
	mesh.position.set(x,y,z);
	obj.add(mesh);
}

function createCylinder(obj,x, y, z, radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, material){
	temp_geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
	mesh = new THREE.Mesh(temp_geom, material); 
	mesh.position.set(x, y, z);
	obj.add(mesh);
}
function createBall(x, y, z,radius, material) {
	'use strict';
	
	ball = new THREE.Object3D();
	ball.userData = {jumping: true };

	var ball_material = material;
	geometry = new THREE.SphereGeometry(radius,100,100);
	mesh = new THREE.Mesh(geometry, ball_material);

	ball.add(mesh);
	ball.position.set(x,y,z);

	scene.add(ball);
}
function createBullet(x,y,z){
	createBall(x,y,z,2.5,MATERIALS.white);
}

function createPlayer(x, y, z) {
	'use strict';
	
	var player = new THREE.Object3D();
	player.userData = {movingRight: false, movingLeft: false, vel: 0};

	//createCube(player,0,0,0, SHIP_SIZE.x, SHIP_SIZE.y, SHIP_SIZE.z,COLORS.lightblue);
	createCube(player,	  0,   0,  0, 30, 60, 20, MATERIALS.blue);
	createCube(player,	  0, -15, -5, 90, 10, 10, MATERIALS.blue);

	createCube(player,	 40, -25, -5, 10, 10, 10, MATERIALS.blue);
	createCube(player,	-40, -25, -5, 10, 10, 10, MATERIALS.blue);

	createCylinder(player,	-30,  -5, -5, 0,  5, 10, 3, 2,  true, MATERIALS.purpleish);
	createCylinder(player,	 30,  -5, -5, 0,  5, 10, 3, 2,  true, MATERIALS.purpleish);
	createCylinder(player,	  0, -35, -5, 5,  0, 10, 3, 2,  true, MATERIALS.red);
	createCylinder(player,	  0,  40,  0, 0, 10, 20, 3, 2,  true, MATERIALS.purpleish);

	createCylinder(player,	  0,  10, 10, 5,  5, 20, 3, 2, false, MATERIALS.white);
	
	player.position.set(x, y, z);
	scene.add(player);
 
}
function createAlien(x, y, z) {
	'use strict';
	var alien = new THREE.Object3D();
	//createCube(alien,0,0,0,ALIEN1_SIZE.x, ALIEN1_SIZE.y, ALIEN1_SIZE.z);//cubo
	createCube(alien,     0,     5, 0, 10, 30, 25, MATERIALS.red);//paralelipepedo central
	createCube(alien,   -15,     0, 0, 10, 10, 25, MATERIALS.red);//cubos
	createCube(alien,   +15,     0, 0, 10, 10, 25, MATERIALS.red);

	createCube(alien,   +10,  +7.5, 0, 10,  5, 25, MATERIALS.red);//paralelipipedos mini
	createCube(alien,   -10,  +7.5, 0, 10,  5, 25, MATERIALS.red);

	createCube(alien,  +7.5, +12.5, 0,  5,  5, 25, MATERIALS.red);//cubos altos
 	createCube(alien,  -7.5, +12.5, 0,  5,  5, 25, MATERIALS.red);
	createCube(alien,  +7.5,  -2.5, 0,  5,  5, 25, MATERIALS.red);
	createCube(alien,  -7.5,  -2.5, 0,  5,  5, 25, MATERIALS.red);
	
	createCube(alien, +12.5,  -7.5, 0,  5,  5, 15, MATERIALS.red);//pata direita
	createCube(alien, +17.5, -12.5, 0,  5,  5, 15, MATERIALS.red);
	createCube(alien, +12.5, -17.5, 0,  5,  5, 15, MATERIALS.red);
	createCube(alien, -12.5,  -7.5, 0,  5,  5, 15, MATERIALS.red);//pata esquerda
	createCube(alien, -17.5, -12.5, 0,  5,  5, 15, MATERIALS.red);
	createCube(alien, -12.5, -17.5, 0,  5,  5, 15, MATERIALS.red);

	createCube(alien,  -7.5,   2.5, 0,  5, 5,  25, MATERIALS.white);
	createCube(alien,   7.5,   2.5, 0,  5, 5,  25, MATERIALS.white);

	scene.add(alien);
	alien.position.set(x,y,z);
}




function init() {	
	'use strict';

	renderer = new THREE.WebGLRenderer({antialias : true});

	renderer.setSize(window.innerWidth , window.innerHeight);

	document.body.appendChild(renderer.domElement);

	createScene();
	createCamera();

	render();

	window.addEventListener("resize",onResize);
	window.addEventListener("keydown",onKeyDown);
	//window.addEventListener("mousemove", );
}