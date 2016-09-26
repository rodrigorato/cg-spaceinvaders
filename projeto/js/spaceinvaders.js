/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/

const SHIP_SIZE = {'x': 90, 'y':80, 'z':25};
const ALIEN1_SIZE = {'x': 40, 'y':40, 'z':25};
const ALIEN2_SIZE = {'x': 60, 'y':40, 'z':25};	
const PLAYINGFIELD_SIZE = {'x': 15*SHIP_SIZE.x, 'y':10*SHIP_SIZE.y, 'z':10*SHIP_SIZE.y};
const COLORS = {'red': 		0xff0000, 
				'green': 	0x00ff00,
				'blue': 	0x0000ff,
				'black': 	0x000000,
				'white': 	0xffffff,
				'lightblue':0x00E5FF};
const CAMERA = {"fov": 60, "near": 1, "far": 1000};

var camera, camera_persp, camera_ortho,
	scene, renderer,
	geometry,material,mesh;

var ball, player;


function render() {	
	'use strict';

	renderer.render(scene,camera);
}

function createBall(x,y,z) {
	'use strict';
	
	ball = new THREE.Object3D();
	ball.userData = {jumping: true , step : 0};

	material = new THREE.MeshBasicMaterial( {color: COLORS.red, wireframe: true });
	geometry = new THREE.SphereGeometry(4,10 ,10);
	mesh = new THREE.Mesh(geometry, material);

	ball.add(mesh);
	ball.position.set(x,y,z);

	scene.add(ball);
}

function createPlayer(x, y, z) {
	'use strict';
	
	player = new THREE.Object3D();
	player.userData = {movingRight: false, movingLeft: false, step: 0};

	material = new THREE.MeshBasicMaterial({color: COLORS.lightblue, wireframe: true});
	geometry = new THREE.CubeGeometry(SHIP_SIZE.x, SHIP_SIZE.y, SHIP_SIZE.z);
	mesh = new THREE.Mesh(geometry, material);
	player.add(mesh);
	
	player.position.set(x, y, z);
	scene.add(player);
 
}
function createCube(obj, x, y, z, dx, dy, dz, material_color){
	// paralelipepedo central
	geometry = new THREE.CubeGeometry(dx,dy,dz);
	// cria um novo material para cada um para evitar colisoes ao dar toggle ao wireframe
	mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: material_color, wireframe: true})); 
	mesh.position.set(x,y,z);
	obj.add(mesh);
}
function createAlien1(x, y, z) {
	'use strict';
	var alien = new THREE.Object3D();
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

	scene.add(alien);
	alien.position.set(x,y,z);
}


function createRowOfAliens(kind, y, quant){
	'use strict';

	for(var i = 0; i <= quant; i++){
			createAlien1((ALIEN1_SIZE.x * 2) + (i * 100), y, 0);

	}
}


function createCamera() {
	'use strict';

	camera_persp = new THREE.PerspectiveCamera(CAMERA.fov, window.innerWidth / window.innerHeight, CAMERA.near, CAMERA.far);
	camera_ortho = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, CAMERA.near, CAMERA.far);
	camera_persp.position.x = (camera_ortho.position.x = Math.ceil(PLAYINGFIELD_SIZE.x / 2));
	camera_persp.position.y = (camera_ortho.position.y = Math.ceil(PLAYINGFIELD_SIZE.y / 2));
	camera_persp.position.z = (camera_ortho.position.z = PLAYINGFIELD_SIZE.z);

	var lookAtVector = new THREE.Vector3(Math.ceil(PLAYINGFIELD_SIZE.x / 2), Math.ceil(PLAYINGFIELD_SIZE.y / 2), 0);
	//lookAtVector.applyQuaternion(camera_persp.quaternion);

	camera_persp.lookAt(lookAtVector); camera_ortho.lookAt(lookAtVector);
	camera = camera_persp;
}

function createScene() {
	'use strict';

	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));

	createBall(0,800,0);
	createPlayer(Math.ceil(PLAYINGFIELD_SIZE.x / 2), SHIP_SIZE.y / 2, 0);

	createRowOfAliens(1, 700, 12);	
	createRowOfAliens(1, 600, 12);	

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
			scene.traverse(function (node) {
				if (node instanceof THREE.Mesh) {
					node.material.wireframe = !node.material.wireframe;
				}
			});
			break;

		case 39: //-->
			if (player.userData.movingLeft){
				player.userData.movingLeft = false;
				player.userData.step = 5;
			}
			player.userData.movingRight = true;

			break;
		case 37: //<--
			if(player.userData.movingRight){
				player.userData.movingRight = false;
				player.userData.step = 5;
			}
			player.userData.movingLeft = true;
			break;
		case 80: //p
			camera = camera_persp;
			break;
		case 79: //o
			camera = camera_ortho;
			break;
		break;
	}
	
}
function onKeyUp(key){
	'use strict';
	
	switch (key.keyCode)
	{
		case 39: //-->
			player.userData.movingRight = false;
			player.userData.step = 5;
			break;
		case 37: //<--
			player.userData.movingLeft = false;
			player.userData.step = 5;
			break;
	}
}
function movePlayer(){
	'use strict';

	stats.begin();

	if(player.userData.movingLeft || player.userData.movingRight)
		player.userData.step += 0.8;
	if (player.userData.movingLeft && (player.position.x-player.userData.step)>=45){
		player.position.x -= player.userData.step;
	}
	else if (player.userData.movingLeft) player.position.x=45;
	if (player.userData.movingRight && (player.position.x+player.userData.step)<=1350){
		player.position.x += player.userData.step;
	}
	else if (player.userData.movingRight) player.position.x=1350;
	render();
	requestAnimationFrame(movePlayer);

	stats.end();
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
	window.addEventListener("keyup",onKeyUp);
}