var camera, scene, renderer;
var camera_persp, camera_ortho;
var geometry,material,mesh;

var ball, player;

function render() {	
	'use strict';
	
	renderer.render(scene,camera);
}



/*
function addTableLeg(obj,x,y,z) {
	'use strict';
	
	geometry = new THREE.CubeGeometry(2,6,2);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x,y-3,z);

	obj.add(mesh);
}

function addTableTop(obj,x,y,z) {
	'use strict';
	
	geometry = new THREE.CubeGeometry(60,2,20);
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x,y,z);

	obj.add(mesh);
}

function createTable(x,y,z) {
	'use strict';
	
	var table = new THREE.Object3D();

	material = new THREE.MeshBasicMaterial({color: 0x00ff00 , wireframe: true});

	addTableTop(table,0,0,0);
	addTableLeg(table,-25,-1,-8);
	addTableLeg(table,-25,-1,8);
	addTableLeg(table,25,-1,8);
	addTableLeg(table,25,-1,-8);

	scene.add(table);

	table.position.x = x;
	table.position.y = y;
	table.position.z = z;
}
*/
function createBall(x,y,z) {
	'use strict';
	
	ball = new THREE.Object3D();
	ball.userData = {jumping: true , step : 0};

	material = new THREE.MeshBasicMaterial( {color: 0xff0000, wireframe: true });
	geometry = new THREE.SphereGeometry(4,10 ,10);
	mesh = new THREE.Mesh(geometry, material);

	ball.add(mesh);
	ball.position.set(x,y,z);

	scene.add(ball);
}
function createPlayer(x,y,z) {
	'use strict';
	
	player = new THREE.Object3D();
	player.userData = {movingRight: false, movingLeft: false, step: 0};

	material = new THREE.MeshBasicMaterial({color: 0x00ff00 , wireframe: true});
	geometry = new THREE.CubeGeometry(90,80,25);
	mesh = new THREE.Mesh(geometry, material);
	player.add(mesh);
	
	player.position.set(x,y,z);
	scene.add(player);

}
function createCamera() {
	'use strict';

	camera_persp = new THREE.PerspectiveCamera(70,window.innerWidth / window.innerHeight,1,1000);
	camera_ortho = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2,1,1000);
	camera_persp.position.x = (camera_ortho.position.x = 700);
	camera_persp.position.y = (camera_ortho.position.y = 300);
	camera_persp.position.z = (camera_ortho.position.z = 500);
	camera_persp.lookAt(700,300,0); camera_ortho.lookAt(700, 300, 0);
	camera = camera_persp;
}

function createScene() {
	'use strict';

	scene = new THREE.Scene();
	scene.add(new THREE.AxisHelper(10));

	//createTable(0,0,0);
	createBall(0,0,0);
	createPlayer(45,40,0);
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
/*
function animate() {
	'use strict';
	

	if (ball.userData.jumping) {
		
		ball.userData.step += 0.04;
		ball.position.y = Math.abs(30* (Math.sin(ball.userData.step)));
		ball.position.z = 15 * (Math.cos(ball.userData.step));
	}

	render();



	requestAnimationFrame(animate);
}
*/
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