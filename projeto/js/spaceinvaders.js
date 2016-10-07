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
				'lightblue':0x00E5FF,
				'purpleish':0x5d1bd1 };
const CAMERA = {"fov": 60, "near": 1, "far": 1000};

const ACCELERATION = 40;

var camera, camera_persp, camera_ortho,
	scene, renderer,
	geometry,material,mesh;

var ball, player;

var clock;


function render() {	
	'use strict';

	renderer.render(scene,camera);
}

function createBall(x,y,z) {
	'use strict';
	
	ball = new THREE.Object3D();
	ball.userData = {jumping: true , step : 0};

	var ball_material = new THREE.MeshBasicMaterial( {color: COLORS.red, wireframe: true });
	geometry = new THREE.SphereGeometry(4,10 ,10);
	mesh = new THREE.Mesh(geometry, ball_material);

	ball.add(mesh);
	ball.position.set(x,y,z);

	scene.add(ball);
}
function createCylinder(obj,x, y, z, radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, material_color){
	temp_geom = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded);
	mesh = new THREE.Mesh(temp_geom, new THREE.MeshBasicMaterial({color: material_color, wireframe: true})); 
	mesh.position.set(x, y, z);
	obj.add(mesh);
}
function createCube(obj, x, y, z, dx, dy, dz, material_color){
	geometry = new THREE.CubeGeometry(dx,dy,dz);
	// cria um novo material para cada um para evitar colisoes ao dar toggle ao wireframe
	mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: material_color, wireframe: true})); 
	mesh.position.set(x,y,z);
	obj.add(mesh);
}

function createPlayer(x, y, z) {
	'use strict';
	
	player = new THREE.Object3D();
	player.userData = {movingRight: false, movingLeft: false, step: 0};

	//createCube(player,0,0,0, SHIP_SIZE.x, SHIP_SIZE.y, SHIP_SIZE.z,COLORS.lightblue);
	createCube(player,0,  0,0,  30,60,20, COLORS.blue );
	createCube(player,0,-15,-5,  90,10,10,COLORS.blue);

	createCube(player,40,-25,-5,  10,10,10,COLORS.blue);
	createCube(player,-40,-25,-5,  10,10,10,COLORS.blue);

	createCylinder(player,-30,-5,-5,  0,5,10,  4,5,true,COLORS.purpleish);
	createCylinder(player,30,-5,-5,  0,5,10, 4,5,true,COLORS.purpleish);
	createCylinder(player,0,-35,-5,  5,0,10, 8,5,true,COLORS.red);
	createCylinder(player,0,40,0,  0,10,20, 8,5,true,COLORS.purpleish);

	createCylinder(player,0,10,10,  5,5,20, 8,5,false,COLORS.white);

	
	player.position.set(x, y, z);
	scene.add(player);
 
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

	createCube(alien,  -7.5,   2.5, 0,  5, 5,  25, COLORS.white);
	createCube(alien,   7.5,   2.5, 0,  5, 5,  25, COLORS.white);

	scene.add(alien);
	alien.position.set(x,y,z);
}


function createRowOfAliens(kind, y, quant){
	'use strict';

	for(var i = 0; i <= quant; i++){
			createAlien1((ALIEN1_SIZE.x * 2) + (i * 100), y, 0);

	}
}

function createLine(verts_array, line_color){
	var line, temp_geom = new THREE.Geometry();
	for(var i = 0; i < verts_array.length; i++){
		temp_geom.vertices.push(verts_array[i]);
	}
	line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color: line_color, linewidth: 800}));
	scene.add(line);
}


function createCamera() {
	'use strict';

	var aspect_ratio = (window.innerWidth / window.innerHeight);

	camera_persp = new THREE.PerspectiveCamera(CAMERA.fov, window.innerWidth / window.innerHeight, CAMERA.near, CAMERA.far);
	camera_ortho = new THREE.OrthographicCamera( PLAYINGFIELD_SIZE.x * aspect_ratio / -2, PLAYINGFIELD_SIZE.x* aspect_ratio / 2, PLAYINGFIELD_SIZE.y/ 2, PLAYINGFIELD_SIZE.y / -2, CAMERA.near, CAMERA.far);
	camera_persp.position.x = (camera_ortho.position.x = Math.ceil(PLAYINGFIELD_SIZE.x / 2));
	camera_persp.position.y = (camera_ortho.position.y = Math.ceil(PLAYINGFIELD_SIZE.y / 2));
	camera_persp.position.z = (camera_ortho.position.z = PLAYINGFIELD_SIZE.z);

	var lookAtVector = new THREE.Vector3(Math.ceil(PLAYINGFIELD_SIZE.x / 2), Math.ceil(PLAYINGFIELD_SIZE.y / 2), 0);
	//lookAtVector.applyQuaternion(camera_persp.quaternion);

	camera_persp.lookAt(lookAtVector); camera_ortho.lookAt(lookAtVector);
	camera = camera_ortho;
}

function createScene() {
	'use strict';

	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));

	createBall(0,PLAYINGFIELD_SIZE.y,0);
	createBall(PLAYINGFIELD_SIZE.x,PLAYINGFIELD_SIZE.y,0);
	createBall(PLAYINGFIELD_SIZE.x,0,0);
	
	/*
	createLine([new THREE.Vector3(0,0,0),
				new THREE.Vector3(0,PLAYINGFIELD_SIZE.y,0),
				new THREE.Vector3(PLAYINGFIELD_SIZE.x,PLAYINGFIELD_SIZE.y,0),
				new THREE.Vector3(PLAYINGFIELD_SIZE.x,0,0)],
				COLORS.lightblue);
	*/

	createPlayer(Math.ceil(PLAYINGFIELD_SIZE.x / 2), SHIP_SIZE.y / 2, 0);

	createRowOfAliens(1, 700, 12);	
	createRowOfAliens(1, 600, 12);	

}

function onResize() {
	'use strict';
	
	renderer.setSize(window.innerWidth, window.innerHeight);

	if (window.innerHeight > 0 && window.innerWidth > 0) 
	{
		var aspect_ratio =(window.innerWidth / window.innerHeight);
		if(aspect_ratio>1){
			camera.left = (PLAYINGFIELD_SIZE.x / -2) * aspect_ratio;
			camera.right = (PLAYINGFIELD_SIZE.x / 2) * aspect_ratio;
			camera.top = PLAYINGFIELD_SIZE.y/ 2;
			camera.bottom = PLAYINGFIELD_SIZE.y / -2;
	
		}else{
			camera.left = (PLAYINGFIELD_SIZE.x / -2) ;
			camera.right = (PLAYINGFIELD_SIZE.x / 2) ;
			camera.top = (PLAYINGFIELD_SIZE.y/ 2) / aspect_ratio;
			camera.bottom = (PLAYINGFIELD_SIZE.y / -2) /aspect_ratio;
		}
		camera.near = CAMERA.near;
		camera.far = CAMERA.far;
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
			player.userData.movingRight = true;

			break;
		case 37: //<--
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
			break;
		case 37: //<--
			player.userData.movingLeft = false;
			break;
	}
}

class helloPerson {
	constructor(name){
		this.name = name;
	}
	doStuff(number){
		console.log("Hello " + this.name + " number " + number + "\n");
	}
}

function movePlayer(){
	'use strict';

	stats.begin();

	// Checks if the player is moving and adds to its movement
	if(player.userData.movingLeft || player.userData.movingRight)
		player.userData.step += (player.userData.movingLeft ? -1:1)*ACCELERATION * clock.getDelta();


	if ((!player.userData.movingLeft && player.userData.step <= 0) || (!player.userData.movingRight && player.userData.step >= 0))
		player.userData.step += (player.userData.step <= 0 ? 1:-1)*ACCELERATION * clock.getDelta();

	/*
	if(player.userData.movingRight)
		player.userData.step +=  ACCELERATION * clock.getDelta();
	
	
	if(!player.userData.movingRight && player.userData.step >= 0)
		player.userData.step -=  3* ACCELERATION * clock.getDelta();
	*/
	
	if (!player.userData.movingRight && !player.userData.movingLeft && Math.abs(player.userData.step) <= ACCELERATION / 10) 
	{
		player.userData.step = 0;
	}

	if (player.userData.step <= 0 && (player.position.x+player.userData.step)<=SHIP_SIZE.x / 2)
	{
		player.position.x = SHIP_SIZE.x / 2;
		player.userData.step = 0;
	}
	else if (player.userData.step <= 0) 
		player.position.x += player.userData.step;
	

	if (player.userData.step >= 0 && (player.position.x+player.userData.step) >= PLAYINGFIELD_SIZE.x-SHIP_SIZE.x / 2)
	{
		player.position.x = PLAYINGFIELD_SIZE.x - SHIP_SIZE.x / 2;
		player.userData.step = 0;
	}
	else if (player.userData.step >= 0) 
		player.position.x += player.userData.step;

	var p = new helloPerson("rato");
	p.doStuff(3);

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

	clock = new THREE.Clock();

	render();

	window.addEventListener("resize",onResize);
	window.addEventListener("keydown",onKeyDown);
	window.addEventListener("keyup",onKeyUp);
}