/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/

// With "classes"
// x(t) = x0 + v0*t + 1/2*a*t^2

class SpaceInvaders{
	constructor(){
		'use strict';
		// In-game entities' sizes
		this.shipSize = {'x': 90, 'y':80, 'z':25};
		this.alien1Size = {'x': 40, 'y':40, 'z':25};
		this.alien2Size = {'x': 60, 'y':40, 'z':25};

		// The game's playing area
		this.playingFieldSize = {'x': 15*this.shipSize.x, 
								 'y':10*this.shipSize.y, 
								 'z':10*this.shipSize.y};

		// Saves the camera's stuff
		this.camera = {"fov": 60, 
					   "near": 1, 
					   "far": 1000}

		// We'll keep all the materials used here
		this.materials = {};

		// Standard movement constants
		this.movementAcceleration = 40;

		// Start it up
		this.init();
	}

	createScene(){
	'use strict';

	this.scene = new THREE.Scene();
	this.scene.add(new THREE.AxisHelper(10));

	this.createBall(0,this.playingFieldSize.y,0);
	this.createBall(this.playingFieldSize.x,this.playingFieldSize.y,0);
	this.createBall(this.playingFieldSize.x,0,0);


	this.createPlayer(Math.ceil(this.playingFieldSize.x / 2), this.shipSize.y / 2, 0);

	this.createRowOfAliens(1, 700, 12);	
	this.createRowOfAliens(1, 600, 12);	

	}

	createCamera(){
		'use strict';

		var aspect_ratio = (window.innerWidth / window.innerHeight);

		this.camera_persp = new THREE.PerspectiveCamera(this.camera.fov, window.innerWidth / window.innerHeight, this.camera.near, this.camera.far);
		this.camera_ortho = new THREE.OrthographicCamera(this.playingFieldSize.x * aspect_ratio / -2, this.playingFieldSize.x* aspect_ratio / 2, this.playingFieldSize.y/ 2, this.playingFieldSize.y / -2, this.camera.near, this.camera.far);
		this.camera_persp.position.x = (this.camera_ortho.position.x = Math.ceil(this.playingFieldSize.x / 2));
		this.camera_persp.position.y = (this.camera_ortho.position.y = Math.ceil(this.playingFieldSize.y / 2));
		this.camera_persp.position.z = (this.camera_ortho.position.z = this.playingFieldSize.z);

		var lookAtVector = new THREE.Vector3(Math.ceil(this.playingFieldSize.x / 2), Math.ceil(this.playingFieldSize.y / 2), 0);
		//lookAtVector.applyQuaternion(camera_persp.quaternion);

		this.camera_persp.lookAt(lookAtVector); this.camera_ortho.lookAt(lookAtVector);
		this.activeCamera = this.camera_ortho;
	}


	render(){
		'use strict';
		this.renderer.render(this.scene,this.activeCamera);
	}

	init(){
		'use strict';
		this.renderer = new THREE.WebGLRenderer({antialias : true});
		this.renderer.setSize(window.innerWidth , window.innerHeight);

		document.body.appendChild(this.renderer.domElement);

		this.createScene();
		this.createCamera();

		this.clock = new THREE.Clock();

		this.render();

		window.addEventListener("resize", this.onResize);
		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("keyup", this.onKeyUp);
	}
}

// x(t) = x0 + v0*t + 1/2*a*t^2
class Moveable{
	constructor(accel, obj){
		this.accel = accel;
		this.obj = obj;
	}

	moveX(delta){

	}
}