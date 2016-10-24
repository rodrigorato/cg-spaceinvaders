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
					 'player': null, 'corners': new Array(),
					 'bulletTime': 1, 'timeBetweenBullets': 0.2};
		this.createScene();
		
		this.cameras = {'ortho': null, 'persp': null, 'player': null, 'active': null,
						"fov": 65, "near": 1, "far": 1000};
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

		this.game.sceneObj.add(new GameLimits(0, 0, 0));

		this.game.player = new GameShip(this.game.size.x / 2, GameShip.getSize().y / 1.5, 0);
		this.game.sceneObj.add(this.game.player);

		this.createRowOfAliens(700, 12);	
		this.createRowOfAliens(600, 12);
		
		
			
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
		this.cameras.player = new THREE.PerspectiveCamera(this.cameras.fov, window.innerWidth / window.innerHeight, this.cameras.near, this.cameras.far);
		this.cameras.ortho.position.x = (SpaceInvaders.getGameSize().x / 2);
		this.cameras.ortho.position.y = (SpaceInvaders.getGameSize().y / 2);
		this.cameras.ortho.position.z = SpaceInvaders.getGameSize().z;

		this.cameras.persp.position.x = (SpaceInvaders.getGameSize().x / 2);
		this.cameras.persp.position.y = -100;
		this.cameras.persp.position.z = 600;

		this.cameras.player.position.x = this.game.player.position.x;
		this.cameras.player.position.y = this.game.player.position.y - 150;
		this.cameras.player.position.z = this.game.player.position.z + 500;

		this.cameras.persp.lookAt(new THREE.Vector3(SpaceInvaders.getGameSize().x / 2, 300, 0));
		this.cameras.player.lookAt(new THREE.Vector3(this.game.player.position.x, 
													 this.game.player.position.y + 200,
													 this.game.player.position.z));
		this.cameras.ortho.lookAt(new THREE.Vector3(SpaceInvaders.getGameSize().x / 2, SpaceInvaders.getGameSize().y / 2, 0));
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


		// Moves the ship and the camera attached to it
		game.game.player.updatePosition(game.game.player.calculatePosition(delta));
		game.cameras.player.position.x = game.game.player.position.x;

		// Shoots the bullet from the ship
		var bullet = game.game.player.shoot(delta);
		if(bullet != null){
			game.game.sceneObj.add(bullet);
			game.game.bullets.push(bullet);
		}


		// Moves the aliens
		for (var i = 0; i < game.game.aliens.length; i++) {
			for (var j = i + 1; j < game.game.aliens.length; j++) {
				if(game.game.aliens[i].hasCollision(game.game.aliens[j], delta)){
					game.game.aliens[i].whenCollided(game.game.aliens[j]);
					game.game.aliens[j].whenCollided(game.game.aliens[i]);
						
				}
				
			}
			game.game.aliens[i].updatePosition(game.game.aliens[i].calculatePosition(delta));
		}

		for(var b in game.game.bullets){
			var didRemoveBullet = false;
			for (var i = 0; i < game.game.aliens.length; i++) {
				if(game.game.aliens[i].hasCollision(game.game.bullets[b], delta)){
					didRemoveBullet = true;
					game.game.sceneObj.remove(game.game.bullets[b]);
					game.game.bullets.splice(b, 1);
					game.game.sceneObj.remove(game.game.aliens[i]);
					game.game.aliens.splice(i, 1);
					break;
				}
			}
			if(!didRemoveBullet){
				if(game.game.bullets[b].hitTheWalls(delta) == 't'){
					game.game.sceneObj.remove(game.game.bullets[b]);
					game.game.bullets.splice(b, 1);
				} else
				game.game.bullets[b].updatePosition(game.game.bullets[b].calculatePosition(delta));
			}
		}

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

		var aspect_ratio =(window.innerWidth / window.innerHeight);
		
		if(me.cameras.active == me.cameras.ortho){
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
		} else 
			me.cameras.active.aspect = aspect_ratio;
		me.cameras.active.updateProjectionMatrix();
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
			case 32: case 66: // B or Space to fire a bullet
				me.game.player.shootRules.shooting = false;
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
				me.game.player.shootRules.shooting = true;
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