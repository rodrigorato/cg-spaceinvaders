/*********************
*	Space Invaders   *
*	CG @ IST         *
*	1sem 2016/17     *
*                    *
*	Grupo 29         *
**********************/

class SpaceInvaders {
	static getGameSize(){
		return {'x': 15*GameShip.getSize().x, 'y':10*GameShip.getSize().y, 'z':10*GameShip.getSize().y};
	}

	constructor(){
		this.eventHandler = new EventHandler(this);
		this.eventHandler.addListeners();

		this.renderer = new THREE.WebGLRenderer({antialias : true});
		this.renderer.setSize(window.innerWidth , window.innerHeight);
		document.body.appendChild(this.renderer.domElement);
		
		var size = {'x': 15*GameShip.getSize().x, 'y':10*GameShip.getSize().y, 'z':10*GameShip.getSize().y};
		this.game = {'sceneObj': null, 'size': size,
					 'aliens': new Array(), 'bullets': new Array(),
					 'player': null, 'corners': new Array()};
		this.createScene();
		
		this.cameras = {'ortho': null, 'persp': null, 'player': null, 'active': null,
						"fov": 60, "near": 1, "far": 1000};
		this.createCameras();
		
		this.clock = new THREE.Clock();
		
		this.render();
	}


	render() {	
		'use strict';
		this.renderer.render(this.game.sceneObj, this.cameras.active);
	}
		
	createScene() {
		'use strict';

		this.game.sceneObj = new THREE.Scene();

		// As bolas e o axis helper mostram os cantos do campo de jogo 
		this.game.corners.push(this.createCorner(0,0,0, MATERIALS.red),
							   this.createCorner(0,this.game.size.y,0, MATERIALS.red),
							   this.createCorner(this.game.size.x,this.game.size.y,0, MATERIALS.red),
							   this.createCorner(this.game.size.x,0,0, MATERIALS.red));
		
		this.game.player = new GameShip(this.game.size.x / 2, GameShip.getSize().y / 1.5, 0);
		this.game.sceneObj.add(this.game.player);

		this.createRowOfAliens(700, 12);	
		this.createRowOfAliens(600, 12);
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

		this.game.sceneObj.add(ball);

		return ball;
	}

	createCameras() {
		'use strict';

		this.cameras.ortho = new THREE.OrthographicCamera(this.game.size.x / -2, // Limite esquerdo
														  this.game.size.x /  2, //      e direito
														  this.game.size.y /  2, // Limite superior
														  this.game.size.y / -2, //      e inferior
														  this.cameras.near, // Limite frontal
														  this.cameras.far); //  	  e traseiro

		this.cameras.active = this.cameras.ortho;

		this.cameras.persp = new THREE.PerspectiveCamera(this.cameras.fov, window.innerWidth / window.innerHeight, this.cameras.near, this.cameras.far);
		this.cameras.persp.position.x = (this.cameras.ortho.position.x = (this.game.size.x / 2));
		this.cameras.persp.position.y = (this.cameras.ortho.position.y = (this.game.size.y / 2));
		this.cameras.persp.position.z = (this.cameras.ortho.position.z = this.game.size.z);

		var lookAtVector = new THREE.Vector3(this.game.size.x / 2, this.game.size.y / 2, 0);

		this.cameras.persp.lookAt(lookAtVector); this.cameras.ortho.lookAt(lookAtVector);
		this.onResize();	// Para acertar o aspect ratio.
	}


	createRowOfAliens(y, quant){
		'use strict';
		for(var i = 0; i < quant; i++){
			var alien =  new GameAlien((GameAlien.getSize().x * 2) + (i * ((this.game.size.x - GameAlien.getSize().x) / quant)), y, 0)
			this.game.sceneObj.add(alien);
			this.game.aliens.push(alien);
		}
	}

	animateGame(){
		stats.begin();

		var delta = game.clock.getDelta();

		// Moves the ship
		game.game.player.updatePosition(game.game.player.calculatePosition(delta));
		console.log(game.game.player.position);

		// Moves the aliens
		for(var al in game.game.aliens)
			game.game.aliens[al].updatePosition(game.game.aliens[al].calculatePosition(delta));

		game.render();
		requestAnimationFrame(game.animateGame);
		stats.end();
	}

	onResize(){
		// we need because window calling resize stuff
		var me;
		if(this instanceof SpaceInvaders) me = this;
		else me = game;

		me.renderer.setSize(window.innerWidth, window.innerHeight);

		if (window.innerHeight > 0 && window.innerWidth > 0) 
		{
			var aspect_ratio =(window.innerWidth / window.innerHeight);
			if(aspect_ratio>1){
				me.cameras.ortho.left = (me.game.size.x / -2) * aspect_ratio;
				me.cameras.ortho.right = (me.game.size.x / 2) * aspect_ratio;
				me.cameras.ortho.top = me.game.size.y/ 2;
				me.cameras.ortho.bottom = me.game.size.y / -2;
		
			}else{
				me.cameras.ortho.left = (me.game.size.x / -2) ;
				me.cameras.ortho.right = (me.game.size.x / 2) ;
				me.cameras.ortho.top = (me.game.size.y/ 2) / aspect_ratio;
				me.cameras.ortho.bottom = (me.game.size.y / -2) /aspect_ratio;
			}
			me.cameras.ortho.near = me.cameras.near;
			me.cameras.ortho.far = me.cameras.far;
			me.cameras.ortho.updateProjectionMatrix();
		}
	}

	onKeyUp(key){
		var me;
		if(this instanceof SpaceInvaders) me = this;
		else me = game;

		switch (key.keyCode){
			case 39: //-->
				me.game.player.moving.right = false;
				break;
			case 37: //<--
				me.game.player.moving.left = false;
				break;
			default:
				break;
		}
	}
	
	onKeyDown(key){
		var me;
		if(this instanceof SpaceInvaders) me = this;
		else me = game;

		switch (key.keyCode){
			case 65: case 97: // A or a
				for(var i in MATERIALS)
					MATERIALS[i].wireframe = !MATERIALS[i].wireframe;
				break;
			case 32: case 66: // B or Space to fire a bullet
				break;

			case 39: //-->
				me.game.player.moving.right = true;
				break;

			case 37: //<--
				me.game.player.moving.left = true;
				break;

			case 51: // 3 - Perspective camera following the player
				me.cameras.active = me.cameras.player;
				break;

			case 50: // 2 - Perspective camera of all the field
				me.cameras.active = me.cameras.persp;
				break;

			case 49: // 1 - Orthographic camera
				me.cameras.active = me.cameras.ortho;
				break;

			default:
				break;
		}
	}	
}