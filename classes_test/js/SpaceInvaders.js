/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/


const SHIP_SIZE = {'x': 90, 'y':80, 'z':25};
const ALIEN1_SIZE = {'x': 40, 'y':40, 'z':25};
//const ALIEN2_SIZE = {'x': 60, 'y':40, 'z':25};	
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

const ACCELERATION = 3000;
class SpaceInvaders {
	constructor(){
		this.eventHandler = new EventHandler(this);
		this.eventHandler.addListeners();
		this.aliens = [];
	}

	onResize(){
		console.log(this);
		console.log("resized!");
	}

	onKeyUp(keyCode){
		console.log(keyCode + " up!");
	}
	
	onKeyDown(keyCode){
		console.log(keyCode + " down!");
	}	

	init(){
		this.renderer = new THREE.WebGLRenderer({antialias : true});
		this.renderer.setSize(window.innerWidth , window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		this.createCameras();
		this.createScene();
		this.clock = new THREE.Clock();
			
	}

	createScene() {
		'use strict';

		this.scene = new THREE.Scene();

		// As bolas e o axis helper mostram os cantos do campo de jogo 
		this.scene.add(new THREE.AxisHelper(10));
		this.createCorner(0,PLAYINGFIELD_SIZE.y,0, MATERIALS.red);
		this.createCorner(PLAYINGFIELD_SIZE.x,PLAYINGFIELD_SIZE.y,0, MATERIALS.red);
		this.createCorner(PLAYINGFIELD_SIZE.x,0,0, MATERIALS.red);
		
		this.createPlayer(PLAYINGFIELD_SIZE.x / 2, SHIP_SIZE.y / 1.5, 0);

		this.createRowOfAliens(700, 12);	
		this.createRowOfAliens(600, 12);
		this.render();	
		}

	createCorner(x, y, z, material) {
		'use strict';
		
		var ball = new THREE.Object3D();
		ball.userData = {jumping: true };

		var ball_material = material;
		var geometry = new THREE.SphereGeometry(4,10 ,10);
		var mesh = new THREE.Mesh(geometry, ball_material);

		ball.add(mesh);
		ball.position.set(x,y,z);

		this.scene.add(ball);
}

	createCameras() {
		'use strict';

		this.cameras = [];
		var camera_ortho = new THREE.OrthographicCamera(PLAYINGFIELD_SIZE.x / -2, // Limite esquerdo
											 PLAYINGFIELD_SIZE.x /  2, 		  //      e direito
											 PLAYINGFIELD_SIZE.y /  2,        // Limite superior
											 PLAYINGFIELD_SIZE.y / -2,        //      e inferior
											 CAMERA.near,			          // Limite frontal
											 CAMERA.far);			          //  	  e traseiro

		var camera_persp = new THREE.PerspectiveCamera(CAMERA.fov, window.innerWidth / window.innerHeight, CAMERA.near, CAMERA.far);
		camera_persp.position.x = (camera_ortho.position.x = (PLAYINGFIELD_SIZE.x / 2));
		camera_persp.position.y = (camera_ortho.position.y = (PLAYINGFIELD_SIZE.y / 2));
		camera_persp.position.z = (camera_ortho.position.z = PLAYINGFIELD_SIZE.z);

		var lookAtVector = new THREE.Vector3(PLAYINGFIELD_SIZE.x / 2, PLAYINGFIELD_SIZE.y / 2, 0);

		camera_persp.lookAt(lookAtVector); camera_ortho.lookAt(lookAtVector);
		this.cameras.push(camera_ortho,camera_persp);
		this.onResize();	// Para acertar o aspect ratio.
}

	render() {	
		'use strict';
		this.renderer.render(this.scene,this.cameras[0]);
	}
		

	createPlayer(x, y, z) {
	 	this.scene.add(this.player = new GameShip(x,y,z));
	}

	createRowOfAliens(y, quant){
	'use strict';

	for(var i = 0; i < quant; i++)
		{
			var a =  new GameAlien((ALIEN1_SIZE.x * 2) + (i * ((PLAYINGFIELD_SIZE.x - ALIEN1_SIZE.x) / quant)), y, 0)
			this.scene.add(a);
			this.aliens.push(a);
		}
}

	movePlayer(){
		console.log("move.");
	}
}