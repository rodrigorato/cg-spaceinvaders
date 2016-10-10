const SHIP_SIZE = {'x': 90, 'y':80, 'z':25};
const ALIEN1_SIZE = {'x': 40, 'y':40, 'z':25};
const ALIEN2_SIZE = {'x': 60, 'y':40, 'z':25};	
const PLAYINGFIELD_SIZE = {'x': 15*SHIP_SIZE.x, 'y':10*SHIP_SIZE.y, 'z':10*SHIP_SIZE.y};
const COLORS = {'red': 		0xff0000, 
				'green': 	0x00ff00,
				'blue': 	0x0000ff,
				'black': 	0x000000,
				'white': 	0xffffff,
				'lightblue':0x00E5FF,
				'purpleish':   0x5d1bd1};
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

	
	createShip(0, 0, 0);
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
		case 65: //A
		case 97: //a
			scene.traverse(function (node) {
				if (node instanceof THREE.Mesh) {
					node.material.wireframe = !node.material.wireframe;
				}
			});
			break;
		case 83: //S
		case 115: //s
			ball.userData.jumping = !ball.userData.jumping;
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

function createCube(obj, x, y, z, dx, dy, dz, material_color){
	// paralelipepedo central
	geometry = new THREE.CubeGeometry(dx,dy,dz);
	// cria um novo material para cada um para evitar colisoes ao dar toggle ao wireframe
	mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: material_color, wireframe: true})); 
	mesh.position.set(x,y,z);
	obj.add(mesh);
}

function createCylinder(obj,x, y, z, radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, material_color){
	temp_geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
	mesh = new THREE.Mesh(temp_geom, new THREE.MeshBasicMaterial({color: material_color, wireframe: true})); 
	mesh.position.set(x, y, z);
	obj.add(mesh);
}

function createShip(x, y, z) {
	'use strict';
	var ship = new THREE.Object3D();

	//createCylinder(ship,0, 0, 0, 0, 100, 200, 8, 5, false, COLORS.blue);
	createCube(ship,0,  0,0,  30,60,20, COLORS.blue );
	createCube(ship,0,-15,-5,  90,10,10,COLORS.blue);

	createCube(ship,40,-25,-5,  10,10,10,COLORS.blue);
	createCube(ship,-40,-25,-5,  10,10,10,COLORS.blue);

	createCylinder(ship,-30,-5,-5,  0,5,10, 3,2,true,COLORS.purpleish);
	createCylinder(ship,30,-5,-5,  0,5,10, 3,2,true,COLORS.purpleish);
	createCylinder(ship,0,-35,-5,  5,0,10, 3,2,true,COLORS.red);
	createCylinder(ship,0,40,0,  0,10,20, 3,2,true,COLORS.purpleish);

	createCylinder(ship,0,10,10,  5,5,20, 3,2,false,COLORS.white);


	//createCylinder(ship,-30,-5,-5,  0,5,10, 8,5,true,COLORS.blue);
	/*
	//createCube(alien,0,0,0,ALIEN1_SIZE.x, ALIEN1_SIZE.y, ALIEN1_SIZE.z);//cubo
	createCube(alien,     0,     5, 0, 10, 30, 25, COLORS.red);//paralelipepedo central
	createCube(alien,   -15,     0, 0, 10, 10, 25, COLORS.red);//cubos
	createCube(alien,   +15,     0, 0, 10, 10, 25, COLORS.red);

	createCube(alien,   +10,  +7.5, 0, 10,  5, 25, COLORS.red);//paralelipipedos mini
	createCube(alien,   -10,  +7.5, 0, 10,  5, 25, COLORS.red);

	createCube(alien,  +7.5, +12.5, 0,  5,  5, 25, COLORS.red);//cubos altos
 	createCube(alien,  -7.5, +12.5, 0,  5,  5, 25, COLORS.red);
	createCube(alien,  +7.5,  -2.5, 0,  5,  5, 25, COLORS.red);
	createCube(alien,  -7.5,  -2.5, 0,  5,  5, 25, COLORS.red);
	
	createCube(alien, +12.5,  -7.5, 0,  5,  5, 15, COLORS.red);//pata direita
	createCube(alien, +17.5, -12.5, 0,  5,  5, 15, COLORS.red);
	createCube(alien, +12.5, -17.5, 0,  5,  5, 15, COLORS.red);
	createCube(alien, -12.5,  -7.5, 0,  5,  5, 15, COLORS.red);//pata esquerda
	createCube(alien, -17.5, -12.5, 0,  5,  5, 15, COLORS.red);
	createCube(alien, -12.5, -17.5, 0,  5,  5, 15, COLORS.red);

	createCube(alien,  -7.5,   2.5, 0,  5, 5, 25, COLORS.white);
	createCube(alien,   7.5,   2.5, 0,  5, 5, 25, COLORS.white);
	*/

	scene.add(ship);
	ship.position.set(x,y,z);
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